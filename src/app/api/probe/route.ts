import { lookup } from 'node:dns/promises';
import http from 'node:http';
import net from 'node:net';

import { NextResponse } from 'next/server';
import { firstAllowedAddress } from '@/lib/probe-address';

const TIMEOUT_MS = 3000;
const MAX_CONCURRENT = 10;
let activeProbes = 0;

type ProbeRequest = { host?: unknown; protocol?: unknown; port?: unknown };

function error(message: string, status: number, code: string) {
  return NextResponse.json(
    { reachable: false, rtt: null, error: message, code },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

function allowedNetworks() {
  const blockList = new net.BlockList();
  const entries = (process.env.PROBE_ALLOWED_CIDRS ?? '')
    .split(',')
    .map((entry) => entry.trim())
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
    ) {
      throw new Error('Invalid PROBE_ALLOWED_CIDRS configuration.');
    }
    blockList.addSubnet(parts[0], prefix, family === 4 ? 'ipv4' : 'ipv6');
  }
  return blockList;
}

async function resolveTarget(host: string) {
  const family = net.isIP(host);
  if (family) return [{ address: host, family }];
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      lookup(host, { all: true, verbatim: true }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error('DNS lookup timed out.')),
          TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

function tcpProbe(address: string, family: number, port: number) {
  return new Promise<{
    reachable: boolean;
    rtt: number | null;
    error?: string;
    code?: string;
  }>((resolve) => {
    const startedAt = performance.now();
    const socket = net.createConnection({ host: address, family, port });
    let settled = false;
    const finish = (result: {
      reachable: boolean;
      rtt: number | null;
      error?: string;
      code?: string;
    }) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(TIMEOUT_MS);
    socket.once('connect', () =>
      finish({
        reachable: true,
        rtt: Math.max(1, Math.round(performance.now() - startedAt)),
      }),
    );
    socket.once('timeout', () =>
      finish({
        reachable: false,
        rtt: null,
        error: 'Connection timed out.',
        code: 'timeout',
      }),
    );
    socket.once('error', (err: NodeJS.ErrnoException) =>
      finish({
        reachable: false,
        rtt: null,
        error: 'Connection failed.',
        code: err.code === 'ECONNREFUSED' ? 'refused' : 'connection_error',
      }),
    );
  });
}

function workerProbe(
  address: string,
  protocol: 'ICMP' | 'UDP',
  port: number | null,
) {
  return new Promise<{
    reachable: boolean;
    rtt: number | null;
    error?: string;
    code?: string;
  }>((resolve, reject) => {
    const socketPath = process.env.PROBE_WORKER_SOCKET;
    if (!socketPath) return reject(new Error('Worker is not configured.'));
    const payload = JSON.stringify({ address, protocol, port });
    const req = http.request(
      {
        socketPath,
        path: '/probe',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk: string) => {
          data += chunk;
          if (data.length > 4096)
            req.destroy(new Error('Invalid worker response.'));
        });
        res.on('error', reject);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (
              typeof result.reachable !== 'boolean' ||
              !(
                result.rtt === null ||
                (typeof result.rtt === 'number' && Number.isFinite(result.rtt))
              )
            )
              throw new Error('Invalid worker response.');
            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      },
    );
    req.setTimeout(5000, () => req.destroy(new Error('Worker timed out.')));
    req.on('error', reject);
    req.end(payload);
  });
}

export async function POST(request: Request) {
  // Browser requests must be same-origin. Non-browser API clients do not send Origin.
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get('host'))
        return error('Cross-origin requests are not allowed.', 403, 'origin');
    } catch {
      return error('Invalid origin.', 403, 'origin');
    }
  }
  if (
    !request.headers
      .get('content-type')
      ?.toLowerCase()
      .startsWith('application/json')
  )
    return error('Expected application/json.', 415, 'invalid_request');
  if (Number(request.headers.get('content-length') ?? 0) > 2048)
    return error('Request too large.', 413, 'invalid_request');
  if (activeProbes >= MAX_CONCURRENT)
    return error('Too many concurrent probes.', 429, 'busy');
  activeProbes++;
  try {
    // Limit the request before parsing, including chunked requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return error('Invalid request body.', 400, 'invalid_request');
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 2048) {
        await reader.cancel();
        return error('Request too large.', 413, 'invalid_request');
      }
      chunks.push(value);
    }
    let body: ProbeRequest;
    try {
      const parsed: unknown = JSON.parse(
        Buffer.concat(chunks).toString('utf8'),
      );
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
        throw new Error();
      body = parsed as ProbeRequest;
    } catch {
      return error('Invalid request body.', 400, 'invalid_request');
    }
    if (
      body.protocol !== 'TCP' &&
      body.protocol !== 'UDP' &&
      body.protocol !== 'ICMP'
    )
      return error('Unsupported probe protocol.', 400, 'unsupported');
    const host = typeof body.host === 'string' ? body.host.trim() : '';
    const port = body.port;
    if (
      !host ||
      host.length > 253 ||
      !/^[a-zA-Z0-9.:-]+$/.test(host) ||
      (body.protocol === 'ICMP'
        ? port !== null && port !== undefined
        : typeof port !== 'number' ||
          !Number.isInteger(port) ||
          port < 1 ||
          port > 65535)
    ) {
      return error('Invalid host or port.', 400, 'invalid_request');
    }
    let allowed: net.BlockList;
    try {
      allowed = allowedNetworks();
    } catch {
      return error('Invalid server network policy.', 503, 'configuration');
    }
    let addresses: { address: string; family: number }[];
    try {
      addresses = await resolveTarget(host);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOTFOUND') {
        return error(
          'The hostname could not be found by DNS.',
          502,
          'dns_not_found',
        );
      }
      return error('DNS lookup failed or timed out.', 502, 'dns_error');
    }
    // Connect only to an allowed resolved IP, never resolve the hostname a
    // second time (DNS rebinding). Skip disallowed IPv6 when IPv4 is allowed.
    const target = firstAllowedAddress(addresses, allowed);
    if (!target) {
      return error(
        'Destination is not allowed by server policy.',
        403,
        'policy',
      );
    }
    let result;
    if (body.protocol === 'TCP') {
      result = await tcpProbe(target.address, target.family, port as number);
    } else {
      try {
        result = await workerProbe(
          target.address,
          body.protocol,
          body.protocol === 'ICMP' ? null : (port as number),
        );
      } catch {
        return error('Probe worker is unavailable.', 503, 'worker_unavailable');
      }
    }
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } finally {
    activeProbes--;
  }
}
