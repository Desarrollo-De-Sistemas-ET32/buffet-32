import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const headers = Object.fromEntries(req.headers.entries());
    const rawBody = await req.text();
    let parsed: unknown = undefined;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
    }
    const svixId = headers['svix-id'];
    const svixTimestamp = headers['svix-timestamp'];
    const svixSignature = headers['svix-signature'];
    console.log('[Clerk Webhook] headers:', {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature
    });
    console.log('[Clerk Webhook] raw body:', rawBody);
    if (parsed) {
      console.log('[Clerk Webhook] parsed body:', parsed);
      try {
        const anyParsed: any = parsed as any;
        const type = anyParsed?.type;
        const id = anyParsed?.data?.id ?? anyParsed?.id;
        console.log('[Clerk Webhook] event type:', type, 'id:', id);
        return NextResponse.json({ ok: true, type, id });
      } catch {
        // ignore
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Clerk Webhook] error handling request:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Clerk webhook endpoint ready' });
}
