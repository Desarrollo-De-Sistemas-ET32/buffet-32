import Grid from 'components/grid';

import ProductGridItems from 'components/layout/product-grid-items';
import { getProducts } from 'lib/store';
import Link from 'next/link';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  
  // Cargar categorías y productos
  const popularCategories = await getCollections();
  const popularProducts = await getCollectionProducts({
    collection: 'popular-products', 
    sortKey: 'BEST_SELLING',
    reverse: false
  });

  // --- Datos Mock de la Estructura de la Home ---
  // NOTA: Usamos este array de categorías por simplicidad del mock y porque coincide con el layout de 12 círculos.
  const categories = [
    { name: 'Fresh Fruit', icon: '/placeholder.svg', handle: 'fresh-fruit' },
    { name: 'Fresh Vegetables', icon: '/placeholder.svg', handle: 'fresh-vegetables' },
    { name: 'Meat & Fish', icon: '/placeholder.svg', handle: 'meat-fish' },
    { name: 'Snacks', icon: '/placeholder.svg', handle: 'snacks' },
    { name: 'Beverages', icon: '/placeholder.svg', handle: 'beverages' },
    { name: 'Beauty & Health', icon: '/placeholder.svg', handle: 'beauty-health' },
    { name: 'Bread & Bakery', icon: '/placeholder.svg', handle: 'bread-bakery' },
    { name: 'Baking Needs', icon: '/placeholder.svg', handle: 'baking-needs' },
    { name: 'Cooking', icon: '/placeholder.svg', handle: 'cooking' },
    { name: 'Diabetic Food', icon: '/placeholder.svg', handle: 'diabetic-food' },
    { name: 'Dish Detergents', icon: '/placeholder.svg', handle: 'dish-detergents' },
    { name: 'Oil', icon: '/placeholder.svg', handle: 'oil' }
  ];


  const featuredProducts = (await getProducts({ sortKey: 'CREATED_AT', reverse: true })).slice(0, 8);


  const banners = [
    { title: 'Sale of the Month', badge: 'Best Dealer', buttonText: 'Shop Now' },
    { title: 'Low-Fat Meat', badge: '25% Fat-Free', buttonText: 'Shop Now' },
    { title: '100% Fresh Fruit', badge: 'Summer Sale', buttonText: 'Shop Now' }
  ];
  // ------------------------------------------------------------------------------------------

  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 py-8 md:grid-cols-3">

        {/* Banner Principal */}
        <Link
          href={mainBanner.link}
          className="relative col-span-2 flex h-[500px] items-center overflow-hidden rounded-xl bg-[#84D187]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent)]" />
          <div className="relative z-10 top-1/2 left-10 -translate-y-1/2 transform text-[#2C742F]">
            <h2 className="text-4xl font-bold">{mainBanner.title}</h2>
            <p className="text-xl">{mainBanner.subtitle}</p>
            <span className="mt-4 inline-block rounded-full bg-[#00B207] px-6 py-2 font-bold text-white">
              Shop Now
            </span>
          </div>
        </Link>
        {/* Banners Laterales */}
        <div className="col-span-1 flex flex-col gap-4">
          <Link
            href={sideBanners[0].link}
            className="relative flex h-[240px] items-center overflow-hidden rounded-xl bg-[#00B207] text-white"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(132,209,135,0.6),_transparent)]" />
            <div className="relative z-10 top-1/2 left-5 -translate-y-1/2 transform">
              <h3 className="text-2xl font-bold">{sideBanners[0].title}</h3>
              <p>{sideBanners[0].subtitle}</p>
              <span className="mt-2 inline-block font-bold underline decoration-white/70">Shop Now</span>
            </div>
          </Link>
          <Link
            href={sideBanners[1].link}
            className="relative flex h-[240px] items-center overflow-hidden rounded-xl bg-[#84D187] text-[#2C742F]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(44,116,47,0.15),_transparent)]" />
            <div className="relative z-10 top-1/2 left-5 -translate-y-1/2 transform">
              <h3 className="text-2xl font-bold">{sideBanners[1].title}</h3>
              <p>{sideBanners[1].subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories (SECCIÓN DE CÍRCULOS) */}
      <section className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold dark:text-white">Popular Categories</h2>
          <Link href="/search" className="text-sm text-green-500">
            View All →
          </Link>
        </div>
        <Grid className="grid-cols-4 md:grid-cols-6 lg:grid-cols-12 mt-4">
          {categories.slice(0, 12).map((category, index) => (
            <Link 
              key={index} 
              // Enlace a la página de búsqueda/colección de la categoría
              href={`/search/${category.handle}`} 
              className="flex flex-col items-center p-4 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xs text-gray-500">Icon</span>
              </div>
              <p className="mt-2 text-center text-sm font-medium dark:text-white">{category.name}</p>
            </Link>
          ))}
        </Grid>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/search" className="text-sm text-[#2C742F] hover:text-[#00B207]">
            View All →
          </Link>
        </div>
        {featuredProducts.length ? (
          <Grid className="grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-4">
            <ProductGridItems products={featuredProducts} />
          </Grid>
        ) : (
          <p className="mt-4 text-neutral-500">Products are loading, please check back soon.</p>
        )}
      </section>
      
      {/* Promotional Banners */}
      <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 py-8 md:grid-cols-3">
        {banners.map((banner, index) => (
          <div key={index} className="relative h-64 rounded-xl bg-gray-100 p-6 flex flex-col justify-end dark:bg-gray-800">
            <h2 className="text-2xl font-bold dark:text-white">{banner.title}</h2>
            <span className="text-sm text-green-600 font-semibold">{banner.badge}</span>
            <button className="mt-3 px-4 py-2 text-sm bg-white text-black font-semibold rounded-lg w-fit">
              {banner.buttonText}
            </button>
          </div>
        ))}
      </section>
    </>
  );
}
