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
  const categories = [
    { name: 'Fresh Fruit', icon: '/placeholder.svg' },
    { name: 'Fresh Vegetables', icon: '/placeholder.svg' },
    { name: 'Meat & Fish', icon: '/placeholder.svg' },
    { name: 'Snacks', icon: '/placeholder.svg' },
    { name: 'Beverages', icon: '/placeholder.svg' },
    { name: 'Beauty & Health', icon: '/placeholder.svg' },
    { name: 'Bread & Bakery', icon: '/placeholder.svg' },
    { name: 'Baking Needs', icon: '/placeholder.svg' },
    { name: 'Cooking', icon: '/placeholder.svg' },
    { name: 'Diabetic Food', icon: '/placeholder.svg' },
    { name: 'Dish Detergents', icon: '/placeholder.svg' },
    { name: 'Oil', icon: '/placeholder.svg' }
  ];

  const featuredProducts = (await getProducts({ sortKey: 'CREATED_AT', reverse: true })).slice(0, 8);

  const banners = [
    {
      title: 'Sale of the Month',
      subtitle: 'Best Deals',
      link: '/search'
    },
    {
      title: 'Low-Fat Meat',
      subtitle: '25% Fat Free',
      link: '/search'
    },
    {
      title: '100% Fresh Fruit',
      subtitle: 'Summer Sale',
      link: '/search'
    }
  ];

  const mainBanner = {
    title: 'Fresh & Healthy Organic Food',
    subtitle: 'Sale up to 30% off',
    link: '/search'
  };

  const sideBanners = [
    {
      title: '70% OFF',
      subtitle: 'Fresh Fruit & Vegetable',
      link: '/search'
    },
    {
      title: 'Special Products Deal of the Month',
      subtitle: 'Shop Now',
      link: '/search'
    }
  ];

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
          </Link>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link href="/search" className="text-sm text-[#2C742F] hover:text-[#00B207]">
            View All →
          </Link>
        </div>
        <Grid className="grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 mt-4">
          {categories.map((category) => (
            <Grid.Item
              key={category.name}
              className="flex flex-col items-center rounded-xl border border-[#84D187]/70 bg-white p-4 shadow-sm"
            >
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#84D187]/40">
                <img src={category.icon} alt={category.name} className="h-full w-full object-cover" />
              </div>
              <p className="mt-2 text-center text-sm font-medium">{category.name}</p>
            </Grid.Item>
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
          <Link
            key={index}
            href={banner.link}
            className="relative flex h-60 items-center overflow-hidden rounded-xl bg-gray-200"
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: 'url(/placeholder.svg)' }}
            ></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-black">
              <h3 className="text-lg font-bold">{banner.title}</h3>
              <p className="text-sm">{banner.subtitle}</p>
              <span className="mt-2 inline-block rounded-full bg-white px-4 py-1 text-xs font-bold text-black">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
