import { chmodSync, lstatSync, unlinkSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import { icmpProbe, isAllowed, udpDnsProbe } from './probes.mjs';

const path = '/run/probe/worker.sock';
try {
  if (!lstatSync(path).isSocket())
    throw new Error('Refusing to replace a non-socket file');
  unlinkSync(path);
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}

let active = 0;
const server = http.createServer(async (request, response) => {
  const send = (status, data) =>
    response
      .writeHead(status, {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      })
      .end(JSON.stringify(data));
  if (request.method === 'GET' && request.url === '/health')
    return send(200, { status: 'ok' });
  if (request.method !== 'POST' || request.url !== '/probe')
    return send(404, { error: 'Not found.' });
  if (active >= 10)
    return send(429, {
      reachable: false,
      rtt: null,
      code: 'busy',
      error: 'Worker is busy.',
    });
  active++;
  try {
    let body = '';
    for await (const chunk of request) {
      body += chunk;
      if (body.length > 1024) return send(413, { error: 'Request too large.' });
    }
    let input;
    try {
      input = JSON.parse(body);
    } catch {
      return send(400, { error: 'Invalid JSON.' });
    }
    if (
      !input ||
      typeof input !== 'object' ||
      typeof input.address !== 'string' ||
      !net.isIP(input.address) ||
      !['ICMP', 'UDP'].includes(input.protocol) ||
      (input.protocol === 'UDP' &&
        (!Number.isInteger(input.port) || input.port < 1 || input.port > 65535))
    ) {
      return send(400, { error: 'Invalid probe.' });
    }
    try {
      if (!isAllowed(input.address, process.env.PROBE_ALLOWED_CIDRS))
        return send(403, {
          reachable: false,
          rtt: null,
          code: 'worker_policy',
          error: 'Destination is not allowed by worker policy.',
        });
    } catch {
      return send(503, {
        reachable: false,
        rtt: null,
        code: 'configuration',
        error: 'Invalid worker network policy.',
      });
    }
    const result =
      input.protocol === 'ICMP'
        ? await icmpProbe(input.address)
        : await udpDnsProbe(input.address, input.port);
    return send(200, result);
  } catch {
    if (!response.headersSent)
      send(500, {
        reachable: false,
        rtt: null,
        code: 'worker_error',
        error: 'Worker failed.',
      });
  } finally {
    active--;
  }
});
server.headersTimeout = 5000;
server.requestTimeout = 5000;
server.listen(path, () => chmodSync(path, 0o600));
