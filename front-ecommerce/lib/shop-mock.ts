import type {
  Collection,
  Image,
  Menu,
  Money,
  Page,
  Product,
  ProductVariant
} from 'lib/shopify/types';

const money = (amount: string, currencyCode: string = 'USD'): Money => ({ amount, currencyCode });
const img = (url: string, altText: string): Image => ({ url, altText, width: 1200, height: 1200 });

const now = () => new Date().toISOString();

const productsData: Product[] = [
  {
    id: 'p1',
    handle: 'basic-tee',
    availableForSale: true,
    title: 'Basic Tee',
    description: 'A comfy cotton tee for everyday wear.',
    descriptionHtml: '<p>A comfy cotton tee for everyday wear.</p>',
    options: [
      { id: 'o1', name: 'Size', values: ['S', 'M', 'L'] },
      { id: 'o2', name: 'Color', values: ['Black', 'White'] }
    ],
    priceRange: {
      minVariantPrice: money('19'),
      maxVariantPrice: money('29')
    },
    variants: [
      {
        id: 'v1',
        title: 'Black / M',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Black' }
        ],
        price: money('25')
      }
    ],
    featuredImage: img('https://picsum.photos/id/1011/800/800', 'Basic Tee'),
    images: [
      img('https://picsum.photos/id/1011/800/800', 'Basic Tee'),
      img('https://picsum.photos/id/1012/800/800', 'Basic Tee Alt')
    ],
    seo: { title: 'Basic Tee', description: 'Cotton tee' },
    tags: ['featured', 'carousel'],
    updatedAt: now()
  },
  {
    id: 'p2',
    handle: 'cozy-hoodie',
    availableForSale: true,
    title: 'Cozy Hoodie',
    description: 'Warm fleece-lined hoodie.',
    descriptionHtml: '<p>Warm fleece-lined hoodie.</p>',
    options: [{ id: 'o3', name: 'Size', values: ['S', 'M', 'L'] }],
    priceRange: {
      minVariantPrice: money('39'),
      maxVariantPrice: money('59')
    },
    variants: [
      {
        id: 'v2',
        title: 'Default',
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: 'M' }],
        price: money('49')
      }
    ],
    featuredImage: img('https://picsum.photos/id/1005/800/800', 'Cozy Hoodie'),
    images: [img('https://picsum.photos/id/1005/800/800', 'Cozy Hoodie')],
    seo: { title: 'Cozy Hoodie', description: 'Hoodie' },
    tags: ['featured'],
    updatedAt: now()
  },
  {
    id: 'p3',
    handle: 'running-shoes',
    availableForSale: true,
    title: 'Running Shoes',
    description: 'Lightweight and durable running shoes.',
    descriptionHtml: '<p>Lightweight and durable running shoes.</p>',
    options: [{ id: 'o4', name: 'Size', values: ['40', '41', '42'] }],
    priceRange: {
      minVariantPrice: money('69'),
      maxVariantPrice: money('99')
    },
    variants: [
      {
        id: 'v3',
        title: '41',
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: '41' }],
        price: money('89')
      }
    ],
    featuredImage: img('https://picsum.photos/id/21/800/800', 'Running Shoes'),
    images: [img('https://picsum.photos/id/21/800/800', 'Running Shoes')],
    seo: { title: 'Running Shoes', description: 'Sneakers' },
    tags: ['carousel'],
    updatedAt: now()
  },
  {
    id: 'p4',
    handle: 'denim-jacket',
    availableForSale: true,
    title: 'Denim Jacket',
    description: 'Classic denim jacket.',
    descriptionHtml: '<p>Classic denim jacket.</p>',
    options: [{ id: 'o5', name: 'Size', values: ['S', 'M', 'L'] }],
    priceRange: {
      minVariantPrice: money('59'),
      maxVariantPrice: money('79')
    },
    variants: [
      {
        id: 'v4',
        title: 'M',
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: 'M' }],
        price: money('69')
      }
    ],
    featuredImage: img('https://picsum.photos/id/1000/800/800', 'Denim Jacket'),
    images: [img('https://picsum.photos/id/1000/800/800', 'Denim Jacket')],
    seo: { title: 'Denim Jacket', description: 'Jacket' },
    tags: ['featured', 'carousel'],
    updatedAt: now()
  },
  {
    id: 'p5',
    handle: 'cap',
    availableForSale: true,
    title: 'Sport Cap',
    description: 'Breathable cap for sports.',
    descriptionHtml: '<p>Breathable cap for sports.</p>',
    options: [],
    priceRange: {
      minVariantPrice: money('15'),
      maxVariantPrice: money('15')
    },
    variants: [
      {
        id: 'v5',
        title: 'Default',
        availableForSale: true,
        selectedOptions: [],
        price: money('15')
      }
    ],
    featuredImage: img('https://picsum.photos/id/237/800/800', 'Sport Cap'),
    images: [img('https://picsum.photos/id/237/800/800', 'Sport Cap')],
    seo: { title: 'Sport Cap', description: 'Cap' },
    tags: ['carousel'],
    updatedAt: now()
  },
  {
    id: 'p6',
    handle: 'socks-pack',
    availableForSale: true,
    title: 'Socks Pack',
    description: 'Pack of 5 cotton socks.',
    descriptionHtml: '<p>Pack of 5 cotton socks.</p>',
    options: [],
    priceRange: {
      minVariantPrice: money('12'),
      maxVariantPrice: money('12')
    },
    variants: [
      {
        id: 'v6',
        title: 'Default',
        availableForSale: true,
        selectedOptions: [],
        price: money('12')
      }
    ],
    featuredImage: img('https://picsum.photos/id/100/800/800', 'Socks Pack'),
    images: [img('https://picsum.photos/id/100/800/800', 'Socks Pack')],
    seo: { title: 'Socks Pack', description: 'Socks' },
    tags: ['featured'],
    updatedAt: now()
  }
];

export async function getProducts({
  query,
  sortKey,
  reverse
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  let results = productsData;
  if (query) {
    const q = query.toLowerCase();
    results = results.filter((p) => p.title.toLowerCase().includes(q));
  }
  if (sortKey === 'PRICE') {
    results = [...results].sort((a, b) =>
      Number(a.priceRange.maxVariantPrice.amount) - Number(b.priceRange.maxVariantPrice.amount)
    );
  }
  return reverse ? [...results].reverse() : results;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return productsData.find((p) => p.handle === handle);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const others = productsData.filter((p) => p.id !== productId);
  return others.slice(0, 4);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  return {
    handle,
    title: handle.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
    description: `${handle} collection`,
    seo: { title: handle, description: `${handle} collection` },
    updatedAt: now(),
    path: `/search/${handle}`
  } as Collection;
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
  let subset = productsData;
  if (collection === 'hidden-homepage-featured-items') {
    subset = productsData.filter((p) => p.tags.includes('featured')).slice(0, 3);
  } else if (collection === 'hidden-homepage-carousel') {
    subset = productsData.filter((p) => p.tags.includes('carousel')).slice(0, 8);
  }
  // Reuse the same sorting as getProducts
  return getProducts({ query: undefined, reverse, sortKey }).then(() => subset);
}

