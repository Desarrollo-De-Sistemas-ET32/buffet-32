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
  // No-op server mock; client updates optimistically.
  return getCart().then((c) => c || createCart());
}

export async function removeFromCart(_lineIds: string[]): Promise<Cart> {
  return getCart().then((c) => c || createCart());
}

export async function updateCart(
  _lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  return getCart().then((c) => c || createCart());
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;
  if (!cartId) return undefined;
  return {
    id: cartId,
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

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  return {
    handle,
    title: handle,
    description: handle,
    seo: { title: handle, description: handle },
    updatedAt: new Date().toISOString(),
    path: `/search/${handle}`
  };
}

export async function getCollectionProducts({
  collection
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const ids = mockCollections[collection] || [];
  return mockProducts.filter((p) => ids.includes(p.id));
}

export async function getCollections(): Promise<Collection[]> {
  return [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: { title: 'All', description: 'All products' },
      path: '/search',
      updatedAt: new Date().toISOString()
    }
  ];
}

export async function getMenu(_handle: string): Promise<Menu[]> {
  return [
    { title: 'Inicio', path: '/' },
    { title: 'Buscar', path: '/search' }
  ];
}

export async function getPage(handle: string): Promise<Page> {
  return {
    id: `page_${handle}`,
    title: handle,
    handle,
    body: `${handle} content`,
    bodySummary: `${handle} content`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function getPages(): Promise<Page[]> {
  return [await getPage('about'), await getPage('contact')];
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return mockProducts.find((p) => p.handle === handle);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  return mockProducts.filter((p) => p.id !== productId).slice(0, 4);
}

export async function getProducts({
  query
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  if (!query) return mockProducts;
  const q = query.toLowerCase();
  return mockProducts.filter((p) => p.title.toLowerCase().includes(q));
}

export async function revalidate(_req: NextRequest): Promise<NextResponse> {
  // No external provider, just acknowledge.
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now(), tags: TAGS });
}
