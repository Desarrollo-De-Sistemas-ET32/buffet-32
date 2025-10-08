import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { db } from '@/lib/drizzle/db';
import type { Cart, CartItem } from '@/lib/shopify/types';
import * as schema from '@/lib/drizzle/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface GuestInfo {
  nombre: string;
  dni: string;
}

export async function POST(req: NextRequest) {
  try {
    const { cart, guestInfo } = (await req.json()) as { cart: Cart; guestInfo?: GuestInfo };

    if (!cart || cart.lines.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
    }

    const lines: CartItem[] = cart.lines;

    const newOrder = await (db as NodePgDatabase<typeof schema>).transaction(async (tx) => {
      let huespedId: number | undefined;

      if (guestInfo && guestInfo.nombre && guestInfo.dni) {
        const [insertedGuest] = await tx
          .insert(schema.huespedes)
          .values({
            nombre: guestInfo.nombre,
            dni: guestInfo.dni,
          })
          .returning({ insertedId: schema.huespedes.huesped_id });
        
        if (!insertedGuest?.insertedId) {
            throw new Error('No se pudo crear el huésped en la base de datos.');
        }
        huespedId = insertedGuest.insertedId;
      }

      const orderPayload: {
        cliente_id?: number | null;
        huesped_id?: number | null;
        fecha_orden: string;
        estado: string;
      } = {
        fecha_orden: new Date().toISOString().slice(0, 10),
        estado: 'pending',
      };

      if (huespedId) {
        orderPayload.huesped_id = huespedId;
        orderPayload.cliente_id = null;
      } else {
        // TODO: Replace with actual logged-in user ID from session
        orderPayload.cliente_id = 1; 
        orderPayload.huesped_id = null;
      }

      const [insertedOrder] = await tx
        .insert(schema.ordenes)
        .values(orderPayload)
        .returning({ insertedId: schema.ordenes.orden_id });

      if (!insertedOrder?.insertedId) {
        throw new Error('No se pudo crear la orden en la base de datos.');
      }
      const orderId = insertedOrder.insertedId;

      const orderProducts = [];
      for (const item of lines) {
        orderProducts.push({
          orden_id: orderId,
          producto_id: parseInt(item.merchandise.id.split('/').pop() || '0', 10),
          cantidad: item.quantity,
        });
      }

      await tx.insert(schema.ordenes_productos).values(orderProducts);

      return { orderId };
    });

    if (!newOrder?.orderId) {
      throw new Error('La transacción no devolvió un ID de orden.');
    }

    const preferenceItems = [];
    for (const item of lines) {
        preferenceItems.push({
            id: item.merchandise.id,
            title: item.merchandise.product.title,
            quantity: item.quantity,
            unit_price: Number(item.cost.totalAmount.amount) / item.quantity,
            currency_id: item.cost.totalAmount.currencyCode,
        });
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: preferenceItems,
        external_reference: newOrder.orderId.toString(),
        back_urls: {
          success: `${req.nextUrl.origin}/checkout/success?order_id=${newOrder.orderId}`,
          failure: `${req.nextUrl.origin}/checkout/failure`,
          pending: `${req.nextUrl.origin}/checkout/pending`,
        },
        auto_return: 'approved',
      },
    });

    return NextResponse.json({ preferenceId: result.id });

  } catch (error: any) {
    console.error('Error en la API de Orders:', error);
    return NextResponse.json(
      { error: 'Hubo un error al procesar la solicitud.', details: error.message },
      { status: 500 }
    );
  }
}
