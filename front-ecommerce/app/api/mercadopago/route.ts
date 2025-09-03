import { Payment } from "mercadopago";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { mercadopago } from "@/app/api";
import { db } from "@/lib/drizzle";
import { ordenes } from "@/lib/drizzle/schema";

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: { data: { id: string } } = await request.json();

  // Validamos que el ID del pago exista
  if (!body.data.id) {
    return NextResponse.json({ error: "Payment ID not provided" }, { status: 400 });
  }

  try {
    // Obtenemos el pago usando el ID
    const payment = await new Payment(mercadopago).get({ id: body.data.id });

    // Si el pago existe y fue aprobado, creamos la orden en la base de datos
    if (payment && payment.status === "approved") {
      // Asumimos que estás pasando 'cliente_id' en los metadatos al crear la preferencia de pago.
      const clienteId = payment.metadata?.cliente_id;

      if (!clienteId) {
        console.error("Error: No se encontró 'cliente_id' en los metadatos del pago de MercadoPago. ID de pago:", payment.id);
        // Respondemos 200 a MercadoPago para que no reintente, pero registramos el error.
        return new Response(null, { status: 200 });
      }

      // Creamos el objeto para la nueva orden
      const newOrder = {
        cliente_id: Number(clienteId),
        fecha_orden: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        estado: payment.status,
      };

      // Insertamos la nueva orden en la base de datos
      await db.insert(ordenes).values(newOrder);

      // Revalidamos la página de inicio para mostrar los datos actualizados
      revalidatePath("/");
    }

    // Respondemos con un estado 200 para indicarle que la notificación fue recibida
    return new Response(null, { status: 200 });

  } catch (error) {
    console.error('Error procesando el webhook de MercadoPago:', error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}