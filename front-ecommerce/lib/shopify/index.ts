
import { TAGS } from 'lib/constants';
import type { Cart, Collection, Menu, Page, Product } from './types';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Mock data provider replacing Shopify integration.

const placeholderImage = {
  url: '/placeholder.svg',
  altText: 'Placeholder',
  width: 512,
  height: 512
};

const mockProducts: Product[] = [
  {
    id: 'prod_1',
    handle: 'producto-1',
    availableForSale: true,
    title: 'Producto 1',
    description: 'Descripcion del producto 1',
    descriptionHtml: '<p>Descripcion del producto 1</p>',
    options: [],
    priceRange: {
      maxVariantPrice: { amount: '25.00', currencyCode: 'USD' },
      minVariantPrice: { amount: '25.00', currencyCode: 'USD' }
    },
    variants: [
      {
        id: 'prod_1_v1',
        title: 'Default',
        availableForSale: true,
        selectedOptions: [],
        price: { amount: '25.00', currencyCode: 'USD' }
      }
    ],
    featuredImage: placeholderImage,
    images: [placeholderImage],
    seo: { title: 'Producto 1', description: 'Producto 1' },
    tags: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_2',
    handle: 'producto-2',
    availableForSale: true,
    title: 'Producto 2',
    description: 'Descripcion del producto 2',
    descriptionHtml: '<p>Descripcion del producto 2</p>',
    options: [],
    priceRange: {
      maxVariantPrice: { amount: '40.00', currencyCode: 'USD' },
      minVariantPrice: { amount: '40.00', currencyCode: 'USD' }
    },
    variants: [
      {
        id: 'prod_2_v1',
        title: 'Default',
        availableForSale: true,
        selectedOptions: [],
        price: { amount: '40.00', currencyCode: 'USD' }
      }
    ],
    featuredImage: placeholderImage,
    images: [placeholderImage],
    seo: { title: 'Producto 2', description: 'Producto 2' },
    tags: [],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_3',
    handle: 'producto-3',
    availableForSale: false,
    title: 'Producto 3',
    description: 'Descripcion del producto 3',
    descriptionHtml: '<p>Descripcion del producto 3</p>',
    options: [],
    priceRange: {
      maxVariantPrice: { amount: '15.00', currencyCode: 'USD' },
      minVariantPrice: { amount: '15.00', currencyCode: 'USD' }
    },
    variants: [
      {
        id: 'prod_3_v1',
        title: 'Default',
        availableForSale: false,
        selectedOptions: [],
        price: { amount: '15.00', currencyCode: 'USD' }
      }
    ],
    featuredImage: placeholderImage,
    images: [placeholderImage],
    seo: { title: 'Producto 3', description: 'Producto 3' },
    tags: [],
    updatedAt: new Date().toISOString()
  }
];

const mockCollections: Record<string, string[]> = {
  'hidden-homepage-featured-items': ['prod_1', 'prod_2', 'prod_3'],
  'hidden-homepage-carousel': ['prod_2', 'prod_3', 'prod_1']
};

export async function createCart(): Promise<Cart> {
  return {
    id: 'mock-cart',
    checkoutUrl: '#',
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'USD' },
      totalAmount: { amount: '0', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0', currencyCode: 'USD' }
    }
  };

}

export async function addToCart(
  _lines: { merchandiseId: string; quantity: number }[]
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
  _lines: { id: string; merchandiseId: string; quantity: number }[]
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
  collection
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

  if (!query) return mockProducts;
  const q = query.toLowerCase();
  return mockProducts.filter((p) => p.title.toLowerCase().includes(q));
}

export async function revalidate(_req: NextRequest): Promise<NextResponse> {
  // No external provider, just acknowledge.
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now(), tags: TAGS });

}

