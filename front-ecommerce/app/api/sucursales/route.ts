import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { sucursales } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allSucursales = await db.select().from(sucursales);
    return NextResponse.json(allSucursales);
  } catch (error) {
    console.error('Error fetching sucursales:', error);
    return NextResponse.json({ message: 'Error fetching sucursales' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, direccion, telefono } = await request.json();

    if (!nombre || !direccion || !telefono) {
      return NextResponse.json({ message: 'Missing required fields: nombre, direccion, and telefono' }, { status: 400 });
    }

    const newSucursal = await db.insert(sucursales).values({
      nombre,
      direccion,
      telefono,
    }).returning();

    return NextResponse.json(newSucursal[0], { status: 201 });
  } catch (error) {
    console.error('Error adding new sucursal:', error);
    return NextResponse.json({ message: 'Error adding new sucursal' }, { status: 500 });
  }
}