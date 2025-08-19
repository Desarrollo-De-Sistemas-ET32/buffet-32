import { NextRequest, NextResponse } from 'next/server';
import { db } from 'lib/drizzle';
import { ordenes } from 'lib/drizzle/schema';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    if (!orderData || !orderData.userId || !orderData.totalAmount) {
      return NextResponse.json({ error: 'Missing required order data' }, { status: 400 });
    }

    const newOrder = await db.insert(ordenes).values(orderData).returning();

    return NextResponse.json({ order: newOrder[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}