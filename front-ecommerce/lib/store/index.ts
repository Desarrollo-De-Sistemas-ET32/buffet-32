import { cache } from 'react';

import { DEFAULT_OPTION, TAGS } from 'lib/constants';
import type {
  Cart,
  CartItem,
  Collection,
  Menu,
  Page,
  Product,
  ProductVariant
} from 'lib/store/types';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.FAKE_STORE_API_BASE_URL ?? 'https://fake-store-api-2no73ornoa-uc.a.run.app';
const CART_COOKIE_NAME = 'cartId';

const FALLBACK_MENU: Menu[] = [
  { title: 'Home', path: '/' },
  { title: 'Shop', path: '/search' },
  { title: 'About', path: '/about' }
];

const FALLBACK_PAGES: Page[] = [
  {
    id: 'about',
    title: 'About Us',
    handle: 'about',
    body: '<p>Storefront powered by the Fake Store API.</p>',
    bodySummary: 'Storefront powered by the Fake Store API.',
    seo: { title: 'About Us', description: 'Learn more about our storefront.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

type ApiProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryName: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

const FALLBACK_API_PRODUCTS: ApiProduct[] = [
  {
    id: 1,
    name: 'Portátil Apple MacBook Pro',
    description:
      'Portátil de alto rendimiento con pantalla Retina de 13 pulgadas, chip Apple M1, 8 GB de RAM y 256 GB de SSD.',
    price: 1299.99,
    stockQuantity: 75,
    categoryName: 'Electrónica',
    imageUrl: 'https://picsum.photos/seed/macbook-pro/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  },
  {
    id: 2,
    name: 'Smartphone Samsung Galaxy S23',
    description:
      'Smartphone de última generación con pantalla AMOLED de 6.1 pulgadas, procesador Snapdragon 8 Gen 2 y 256 GB de almacenamiento.',
    price: 899.99,
    stockQuantity: 120,
    categoryName: 'Electrónica',
    imageUrl: 'https://picsum.photos/seed/galaxy-s23/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  },
  {
    id: 3,
    name: 'Cámara Sony Alpha A7 III',
    description:
      'Cámara mirrorless con sensor full-frame de 24.2 MP, grabación de vídeo 4K HDR y sistema de enfoque automático rápido.',
    price: 1999.99,
    stockQuantity: 30,
    categoryName: 'Fotografía',
    imageUrl: 'https://picsum.photos/seed/sony-a7/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  },
  {
    id: 4,
    name: 'Consola PlayStation 5',
    description:
      'Consola de juegos de última generación con gráficos en 4K, SSD ultrarrápido y retrocompatibilidad con juegos de PS4.',
    price: 499.99,
    stockQuantity: 100,
    categoryName: 'Videojuegos',
    imageUrl: 'https://picsum.photos/seed/playstation-5/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  },
  {
    id: 5,
    name: 'Smartwatch Apple Watch Series 8',
    description:
      'Reloj inteligente con monitor de salud, GPS integrado y resistencia al agua hasta 50 metros.',
    price: 399.99,
    stockQuantity: 150,
    categoryName: 'Wearables',
    imageUrl: 'https://picsum.photos/seed/apple-watch-8/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  },
  {
    id: 6,
    name: 'Auriculares Sony WH-1000XM5',
    description:
      'Auriculares inalámbricos con cancelación de ruido de última generación y hasta 30 horas de batería.',
    price: 349.99,
    stockQuantity: 200,
    categoryName: 'Audio',
    imageUrl: 'https://picsum.photos/seed/sony-wh1000xm5/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  },
  {
    id: 7,
    name: 'Televisor LG OLED C2 55"',
    description:
      'Televisor OLED con panel 4K, Dolby Vision IQ, Dolby Atmos y procesador α9 Gen 5 AI.',
    price: 1599.99,
    stockQuantity: 60,
    categoryName: 'Electrodomésticos',
    imageUrl: 'https://picsum.photos/seed/lg-oled-c2/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  },
  {
    id: 8,
    name: 'Robot Aspiradora Roomba i7+',
    description:
      'Robot aspirador inteligente con mapeo avanzado y vaciado automático del depósito.',
    price: 799.99,
    stockQuantity: 80,
    categoryName: 'Hogar Inteligente',
    imageUrl: 'https://picsum.photos/seed/roomba-i7/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  },
  {
    id: 9,
    name: 'Tablet iPad Air (5ª generación)',
    description:
      'Tablet con pantalla Liquid Retina de 10.9 pulgadas, chip M1 y compatibilidad con Apple Pencil.',
    price: 599.99,
    stockQuantity: 110,
    categoryName: 'Electrónica',
    imageUrl: 'https://picsum.photos/seed/ipad-air/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  },
  {
    id: 10,
    name: 'Altavoz Bluetooth Portátil',
    description:
      'Altavoz Bluetooth compacto y portátil con excelente calidad de sonido y resistencia al agua.',
    price: 99.99,
    stockQuantity: 140,
    categoryName: 'Audio',
    imageUrl: 'https://picsum.photos/seed/portable-speaker/800/800',
    createdAt: '2023-12-29',
    updatedAt: '2023-12-29'
  }
];

type Catalog = {
  products: Product[];
  variantMap: Map<string, { product: Product; variant: ProductVariant }>;
  categoryCollections: Map<string, Collection>;
};

const carts: Record<string, Cart> = {};

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'general';

const padPrice = (price: number) => price.toFixed(2);

const randomId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id_${Math.random().toString(36).slice(2)}`;

const clone = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

let loggedApiError = false;

const fetchApiProducts = cache(async (): Promise<ApiProduct[]> => {
  const response = await fetch(`${API_BASE_URL}/api/products/all`, {
    next: { revalidate: 60 }
  }).catch((error) => {
    if (!loggedApiError) {
      console.warn('Error fetching products from Fake Store API, using fallback data.', error);
      loggedApiError = true;
    }
    return undefined;
  });

  if (!response || !response.ok) {
    if (!loggedApiError) {
      console.warn(
        `Fake Store API responded with ${response?.status ?? 'no response'}, using fallback data.`
      );
      loggedApiError = true;
    }
    return FALLBACK_API_PRODUCTS;
  }

  try {
    const data = (await response.json()) as { content: ApiProduct[] };
    if (Array.isArray(data.content) && data.content.length) {
      loggedApiError = false;
      return data.content;
    }
  } catch (error) {
    if (!loggedApiError) {
      console.warn('Failed to parse Fake Store API response, using fallback data.', error);
      loggedApiError = true;
    }
  }

  if (!loggedApiError) {
    console.warn('Fake Store API returned an empty payload, using fallback data.');
    loggedApiError = true;
  }
  return FALLBACK_API_PRODUCTS;
});

const buildCatalog = cache(async (): Promise<Catalog> => {
  const apiProducts = await fetchApiProducts();
  const now = new Date().toISOString();

  const products: Product[] = apiProducts.map((item) => {
    const handle = String(item.id);
    const image = {
      url: item.imageUrl,
      altText: item.name,
      width: 800,
      height: 800
    };

    const variant: ProductVariant = {
      id: `${handle}-variant`,
      title: DEFAULT_OPTION,
      availableForSale: item.stockQuantity > 0,
      selectedOptions: [],
      price: {
        amount: padPrice(item.price),
        currencyCode: 'USD'
      }
    };

    return {
      id: handle,
      handle,
      availableForSale: item.stockQuantity > 0,
      title: item.name,
      description: item.description,
      descriptionHtml: `<p>${item.description}</p>`,
      options: [],
      priceRange: {
        maxVariantPrice: {
          amount: padPrice(item.price),
          currencyCode: 'USD'
        },
        minVariantPrice: {
          amount: padPrice(item.price),
          currencyCode: 'USD'
        }
      },
      variants: [variant],
      featuredImage: image,
      images: [image],
      seo: {
        title: item.name,
        description: item.description
      },
      tags: [item.categoryName, `category:${slugify(item.categoryName)}`],
      updatedAt: item.updatedAt || item.createdAt || now
    };
  });

  const variantMap = new Map<string, { product: Product; variant: ProductVariant }>();
  const categoryCollections = new Map<string, Collection>();

  products.forEach((product) => {
    const [categoryName] = product.tags;
    const slugTag = product.tags.find((tag) => tag.startsWith('category:'));
    const categorySlug = slugTag?.split(':')[1] ?? 'general';

    variantMap.set(product.variants[0].id, { product, variant: product.variants[0] });

    if (!categoryCollections.has(categorySlug)) {
      categoryCollections.set(categorySlug, {
        handle: categorySlug,
        title: typeof categoryName === 'string' ? categoryName : 'Products',
        description: `${categoryName} products`,
        seo: {
          title: typeof categoryName === 'string' ? categoryName : 'Products',
          description: `${categoryName} products`
        },
        updatedAt: product.updatedAt,
        path: `/search/${categorySlug}`
      });
    }
  });

  return { products, variantMap, categoryCollections };
});

const getCartIdFromCookies = async (): Promise<string | undefined> =>
  (await cookies()).get(CART_COOKIE_NAME)?.value;

const getOrCreateCartId = async (): Promise<string> => {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (existing) return existing;

  const cartId = randomId();
  cookieStore.set(CART_COOKIE_NAME, cartId);
  return cartId;
};

const createEmptyCart = (): Cart => ({
  id: undefined,
  checkoutUrl: '/checkout',
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
    totalAmount: { amount: '0.00', currencyCode: 'USD' },
    totalTaxAmount: { amount: '0.00', currencyCode: 'USD' }
  }
});

const recalcCart = (cart: Cart) => {
  const totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = cart.lines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0
  );

  cart.totalQuantity = totalQuantity;
  cart.cost.subtotalAmount.amount = padPrice(totalAmount);
  cart.cost.totalAmount.amount = padPrice(totalAmount);
  cart.cost.totalTaxAmount.amount = cart.cost.totalTaxAmount.amount || '0.00';

  return cart;
};

const cloneCart = (cart: Cart): Cart => ({
  ...cart,
  lines: cart.lines.map((line) => ({
    ...line,
    merchandise: {
      ...line.merchandise,
      selectedOptions: line.merchandise.selectedOptions.map((option) => ({ ...option })),
      product: { ...line.merchandise.product }
    }
  })),
  cost: {
    subtotalAmount: { ...cart.cost.subtotalAmount },
    totalAmount: { ...cart.cost.totalAmount },
    totalTaxAmount: { ...cart.cost.totalTaxAmount }
  }
});

const getMutableCart = (cartId: string): Cart => {
  const existing = carts[cartId];
  if (existing) return existing;
  const cart = createEmptyCart();
  cart.id = cartId;
  carts[cartId] = cart;
  return cart;
};

export async function createCart(): Promise<Cart> {
  const cartId = randomId();
  const cart = createEmptyCart();
  cart.id = cartId;
  carts[cartId] = cart;
  return cloneCart(cart);
}

export async function addToCart(lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  if (!lines.length) {
    const cartId = await getOrCreateCartId();
    return cloneCart(getMutableCart(cartId));
  }

  const cartId = await getOrCreateCartId();
  const cart = getMutableCart(cartId);
  const { variantMap } = await buildCatalog();

  for (const { merchandiseId, quantity } of lines) {
    if (!quantity) continue;
    const found = variantMap.get(merchandiseId);
    if (!found) continue;

    const { product, variant } = found;
    const existing = cart.lines.find((line) => line.merchandise.id === merchandiseId);

    if (existing) {
      existing.quantity += quantity;
      existing.cost.totalAmount.amount = padPrice(
        Number(existing.cost.totalAmount.amount) + Number(variant.price.amount) * quantity
      );
    } else {
      const cartItem: CartItem = {
        id: randomId(),
        quantity,
        cost: {
          totalAmount: { ...variant.price, amount: padPrice(Number(variant.price.amount) * quantity) }
        },
        merchandise: {
          id: variant.id,
          title: variant.title,
          selectedOptions: [...variant.selectedOptions],
          product: {
            id: product.id,
            handle: product.handle,
            title: product.title,
            featuredImage: product.featuredImage
          }
        }
      };

      cart.lines.push(cartItem);
    }
  }

  recalcCart(cart);
  carts[cartId] = cart;
  return cloneCart(cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = await getCartIdFromCookies();
  if (!cartId) return cloneCart(createEmptyCart());

  const cart = getMutableCart(cartId);
  cart.lines = cart.lines.filter((line) => !lineIds.includes(line.id ?? ''));
  recalcCart(cart);
  carts[cartId] = cart;
  return cloneCart(cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = await getOrCreateCartId();
  const cart = getMutableCart(cartId);
  const { variantMap } = await buildCatalog();

  for (const { id, merchandiseId, quantity } of lines) {
    const index = cart.lines.findIndex((line) => line.id === id && line.merchandise.id === merchandiseId);
    if (index === -1) continue;

    if (quantity <= 0) {
      cart.lines.splice(index, 1);
      continue;
    }

    const found = variantMap.get(merchandiseId);
    const price = found?.variant.price.amount ?? '0';
    const line = cart.lines[index];
    line.quantity = quantity;
    line.cost.totalAmount.amount = padPrice(Number(price) * quantity);
  }

  recalcCart(cart);
  carts[cartId] = cart;
  return cloneCart(cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = await getCartIdFromCookies();
  if (!cartId) return undefined;
  const cart = carts[cartId];
  if (!cart) return undefined;
  return cloneCart(cart);
}

export async function getProducts({
  sortKey,
  reverse,
  query
}: {
  sortKey?: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse?: boolean;
  query?: string;
}): Promise<Product[]> {
  const { products } = await buildCatalog();
  let filtered = [...products];

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(q) || product.description.toLowerCase().includes(q)
    );
  }

  filtered = sortProducts(filtered, sortKey, reverse);
  return filtered.map(clone);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const { products } = await buildCatalog();
  const product = products.find((item) => item.handle === handle);
  return product ? clone(product) : undefined;
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const { products } = await buildCatalog();
  const current = products.find((product) => product.id === productId);
  if (!current) return [];
  const slugTag = current.tags.find((tag) => tag.startsWith('category:'));
  const categorySlug = slugTag?.split(':')[1];

  const related = products
    .filter((product) => product.id !== productId)
    .filter((product) =>
      categorySlug ? product.tags.includes(`category:${categorySlug}`) : true
    )
    .slice(0, 6);

  return related.map(clone);
}

const buildSpecialCollection = (handle: string, updatedAt: string): Collection => ({
  handle,
  title: handle
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
  description: `${handle} collection`,
  seo: {
    title: handle,
    description: `${handle} collection`
  },
  updatedAt,
  path: '/'
});

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const { products, categoryCollections } = await buildCatalog();
  const specialHandles = ['hidden-homepage-featured-items', 'hidden-homepage-carousel'];

  if (specialHandles.includes(handle)) {
    const updatedAt = products[0]?.updatedAt ?? new Date().toISOString();
    return buildSpecialCollection(handle, updatedAt);
  }

  if (handle === 'all-products') {
    const updatedAt = products[0]?.updatedAt ?? new Date().toISOString();
    return {
      handle: 'all-products',
      title: 'All Products',
      description: 'Browse all products',
      seo: { title: 'All Products', description: 'Browse all products' },
      updatedAt,
      path: '/search'
    };
  }

  const collection = categoryCollections.get(handle);
  return collection ? clone(collection) : undefined;
}

export async function getCollectionProducts({
  collection,
  sortKey,
  reverse
}: {
  collection: string;
  sortKey?: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse?: boolean;
}): Promise<Product[]> {
  const { products } = await buildCatalog();
  let filtered: Product[];

  if (collection === 'hidden-homepage-featured-items') {
    filtered = products.slice(0, 3);
  } else if (collection === 'hidden-homepage-carousel') {
    filtered = products.slice(0, 5);
  } else if (collection === 'all-products') {
    filtered = [...products];
  } else {
    filtered = products.filter((product) =>
      product.tags.includes(`category:${collection}`)
    );
  }

  filtered = sortProducts(filtered, sortKey, reverse);
  return filtered.map(clone);
}

export async function getCollections(): Promise<Collection[]> {
  const { products, categoryCollections } = await buildCatalog();
  const updatedAt = products[0]?.updatedAt ?? new Date().toISOString();

  const allCollection: Collection = {
    handle: 'all-products',
    title: 'All Products',
    description: 'Browse all products',
    seo: { title: 'All Products', description: 'Browse all products' },
    updatedAt,
    path: '/search'
  };

  return [allCollection, ...Array.from(categoryCollections.values()).map(clone)];
}

export async function getMenu(_handle: string): Promise<Menu[]> {
  const { categoryCollections } = await buildCatalog();
  const categoryLinks: Menu[] = Array.from(categoryCollections.values()).slice(0, 4).map((collection) => ({
    title: collection.title,
    path: collection.path
  }));

  return [...FALLBACK_MENU, ...categoryLinks];
}

export async function getPage(handle: string): Promise<Page> {
  const page = FALLBACK_PAGES.find((entry) => entry.handle === handle);
  if (!page) {
    throw new Error('Page not found');
  }
  return clone(page);
}

export async function getPages(): Promise<Page[]> {
  return FALLBACK_PAGES.map(clone);
}

export async function revalidate(_req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now(), tags: TAGS });
}

function sortProducts(
  products: Product[],
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE' = 'RELEVANCE',
  reverse?: boolean
) {
  const sorted = [...products];

  if (sortKey === 'PRICE') {
    sorted.sort(
      (a, b) =>
        Number(a.priceRange.maxVariantPrice.amount) -
        Number(b.priceRange.maxVariantPrice.amount)
    );
  } else if (sortKey === 'CREATED_AT') {
    sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
  }

  if (reverse) {
    sorted.reverse();
  }

  return sorted;
}
