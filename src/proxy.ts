import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/api/health') return NextResponse.next();
  const password = process.env.PROBE_PASSWORD;
  if (!password || password.length < 16) {
    return new NextResponse(
      'Set PROBE_PASSWORD (at least 16 characters) before using the dashboard.',
      { status: 503 },
    );
  }
  const header = request.headers.get('authorization') ?? '';
  let credentials = '';
  try {
    if (header.startsWith('Basic ') && header.length < 1024)
      credentials = atob(header.slice(6));
  } catch {
    /* invalid encoding */
  }
  const expected = Buffer.from(`admin:${password}`);
  const actual = Buffer.from(credentials);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Net Visualizer", charset="UTF-8"',
        'Cache-Control': 'no-store',
      },
    });
  }
  return NextResponse.next();
}

export const config = { matcher: ['/visualizer/:path*', '/api/:path*'] };
