// Mocked implementation of the Shopify API for local/front-end development.
import { TAGS } from 'lib/constants';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Cart, Collection, Menu, Page, Product } from './types';
import {
  carts,
  cloneCart,
  createEmptyCart,
  findProductByHandle,
  getCollectionHandlesProducts,
  mockCollections,
  mockMenu,
  mockPages,
  mockProducts,
  recalcCart,
  variantToProduct
} from './mock-data';

export async function createCart(): Promise<Cart> {
  const id = (crypto as any).randomUUID?.() || `cart_${Math.random().toString(36).slice(2)}`;
  const cart = createEmptyCart();
  cart.id = id;
  carts[id] = cart;
  return cloneCart(cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const cart = carts[cartId] || createEmptyCart();
  cart.id = cartId;

  for (const { merchandiseId, quantity } of lines) {
    const found = variantToProduct.get(merchandiseId);
    if (!found) continue;
    const { product, variant } = found;
    const existing = cart.lines.find((l) => l.merchandise.id === merchandiseId);
    if (existing) {
      existing.quantity += quantity;
      existing.cost.totalAmount.amount = (
        Number(existing.cost.totalAmount.amount) + Number(variant.price.amount) * quantity
      ).toString();
    } else {
      cart.lines.push({
        id: (crypto as any).randomUUID?.() || `line_${Math.random().toString(36).slice(2)}`,
        quantity,
        cost: {
          totalAmount: { ...variant.price, amount: (Number(variant.price.amount) * quantity).toString() }
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
      });
    }
  }

  recalcCart(cart);
  carts[cartId] = cart;
  return cloneCart(cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const cart = carts[cartId];
  if (!cart) return createEmptyCart();
  cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id || ''));
  recalcCart(cart);
  return cloneCart(cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const cart = carts[cartId];
  if (!cart) return createEmptyCart();
  for (const { id, merchandiseId, quantity } of lines) {
    const index = cart.lines.findIndex((l) => l.id === id && l.merchandise.id === merchandiseId);
    if (index === -1) continue;
    if (quantity <= 0) {
      cart.lines.splice(index, 1);
    } else {
      const line = cart.lines[index];
      const found = variantToProduct.get(merchandiseId);
      const price = found?.variant.price.amount || '0';
      line.quantity = quantity;
      line.cost.totalAmount.amount = (Number(price) * quantity).toString();
    }
  }
  recalcCart(cart);
  return cloneCart(cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;
  if (!cartId) return undefined;
  const cart = carts[cartId];
  if (!cart) return undefined;
  return cloneCart(cart);
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  const col = mockCollections.find((c) => c.handle === handle);
  return col ? { ...col } : undefined;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  let products: Product[] = [];
  if (!collection) {
    products = mockProducts;
  } else {
    products = getCollectionHandlesProducts(collection);
  }
  return sortProducts(products, sortKey, reverse);
}

export async function getCollections(): Promise<Collection[]> {
  return mockCollections.filter((c) => !c.handle.startsWith('hidden')).map((c) => ({ ...c }));
}

export async function getMenu(_handle: string): Promise<Menu[]> {
  return mockMenu.map((m) => ({ ...m }));
}

export async function getPage(handle: string): Promise<Page> {
  const page = mockPages.find((p) => p.handle === handle);
  if (!page) throw new Error('Page not found');
  return { ...page };
}

export async function getPages(): Promise<Page[]> {
  return mockPages.map((p) => ({ ...p }));
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const p = findProductByHandle(handle);
  return p ? { ...p, images: p.images.map((i) => ({ ...i })) } : undefined;
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  const products = mockProducts.filter((p) => p.id !== productId);
  return products.map((p) => ({ ...p }));
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  let products = mockProducts;
  if (query) {
    const q = query.toLowerCase();
    products = products.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  return sortProducts(products, sortKey, reverse);
}

export async function revalidate(_req: NextRequest): Promise<NextResponse> {
  // In mock mode, just acknowledge the request.
  return NextResponse.json({ status: 200, revalidated: false, mock: true, now: Date.now() });
}

function sortProducts(products: Product[], sortKey?: string, reverse?: boolean): Product[] {
  const arr = [...products];
  if (!sortKey) return arr;
  if (sortKey === 'PRICE') {
    arr.sort((a, b) => Number(a.priceRange.maxVariantPrice.amount) - Number(b.priceRange.maxVariantPrice.amount));
  } else if (sortKey === 'CREATED' || sortKey === 'CREATED_AT') {
    arr.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
  } else if (sortKey === 'BEST_SELLING') {
    // No sales data in mock; keep as-is.
  }
  if (reverse) arr.reverse();
  return arr;
}

