import net from 'node:net';

export function firstAllowedAddress(
  addresses: { address: string; family: number }[],
  allowed: net.BlockList,
) {
  return addresses.find(({ address, family }) =>
    allowed.check(address, family === 4 ? 'ipv4' : 'ipv6'),
  );
}
