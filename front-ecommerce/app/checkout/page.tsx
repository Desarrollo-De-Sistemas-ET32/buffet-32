'use client';
import { getCart } from 'lib/local-cart';
import MercadoPagoButton from '@/components/mercadopago/mercadopago-button';
import { Cart } from 'lib/shopify/types';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [guestInfo, setGuestInfo] = useState({ nombre: '', dni: '' });
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    async function fetchCart() {
      const cartData = await getCart();
      setCart(cartData);
    }
    fetchCart();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestInfo({
      ...guestInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {isClient && cart && cart.lines.length > 0 ? (
        <div>
          <ul>
            {cart.lines.map((item) => (
              <li key={item.merchandise.id} className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{item.merchandise.product.title}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p>{Number(item.cost.totalAmount.amount).toLocaleString('en-US', { style: 'currency', currency: item.cost.totalAmount.currencyCode })}</p>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between items-center font-bold text-lg">
            <p>Total</p>
            <p>{Number(cart.cost.totalAmount.amount).toLocaleString('en-US', { style: 'currency', currency: cart.cost.totalAmount.currencyCode })}</p>
          </div>
          <div className="mt-8">
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input type="text" name="nombre" id="nombre" onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
              <input type="text" name="dni" id="dni" onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <MercadoPagoButton cart={cart} guestInfo={guestInfo} />
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
