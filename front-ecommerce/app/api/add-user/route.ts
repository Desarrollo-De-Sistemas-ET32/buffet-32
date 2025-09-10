import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { users } from '@/lib/drizzle/schema';

export async function POST(request: Request) {
  try {
    const { fullName, phone } = await request.json();

    if (!fullName || !phone) {
      return NextResponse.json({ error: 'fullName and phone are required' }, { status: 400 });
    }

    const newUser = await db.insert(users).values({ fullName, phone }).returning();

    return NextResponse.json({ user: newUser[0] });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}
