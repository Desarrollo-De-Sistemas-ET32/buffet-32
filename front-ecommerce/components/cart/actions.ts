'use server';

import { TAGS } from 'lib/constants';
import { Product, ProductVariant } from 'lib/shopify/types';
import {
  addItemToCart,
  ensureCart,
  getCart,
  redirectToLocalCheckout,
  removeItemFromCart,
  updateItemQuantityInCart
} from 'lib/local-cart';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  payload:
    | undefined
    | {
        variant: ProductVariant;
        product: Product;
      }
) {
  if (!payload?.variant || !payload?.product) {
    return 'Error adding item to cart';
  }

  try {
    await addItemToCart(payload.variant, payload.product);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();
    if (!cart) return 'Error fetching cart';

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem) {
      await removeItemFromCart(merchandiseId);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();
    if (!cart) return 'Error fetching cart';

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem) {
      await updateItemQuantityInCart(merchandiseId, quantity);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  // Shopify checkout not used; send to local page
  redirect('/checkout');
}

export async function createCartAndSetCookie() {
  // Initialize empty cart cookie when needed
  await ensureCart();
}
