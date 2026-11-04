import { checkTarget, removeTarget } from '@/lib/monitor-store';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (
    request.headers.get('origin') &&
    new URL(request.headers.get('origin')!).host !== request.headers.get('host')
  )
    return new Response(null, { status: 403 });
  return new Response(null, {
    status: removeTarget((await params).id) ? 204 : 404,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (
    request.headers.get('origin') &&
    new URL(request.headers.get('origin')!).host !== request.headers.get('host')
  )
    return new Response(null, { status: 403 });
  void checkTarget((await params).id);
  return new Response(null, { status: 202 });
}
