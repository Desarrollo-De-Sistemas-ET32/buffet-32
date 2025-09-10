import { mercadopago } from "../../api";
import * as schema from "../../../lib/drizzle/schema"; // Única importación del schema
import { Payment } from "mercadopago";
import { NextResponse } from "next/server";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// 1. Conexión a la Base de Datos
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
// Drizzle usa el objeto 'schema' para entender la DB
const db = drizzle(pool, { schema });

export async function POST(request: Request) {
  const body = await request.json();

  if (body.type === "payment") {
    try {
      const paymentId = body.data.id as string;
      const payment = await new Payment(mercadopago).get({ id: paymentId });

      if (payment && payment.metadata) {
        const metadata = payment.metadata as { cliente_id: any; items: string; };
        const clienteId = Number(metadata.cliente_id);
        const itemsFromMetadata = JSON.parse(metadata.items);

        // CORRECCIÓN: Usar schema.ordenes para eliminar la ambigüedad de tipos
        const [newOrder] = await db.insert(schema.ordenes).values({
          cliente_id: clienteId,
          estado: "paid",
          fecha_orden: new Date(),
        }).returning({ orden_id: schema.ordenes.orden_id });

        if (newOrder && newOrder.orden_id) {
          for (const item of itemsFromMetadata) {
            // CORRECCIÓN: Usar schema.ordenes_productos
            await db.insert(schema.ordenes_productos).values({
              orden_id: newOrder.orden_id,
              producto_id: Number(item.id),
              cantidad: Number(item.quantity),
            });
          }
          return NextResponse.json({ success: true });
        } else {
          throw new Error("Failed to create order or retrieve its ID.");
        }
      } else {
        throw new Error("Payment metadata is missing or invalid.");
      }
    } catch (error) {
      console.error("Error processing payment webhook:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error processing payment";
      return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
