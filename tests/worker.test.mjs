import assert from 'node:assert/strict';
import dgram from 'node:dgram';
import { test } from 'node:test';
import {
  dnsQuery,
  isAllowed,
  udpDnsProbe,
  validDnsResponse,
} from '../worker/probes.mjs';

function answer(query) {
  const reply = Buffer.from(query);
  reply.writeUInt16BE(0x8180, 2);
  return reply;
}

test('worker network policy defaults to deny and rejects malformed CIDRs', () => {
  assert.equal(isAllowed('127.0.0.1', ''), false);
  assert.equal(isAllowed('127.0.0.1', '127.0.0.0/8'), true);
  assert.equal(isAllowed('::1', '127.0.0.0/8'), false);
  assert.throws(() => isAllowed('127.0.0.1', '127.0.0.1/not-a-prefix'));
});

test('DNS response must match the query and be complete and successful', () => {
  const query = dnsQuery(42);
  const valid = answer(query);
  assert.equal(validDnsResponse(valid, 42), true);
  assert.equal(validDnsResponse(query, 42), false);
  assert.equal(validDnsResponse(valid, 43), false);
  assert.equal(validDnsResponse(valid.subarray(0, -1), 42), false);
  const truncated = Buffer.from(valid);
  truncated[2] |= 2;
  assert.equal(validDnsResponse(truncated, 42), false);
  const badCode = Buffer.from(valid);
  badCode[3] |= 2;
  assert.equal(validDnsResponse(badCode, 42), false);
  const wrongQuestion = Buffer.from(valid);
  wrongQuestion[13] = 0x78;
  assert.equal(validDnsResponse(wrongQuestion, 42), false);
  const badRecord = Buffer.from(valid);
  badRecord.writeUInt16BE(1, 6);
  assert.equal(validDnsResponse(badRecord, 42), false);
  const pointerLoop = Buffer.from(valid);
  pointerLoop[12] = 0xc0;
  pointerLoop[13] = 12;
  assert.equal(validDnsResponse(pointerLoop, 42), false);
});

test('UDP only succeeds after a valid matching DNS response', async () => {
  const server = dgram.createSocket('udp4');
  server.on('message', (msg, remote) => {
    const invalid = answer(msg);
    invalid.writeUInt16BE((msg.readUInt16BE() + 1) & 0xffff);
    server.send(invalid, remote.port, remote.address);
    server.send(answer(msg), remote.port, remote.address);
  });
  await new Promise((resolve) => server.bind(0, '127.0.0.1', resolve));
  try {
    const result = await udpDnsProbe('127.0.0.1', server.address().port);
    assert.equal(result.reachable, true);
    assert.equal(typeof result.rtt, 'number');
  } finally {
    server.close();
  }
});

test('UDP silence is not considered reachable', async () => {
  const server = dgram.createSocket('udp4');
  server.on('message', () => {});
  await new Promise((resolve) => server.bind(0, '127.0.0.1', resolve));
  try {
    const result = await udpDnsProbe('127.0.0.1', server.address().port);
    assert.equal(result.reachable, false);
    assert.equal(result.code, 'dns_timeout');
  } finally {
    server.close();
  }
});
