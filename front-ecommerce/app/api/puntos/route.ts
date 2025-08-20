import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from 'lib/drizzle';
import { clientes } from 'lib/drizzle/schema';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const result = await db
      .select({ puntos: clientes.puntos })
      .from(clientes)
      .where(sql`${clientes.cliente_id} = ${parseInt(id)}`);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching points:', error);
    return NextResponse.json({ error: 'Error fetching points' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { puntos } = await request.json();

  if (typeof puntos !== 'number') {
    return NextResponse.json({ error: 'Invalid points value' }, { status: 400 });
  }

  try {
    await db.update(clientes).set({ puntos }).where(sql`${clientes.cliente_id} = ${parseInt(id)}`);
    return NextResponse.json({ message: 'Puntos actualizados exitosamente' });
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json({ error: 'Error updating points' }, { status: 500 });
  }
}
