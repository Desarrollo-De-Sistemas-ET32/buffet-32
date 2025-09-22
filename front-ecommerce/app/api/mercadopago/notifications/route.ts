import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, MerchantOrder } from 'mercadopago';
import { db } from '@/lib/drizzle/db';
import * as schema from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  if (body.type === 'payment') {
    const paymentId = body.data.id;
    
    try {
      const merchantOrder = new MerchantOrder(client);
      const orderInfo = await merchantOrder.get({
        merchantOrderId: paymentId,
      });

      if (orderInfo && orderInfo.external_reference && orderInfo.order_status === 'paid') {
        const orderId = parseInt(orderInfo.external_reference, 10);
        
        await db
          .update(schema.ordenes)
          .set({ estado: 'paid' })
          .where(eq(schema.ordenes.orden_id, orderId));

        console.log(`Order ${orderId} updated to paid.`);
      }
      
    } catch (error) {
      console.error('Error processing Mercado Pago notification:', error);
      return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
    }
  }
  
  return NextResponse.json({ status: 'ok' });
}