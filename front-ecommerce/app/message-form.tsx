'use client';

import {
  initMercadoPago,
  CardNumber,
  ExpirationDate,
  SecurityCode,
  createCardToken
} from '@mercadopago/sdk-react';
import Form from 'next/form';
import { useEffect } from 'react';

export default function MessageForm({
  onSubmitAction,
  amount
}: {
  onSubmitAction: (
    message: string,
    data: { amount: number; email: string; installments: number; token: string }
  ) => Promise<void>;
  amount: number;
}) {
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    // Inicializamos el SDK solo en el cliente y si la clave pública está disponible
    if (publicKey) {
      initMercadoPago(publicKey);
    } else {
      console.error('Mercado Pago public key is not set. Please set NEXT_PUBLIC_MP_PUBLIC_KEY in your environment variables.');
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    const message = formData.get('message') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    // Creamos un token de tarjeta para poder procesar el pago desde el servidor
    const token = await createCardToken({ cardholderName: name });

    // Enviamos todos los datos al servidor si el token se creó correctamente
    if (token) {
      await onSubmitAction(message, {
        amount,
        email,
        installments: 1,
        token: token.id
      });
    } else {
      console.error('Failed to create card token.');
      // Aquí podrías mostrar un error al usuario en la interfaz
    }
  }

  // Renderizamos el formulario con los campos de pago
  return (
    <Form action={handleSubmit}>
      <textarea required name="message" placeholder="Hola perro" rows={3} />
      <CardNumber placeholder="1234 1234 1234 1234" />
      <SecurityCode placeholder="123" />
      <ExpirationDate placeholder="12/2025" />
      <input name="name" placeholder="Nombre" type="text" />
      <input name="email" placeholder="Email" type="email" />
      <button type="submit">Pagar</button>
    </Form>
  );
}
