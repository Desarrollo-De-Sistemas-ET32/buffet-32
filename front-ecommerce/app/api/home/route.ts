// app/api/home/route.ts
import { NextResponse } from 'next/server'
import { getHomeConfig } from '@/actions/admin';

export async function GET() {
    const homeConfig = await getHomeConfig();
    return NextResponse.json(homeConfig);
}