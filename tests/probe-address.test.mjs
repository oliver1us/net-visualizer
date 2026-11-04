import assert from 'node:assert/strict';
import net from 'node:net';
import { test } from 'node:test';
import { firstAllowedAddress } from '../src/lib/probe-address.ts';

test('chooses an allowed IPv4 address when DNS returns disallowed IPv6 first', () => {
  const allowed = new net.BlockList();
  allowed.addSubnet('0.0.0.0', 0, 'ipv4');
  assert.deepEqual(
    firstAllowedAddress(
      [
        { address: '2001:db8::1', family: 6 },
        { address: '8.8.8.8', family: 4 },
      ],
      allowed,
    ),
    { address: '8.8.8.8', family: 4 },
  );
});

test('never chooses an address outside policy', () => {
  const allowed = new net.BlockList();
  allowed.addAddress('8.8.8.8');
  assert.equal(
    firstAllowedAddress([{ address: '2001:db8::1', family: 6 }], allowed),
    undefined,
  );
  assert.equal(firstAllowedAddress([], allowed), undefined);
  assert.deepEqual(
    firstAllowedAddress(
      [
        { address: '1.1.1.1', family: 4 },
        { address: '8.8.8.8', family: 4 },
      ],
      allowed,
    ),
    { address: '8.8.8.8', family: 4 },
  );
});
