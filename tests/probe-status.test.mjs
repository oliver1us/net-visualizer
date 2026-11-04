import assert from 'node:assert/strict';
import { test } from 'node:test';
import { describeProbe } from '../src/lib/probe-status.ts';

test('only a real successful result is responding', () => {
  for (const protocol of ['TCP', 'ICMP', 'UDP']) {
    const result = describeProbe(protocol, { reachable: true, rtt: 12 });
    assert.equal(result.status, 'healthy');
    assert.match(
      result.message,
      protocol === 'UDP' ? /DNS/ : new RegExp(protocol),
    );
  }
  assert.notEqual(
    describeProbe('TCP', { reachable: true, rtt: null }).status,
    'healthy',
  );
});

test('DNS failures, blocked targets and a missing worker are not host outages', () => {
  for (const code of [
    'dns_not_found',
    'dns_error',
    'policy',
    'worker_policy',
    'worker_unavailable',
    'icmp_unavailable',
  ]) {
    assert.equal(
      describeProbe('TCP', { reachable: false, rtt: null, code }).status,
      'error',
    );
  }
  assert.match(
    describeProbe('TCP', { reachable: false, rtt: null, code: 'dns_not_found' })
      .message,
    /not found/i,
  );
  assert.match(
    describeProbe('ICMP', { reachable: false, rtt: null, code: 'policy' })
      .message,
    /net-visualizer/,
  );
  assert.match(
    describeProbe('UDP', { reachable: false, rtt: null, code: 'worker_policy' })
      .message,
    /probe-worker/,
  );
});

test('a refused TCP port and missing ICMP reply are not reported as connected', () => {
  assert.equal(
    describeProbe('TCP', { reachable: false, rtt: null, code: 'refused' })
      .status,
    'down',
  );
  assert.match(
    describeProbe('TCP', { reachable: false, rtt: null, code: 'refused' })
      .message,
    /port is closed/,
  );
  assert.match(
    describeProbe('ICMP', { reachable: false, rtt: null, code: 'timeout' })
      .message,
    /filtering ICMP/,
  );
});

test('UDP silence is inconclusive, not proof the host is down', () => {
  const result = describeProbe('UDP', {
    reachable: false,
    rtt: null,
    code: 'dns_timeout',
  });
  assert.equal(result.status, 'unknown');
  assert.match(result.message, /does not prove/);
});
