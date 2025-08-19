import type {
  Cart,
  CartItem,
  Collection,
  Image,
  Menu,
  Money,
  Page,
  Product,
  ProductOption,
  ProductVariant
} from './types';

const usd = (amount: string): Money => ({ amount, currencyCode: 'USD' });

const img = (url: string, altText: string): Image => ({ url, altText, width: 800, height: 800 });

const options: ProductOption[] = [
  { id: 'opt-size', name: 'Size', values: ['S', 'M', 'L'] },
  { id: 'opt-color', name: 'Color', values: ['Black', 'White'] }
];

const makeVariant = (id: string, size: string, color: string, price: string): ProductVariant => ({
  id,
  title: `${size} / ${color}`,
  availableForSale: true,
  selectedOptions: [
    { name: 'Size', value: size },
    { name: 'Color', value: color }
  ],
  price: usd(price)
});

const now = new Date().toISOString();

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    handle: 'basic-tee',
    availableForSale: true,
    title: 'Basic Tee',
    description: 'A comfy, classic tee.',
    descriptionHtml: '<p>A comfy, classic tee.</p>',
    options,
    priceRange: {
      minVariantPrice: usd('19.00'),
      maxVariantPrice: usd('29.00')
    },
    variants: [
      makeVariant('var-1-s-b', 'S', 'Black', '19.00'),
      makeVariant('var-1-m-b', 'M', 'Black', '19.00'),
      makeVariant('var-1-l-w', 'L', 'White', '29.00')
    ],
    featuredImage: img('https://picsum.photos/id/1011/800/800', 'Basic Tee'),
    images: [
      img('https://picsum.photos/id/1011/800/800', 'Basic Tee 1'),
      img('https://picsum.photos/id/1012/800/800', 'Basic Tee 2')
    ],
    seo: { title: 'Basic Tee', description: 'A comfy, classic tee.' },
    tags: [],
    updatedAt: now
  },
  {
    id: 'prod-2',
    handle: 'hoodie',
    availableForSale: true,
    title: 'Cozy Hoodie',
    description: 'Warm and soft hoodie.',
    descriptionHtml: '<p>Warm and soft hoodie.</p>',
    options,
    priceRange: {
      minVariantPrice: usd('49.00'),
      maxVariantPrice: usd('59.00')
    },
    variants: [
      makeVariant('var-2-s-b', 'S', 'Black', '49.00'),
      makeVariant('var-2-m-w', 'M', 'White', '59.00')
    ],
    featuredImage: img('https://picsum.photos/id/1018/800/800', 'Cozy Hoodie'),
    images: [
      img('https://picsum.photos/id/1018/800/800', 'Cozy Hoodie 1'),
      img('https://picsum.photos/id/1021/800/800', 'Cozy Hoodie 2')
    ],
    seo: { title: 'Cozy Hoodie', description: 'Warm and soft hoodie.' },
    tags: [],
    updatedAt: now
  },
  {
    id: 'prod-3',
    handle: 'sneakers',
    availableForSale: true,
    title: 'Everyday Sneakers',
    description: 'Lightweight sneakers for daily wear.',
    descriptionHtml: '<p>Lightweight sneakers for daily wear.</p>',
    options,
    priceRange: {
      minVariantPrice: usd('69.00'),
      maxVariantPrice: usd('89.00')
    },
    variants: [
      makeVariant('var-3-s-b', 'S', 'Black', '69.00'),
      makeVariant('var-3-m-w', 'M', 'White', '89.00')
    ],
    featuredImage: img('https://picsum.photos/id/1020/800/800', 'Everyday Sneakers'),
    images: [
      img('https://picsum.photos/id/1020/800/800', 'Everyday Sneakers 1'),
      img('https://picsum.photos/id/1025/800/800', 'Everyday Sneakers 2')
    ],
    seo: { title: 'Everyday Sneakers', description: 'Lightweight sneakers.' },
    tags: [],
    updatedAt: now
  }
];

// Map variants to products for quick lookup.
export const variantToProduct = new Map<string, { product: Product; variant: ProductVariant }>();
for (const p of mockProducts) {
  for (const v of p.variants) variantToProduct.set(v.id, { product: p, variant: v });
}

// Collections and their product handles
const collectionGroups: Record<string, string[]> = {
  'hidden-homepage-featured-items': ['basic-tee', 'hoodie', 'sneakers'],
  'hidden-homepage-carousel': ['hoodie', 'sneakers']
};

export const mockCollections: Collection[] = [
  {
    handle: '',
    title: 'All',
    description: 'All products',
    seo: { title: 'All', description: 'All products' },
    updatedAt: now,
    path: '/search'
  },
  {
    handle: 'hidden-homepage-featured-items',
    title: 'Homepage Featured',
    description: 'Featured products on homepage',
    seo: { title: 'Homepage Featured', description: 'Featured products' },
    updatedAt: now,
    path: '/search/hidden-homepage-featured-items'
  },
  {
    handle: 'hidden-homepage-carousel',
    title: 'Homepage Carousel',
    description: 'Carousel products',
    seo: { title: 'Homepage Carousel', description: 'Carousel products' },
    updatedAt: now,
    path: '/search/hidden-homepage-carousel'
  }
];

export const mockMenu: Menu[] = [
  { title: 'Home', path: '/' },
  { title: 'Search', path: '/search' },
  { title: 'About', path: '/about' }
];

export const mockPages: Page[] = [
  {
    id: 'page-about',
    title: 'About Us',
    handle: 'about',
    body: '<p>We are building a modern store.</p>',
    bodySummary: 'We are building a modern store.',
    seo: { title: 'About Us', description: 'About this store' },
    createdAt: now,
    updatedAt: now
  }
];

export const getCollectionHandlesProducts = (handle: string) => {
  const group = collectionGroups[handle];
  if (!group) return [];
  return mockProducts.filter((p) => group.includes(p.handle));
};

export const createEmptyCart = (): Cart => ({
  id: undefined,
  checkoutUrl: '/checkout-mock',
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: usd('0'),
    totalAmount: usd('0'),
    totalTaxAmount: usd('0')
  }
});

export const cloneCart = (cart: Cart): Cart => ({
  ...cart,
  lines: cart.lines.map((l) => ({
    ...l,
    merchandise: {
      ...l.merchandise,
      product: { ...l.merchandise.product }
    }
  })),
  cost: {
    subtotalAmount: { ...cart.cost.subtotalAmount },
    totalAmount: { ...cart.cost.totalAmount },
    totalTaxAmount: { ...cart.cost.totalTaxAmount }
  }
});

export const carts: Record<string, Cart> = {};

export const recalcCart = (cart: Cart) => {
  const totalQuantity = cart.lines.reduce((sum, l) => sum + l.quantity, 0);
  const totalAmount = cart.lines.reduce((sum, l) => sum + Number(l.cost.totalAmount.amount), 0);
  cart.totalQuantity = totalQuantity;
  cart.cost.subtotalAmount.amount = totalAmount.toString();
  cart.cost.totalAmount.amount = totalAmount.toString();
  if (!cart.cost.totalTaxAmount) cart.cost.totalTaxAmount = usd('0');
  return cart;
};

export const findProductByHandle = (handle: string): Product | undefined =>
  mockProducts.find((p) => p.handle === handle);

