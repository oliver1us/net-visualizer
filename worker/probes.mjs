import { execFile } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import dgram from 'node:dgram';
import net from 'node:net';

export const TIMEOUT_MS = 3000;

export function isAllowed(address, policy) {
  const list = new net.BlockList();
  const entries = (policy ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const entry of entries) {
    const parts = entry.split('/');
    const family = net.isIP(parts[0]);
    const prefix =
      parts.length === 1 ? (family === 4 ? 32 : 128) : Number(parts[1]);
    if (
      !family ||
      parts.length > 2 ||
      (parts.length === 2 && !/^\d+$/.test(parts[1])) ||
      !Number.isInteger(prefix) ||
      prefix < 0 ||
      prefix > (family === 4 ? 32 : 128)
    )
      throw new Error('Invalid network policy');
    list.addSubnet(parts[0], prefix, family === 4 ? 'ipv4' : 'ipv6');
  }
  const family = net.isIP(address);
  return !!family && list.check(address, family === 4 ? 'ipv4' : 'ipv6');
}

const failure = (code, error) => ({ reachable: false, rtt: null, code, error });

export function icmpProbe(address) {
  return new Promise((resolve) => {
    const args = [
      net.isIP(address) === 4 ? '-4' : '-6',
      '-n',
      '-c',
      '1',
      '-W',
      '3',
      address,
    ];
    execFile(
      '/usr/bin/ping',
      args,
      {
        timeout: 4000,
        maxBuffer: 8192,
        env: { LC_ALL: 'C', PATH: '/usr/bin:/bin' },
      },
      (err, stdout) => {
        if (err) {
          if (err.code === 1 || err.killed)
            return resolve(failure('timeout', 'No ICMP echo reply.'));
          return resolve(
            failure(
              'icmp_unavailable',
              'ICMP probe could not run; check worker permissions.',
            ),
          );
        }
        const match = /\btime[=<]([\d.]+)\s*ms\b/.exec(stdout);
        if (!match)
          return resolve(
            failure('icmp_unavailable', 'Could not read ICMP echo time.'),
          );
        resolve({
          reachable: true,
          rtt: Math.max(1, Math.round(Number(match[1]))),
        });
      },
    );
  });
}

const QUESTION = Buffer.from('076578616d706c6503636f6d0000010001', 'hex'); // example.com IN A

export function dnsQuery(id) {
  const header = Buffer.alloc(12);
  header.writeUInt16BE(id, 0);
  header.writeUInt16BE(0x0100, 2); // recursion desired
  header.writeUInt16BE(1, 4);
  return Buffer.concat([header, QUESTION]);
}

// Walk compressed DNS names with strict bounds and loop checks. Return both the
// expanded, case-insensitive name and the position after the encoded name.
function readName(data, offset) {
  const labels = [];
  const seen = new Set();
  let cursor = offset;
  let end;
  let length = 0;
  while (true) {
    if (cursor >= data.length || seen.has(cursor))
      throw new Error('Invalid DNS name');
    seen.add(cursor);
    const n = data[cursor++];
    if ((n & 0xc0) === 0xc0) {
      if (cursor >= data.length) throw new Error('Invalid DNS pointer');
      end ??= cursor + 1;
      cursor = ((n & 0x3f) << 8) | data[cursor];
      continue;
    }
    if (n & 0xc0 || n > 63 || cursor + n > data.length)
      throw new Error('Invalid DNS label');
    if (n === 0)
      return { name: labels.join('.').toLowerCase(), end: end ?? cursor };
    length += n + 1;
    if (length > 255) throw new Error('DNS name too long');
    labels.push(data.subarray(cursor, cursor + n).toString('ascii'));
    cursor += n;
  }
}

export function validDnsResponse(data, id) {
  try {
    if (data.length < 12 || data.readUInt16BE(0) !== id) return false;
    const flags = data.readUInt16BE(2);
    // Must be a non-truncated successful standard response to our one question.
    if (
      !(flags & 0x8000) ||
      flags & 0x7800 ||
      flags & 0x0200 ||
      flags & 0x000f ||
      data.readUInt16BE(4) !== 1
    )
      return false;
    const question = readName(data, 12);
    let offset = question.end;
    if (
      question.name !== 'example.com' ||
      offset + 4 > data.length ||
      data.readUInt16BE(offset) !== 1 ||
      data.readUInt16BE(offset + 2) !== 1
    )
      return false;
    offset += 4;
    const count =
      data.readUInt16BE(6) + data.readUInt16BE(8) + data.readUInt16BE(10);
    for (let i = 0; i < count; i++) {
      offset = readName(data, offset).end;
      if (offset + 10 > data.length) return false;
      const size = data.readUInt16BE(offset + 8);
      offset += 10 + size;
      if (offset > data.length) return false;
    }
    return offset === data.length;
  } catch {
    return false;
  }
}

export function udpDnsProbe(address, port) {
  return new Promise((resolve) => {
    const id = randomBytes(2).readUInt16BE();
    const started = performance.now();
    const socket = dgram.createSocket(
      net.isIP(address) === 4 ? 'udp4' : 'udp6',
    );
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.close();
      resolve(result);
    };
    const timer = setTimeout(
      () => finish(failure('dns_timeout', 'No valid DNS response over UDP.')),
      TIMEOUT_MS,
    );
    socket.once('error', () =>
      finish(failure('dns_transport', 'UDP DNS transport failed.')),
    );
    socket.on('message', (data) => {
      if (validDnsResponse(data, id))
        finish({
          reachable: true,
          rtt: Math.max(1, Math.round(performance.now() - started)),
        });
    });
    // A connected UDP socket only accepts packets from the selected IP/port.
    socket.connect(port, address, () => socket.send(dnsQuery(id)));
  });
}
