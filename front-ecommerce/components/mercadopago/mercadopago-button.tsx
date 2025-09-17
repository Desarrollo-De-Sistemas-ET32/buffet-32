'use client';

import { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import type { Cart, CartItem } from 'lib/shopify/types';

interface MercadoPagoButtonProps {
  cart: Cart;
}

const MercadoPagoButton = ({ cart }: MercadoPagoButtonProps) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Mercado Pago SDK on client side
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, { locale: 'es-AR' });

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
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

  // Si ya tenemos una preferencia, mostramos el botón de pago de Mercado Pago
  if (preferenceId) {
    return (
      <Wallet
        initialization={{ preferenceId: preferenceId }}
        customization={{ valueProp: 'smart_option' }}
      />
    );
  }

  // Si no, mostramos nuestro botón para crear la preferencia
  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={isLoading || cart.lines.length === 0} // Deshabilitar si está cargando o el carrito está vacío
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default MercadoPagoButton;
