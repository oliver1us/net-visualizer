import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { test } from 'node:test';

const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3000';
const allowLoopback = process.env.TEST_ALLOW_LOOPBACK === '1';

async function probe(body, extra = {}) {
  const response = await fetch(`${base}/api/probe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...extra },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

test('health endpoint responds without probing a target', async () => {
  const response = await fetch(`${base}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('rejects unsupported protocols, invalid requests and cross-origin requests', async () => {
  const unsupported = await probe({
    host: '127.0.0.1',
    protocol: 'SCTP',
    port: 53,
  });
  assert.equal(unsupported.status, 400);
  assert.equal(unsupported.body.code, 'unsupported');
  assert.equal(
    (await probe({ host: {}, protocol: 'TCP', port: 80 })).status,
    400,
  );
  assert.equal(
    (await probe({ host: '127.0.0.1', protocol: 'TCP', port: 0 })).status,
    400,
  );
  assert.equal(
    (
      await probe(
        { host: '127.0.0.1', protocol: 'TCP', port: 80 },
        { origin: 'https://example.invalid' },
      )
    ).status,
    403,
  );
  const invalid = await fetch(`${base}/api/probe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: 'null',
  });
  assert.equal(invalid.status, 400);
  const large = await fetch(`${base}/api/probe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ host: 'x'.repeat(3000) }),
  });
  assert.equal(large.status, 413);
});

test('network policy rejects non-allowed address', async () => {
  for (const protocol of ['TCP', 'UDP', 'ICMP']) {
    const result = await probe({
      host: '169.254.169.254',
      protocol,
      port: protocol === 'ICMP' ? null : 80,
    });
    assert.equal(result.status, 403);
    assert.equal(result.body.code, 'policy');
  }
});

test('a nonexistent DNS name produces a distinct error', async () => {
  const result = await probe({
    host: 'nonexistent-netviz-test.invalid',
    protocol: 'TCP',
    port: 443,
  });
  assert.equal(result.status, 502);
  assert.equal(result.body.reachable, false);
  assert.equal(result.body.code, 'dns_not_found');
});

test('TCP loopback respects the configured policy', async () => {
  // 3000 is the application port inside the container, independent of host port.
  const result = await probe({
    host: '127.0.0.1',
    protocol: 'TCP',
    port: 3000,
  });
  if (allowLoopback) {
    assert.equal(result.status, 200);
    assert.equal(result.body.reachable, true);
    assert.equal(typeof result.body.rtt, 'number');
  } else {
    assert.equal(result.status, 403);
    assert.equal(result.body.code, 'policy');
  }
});

test(
  'closed TCP port is a connection failure',
  { skip: !allowLoopback },
  async () => {
    // Reserve an ephemeral port briefly; this test runs against a container and
    // does not require a test server to be reachable from inside it.
    const server = createServer();
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    await new Promise((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve())),
    );
    const result = await probe({ host: '127.0.0.1', protocol: 'TCP', port });
    assert.equal(result.status, 200);
    assert.equal(result.body.reachable, false);
    assert.equal(result.body.code, 'refused');
  },
);

test(
  'ICMP echo replies from the worker network namespace',
  { skip: !allowLoopback },
  async () => {
    const result = await probe({
      host: '127.0.0.1',
      protocol: 'ICMP',
      port: null,
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.reachable, true);
    assert.equal(typeof result.body.rtt, 'number');
  },
);

test(
  'UDP DNS fixture returns a valid response through the worker',
  { skip: !process.env.TEST_DNS_PORT },
  async () => {
    const result = await probe({
      host: '127.0.0.1',
      protocol: 'UDP',
      port: Number(process.env.TEST_DNS_PORT),
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.reachable, true);
    assert.equal(typeof result.body.rtt, 'number');
  },
);
