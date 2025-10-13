import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Cart, CartItem, Product, ProductVariant } from 'lib/shopify/types';

const CART_COOKIE = 'localCart';

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartTotals(lines: CartItem[]): Pick<Cart, 'totalQuantity' | 'cost'> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'USD';

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: '0', currencyCode }
    }
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: '/checkout',
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'USD' },
      totalAmount: { amount: '0', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0', currencyCode: 'USD' }
    }
  };
}

async function saveCart(cart: Cart) {
  (await cookies()).set(CART_COOKIE, JSON.stringify(cart), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function getCart(): Promise<Cart | undefined> {
  const jar = cookies();
  const raw = (await jar).get(CART_COOKIE)?.value;
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as Cart;
  } catch {
    // Corrupted cookie; clear it
    (await cookies()).set(CART_COOKIE, '', { path: '/', maxAge: 0 });
    return undefined;
  }
}

export async function ensureCart(): Promise<Cart> {
  const current = await getCart();
  if (current) return current;
  const empty = createEmptyCart();
  await saveCart(empty);
  return empty;
}

export async function addItemToCart(variant: ProductVariant, product: Product) {
  const cart = await ensureCart();
  const existing = cart.lines.find((l) => l.merchandise.id === variant.id);

  const quantity = existing ? existing.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  const updatedItem: CartItem = {
    id: existing?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode
      }
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage
      }
    }
  };

  const updatedLines = existing
    ? cart.lines.map((i) => (i.merchandise.id === variant.id ? updatedItem : i))
    : [...cart.lines, updatedItem];

  const updatedCart: Cart = {
    ...cart,
    ...updateCartTotals(updatedLines),
    lines: updatedLines
  };
  await saveCart(updatedCart);
}

export async function updateItemQuantityInCart(
  merchandiseId: string,
  quantity: number
) {
  const cart = await ensureCart();
  let updatedLines: CartItem[] = [];

  if (quantity <= 0) {
    updatedLines = cart.lines.filter((i) => i.merchandise.id !== merchandiseId);
  } else {
    updatedLines = cart.lines
      .map((item) => {
        if (item.merchandise.id !== merchandiseId) return item;
        const unitPrice = (
          Number(item.cost.totalAmount.amount) / item.quantity
        ).toString();
        return {
          ...item,
          quantity,
          cost: {
            ...item.cost,
            totalAmount: {
              ...item.cost.totalAmount,
              amount: calculateItemCost(quantity, unitPrice)
            }
          }
        } as CartItem;
      })
      .filter(Boolean) as CartItem[];
  }

  const updatedCart: Cart = {
    ...cart,
    ...updateCartTotals(updatedLines),
    lines: updatedLines
  };
  await saveCart(updatedCart);
}

export async function removeItemFromCart(merchandiseId: string) {
  const cart = await ensureCart();
  const updatedLines = cart.lines.filter((l) => l.merchandise.id !== merchandiseId);
  const updatedCart: Cart = {
    ...cart,
    ...updateCartTotals(updatedLines),
    lines: updatedLines
  };
  await saveCart(updatedCart);
}

export async function redirectToLocalCheckout() {
  redirect('/checkout');
}
