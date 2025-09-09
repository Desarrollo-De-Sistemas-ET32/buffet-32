import { baseUrl } from 'lib/utils';
import { getCollection, getCollectionProducts, getProducts } from 'lib/shop-mock';
import { MetadataRoute } from 'next';

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: product.updatedAt
    }))
  );

  let fetchedRoutes: Route[] = [];
  try {
    // We can add a couple of mock collections
    const collections = ['hidden-homepage-featured-items', 'hidden-homepage-carousel'];
    const collectionRoutes: Route[] = (
      await Promise.all(
        collections.map(async (c) => {
          const col = await getCollection(c);
          return { url: `${baseUrl}${col?.path || '/search'}`, lastModified: col?.updatedAt || new Date().toISOString() } as Route;
        })
      )
    ).flat();
    const productRoutes = await productsPromise;
    fetchedRoutes = [...collectionRoutes, ...productRoutes];
  } catch {
    fetchedRoutes = [];
  }

  return [...routesMap, ...fetchedRoutes];
}
