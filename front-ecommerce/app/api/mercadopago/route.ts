import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { db } from '@/lib/drizzle/db';
import type { Cart, CartItem } from '@/lib/shopify/types';
import * as schema from '@/lib/drizzle/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { cart } = (await req.json()) as { cart: Cart };

    if (!cart || cart.lines.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
    }

    const lines: CartItem[] = cart.lines;

    const newOrder = await (db as NodePgDatabase<typeof schema>).transaction(async (tx) => {
      const [insertedOrder] = await tx
        .insert(schema.ordenes)
        .values({ cliente_id: 1, fecha_orden: new Date().toISOString().slice(0, 10), estado: 'pending' })
        .returning({ insertedId: schema.ordenes.orden_id });

      if (!insertedOrder?.insertedId) {
        throw new Error('No se pudo crear la orden en la base de datos.');
      }
      const orderId = insertedOrder.insertedId;

      // SOLUCIÓN DEFINITIVA: Reemplazar .map() con un bucle for...of
      const orderProducts = [];
      for (const item of lines) {
        // El tipo de 'item' aquí se inferirá correctamente como CartItem
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

    // SOLUCIÓN DEFINITIVA: Reemplazar también el segundo .map()
    const preferenceItems = [];
    for (const item of lines) {
        // El tipo de 'item' aquí también se inferirá correctamente
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
    console.error('Error en la API de Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Hubo un error al procesar la solicitud.', details: error.message },
      { status: 500 }
    );
  }
}
