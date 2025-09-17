import { getCart } from 'lib/local-cart';
import MercadoPagoButton from '@/components/mercadopago/mercadopago-button';
import { Cart } from 'lib/shopify/types';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const cart: Cart | undefined = await getCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cart && cart.lines.length > 0 ? (
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
            <MercadoPagoButton cart={cart} />
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
