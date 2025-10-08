'use client';

import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import type { Cart } from 'lib/shopify/types';

interface MercadoPagoButtonProps {
  cart: Cart;
  guestInfo: { nombre: string; dni: string; };
}

const MercadoPagoButton = ({ cart, guestInfo }: MercadoPagoButtonProps) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, { locale: 'es-AR' });

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart, guestInfo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment preference.');
      }

      const { preferenceId } = await response.json();
      setPreferenceId(preferenceId);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (preferenceId) {
    return (
      <Wallet
        initialization={{ preferenceId: preferenceId }}
        customization={{ valueProp: 'smart_option' }}
      />
    );
  }

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={isLoading || cart.lines.length === 0 || !guestInfo.nombre || !guestInfo.dni}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default MercadoPagoButton;
