import Grid from 'components/grid';
import Link from 'next/link'; 
import { getCollectionProducts, getCollections } from 'lib/shopify'; 
import type { Product } from 'lib/shopify/types';

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

  const mainBanner = { 
    title: 'Fresh & Healthy Organic Food', 
    subtitle: 'Sale up to 30% off', 
    buttonText: 'Shop Now', 
    image: '/placeholder.svg' 
  };
  
  const sideBanners = [
    { title: '70% OFF', subtitle: 'Fresh Fruit & Vegetable', buttonText: 'Shop Now' },
    { title: 'Special Products Deal of the Month', buttonText: 'Shop Now' }
  ];

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
        {/* Main Banner */}
        <div className="relative col-span-2 h-[400px] rounded-xl bg-gray-200 p-8 flex flex-col justify-end dark:bg-gray-800">
          <h1 className="text-5xl font-extrabold text-black dark:text-white z-10">{mainBanner.title}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 z-10">{mainBanner.subtitle}</p>
          <button className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-lg w-fit z-10">
            {mainBanner.buttonText}
          </button>
          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[100px] font-bold text-gray-400 opacity-20">Placeholder</span>
        </div>

        {/* Side Banners */}
        <div className="flex flex-col gap-4">
          {sideBanners.map((banner, index) => (
            <div key={index} className="relative h-[192px] rounded-xl bg-gray-200 p-6 flex flex-col justify-end dark:bg-gray-800">
              <h2 className="text-xl font-bold dark:text-white">{banner.title}</h2>
              {banner.subtitle && <p className="text-sm dark:text-gray-300">{banner.subtitle}</p>}
              <Link href="/search" className="text-sm text-green-500 font-medium mt-2">
                {banner.buttonText}
              </Link>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl font-bold text-gray-400 opacity-20">Placeholder</span>
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

      {/* Popular Products (TARJETAS COMPLETAS RESTAURADAS) */}
      <section className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold dark:text-white">Popular Products</h2>
          <Link href="/search" className="text-sm text-green-500">
            View All →
          </Link>
        </div>
        
        {/* Grid para 3 columnas para las tarjetas grandes */}
        <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
          {popularProducts.slice(0, 12).map((product) => (
            <Link 
              key={product.handle} 
              href={`/product/${product.handle}`} 
              className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              prefetch={true}
            >
              {/* Contenedor de la imagen (simulando el placeholder grande) */}
              <div className="relative h-64 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-400">Placeholder</span>
              </div>

              {/* Contenedor de información y botón */}
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium dark:text-white">{product.title}</h3>
                  <p className="text-xl font-bold text-green-600 dark:text-green-500">
                    {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                  </p>
                </div>
                
                {/* Simulación del botón de Add to Cart */}
                <button 
                  className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-600"
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation();
                    console.log(`Add to cart: ${product.title}`);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </Grid>
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