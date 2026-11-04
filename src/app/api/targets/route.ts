import { addTarget, checkTarget, targets } from '@/lib/monitor-store';

export async function GET() {
  return Response.json(
    { targets: targets() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: Request) {
  if (
    request.headers.get('origin') &&
    new URL(request.headers.get('origin')!).host !== request.headers.get('host')
  )
    return Response.json({ error: 'Cross-origin request.' }, { status: 403 });
  if (
    !request.headers.get('content-type')?.startsWith('application/json') ||
    Number(request.headers.get('content-length') ?? 0) > 1024
  )
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  let input: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > 1024) throw new Error();
    input = JSON.parse(text);
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const host = typeof input.host === 'string' ? input.host.trim() : '';
  const protocol = input.protocol;
  const port = input.port;
  const interval = input.interval;
  if (
    !host ||
    host.length > 253 ||
    !/^[a-zA-Z0-9.:-]+$/.test(host) ||
    (protocol !== 'TCP' && protocol !== 'ICMP' && protocol !== 'UDP') ||
    (protocol === 'ICMP'
      ? port !== null
      : typeof port !== 'number' ||
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65535) ||
    ![10, 30, 60].includes(interval as number)
  )
    return Response.json(
      { error: 'Invalid target or interval.' },
      { status: 400 },
    );
  const result = addTarget(
    host,
    protocol,
    port as number | null,
    interval as number,
  );
  if ('error' in result) return Response.json(result, { status: 409 });
  void checkTarget(result.id!);
  return Response.json(result, { status: 201 });
}
