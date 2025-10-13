import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest): Promise<NextResponse> {
  // No-op revalidate since Shopify is disabled
  return NextResponse.json({ status: 200 });
}
