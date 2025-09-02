import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { getCollectionProducts } from 'lib/shopify';
import type { Product } from 'lib/shopify/types';
import Link from 'next/link';
import Image from 'next/image';

function ProductGridItem({ item }: { item: Product }) {
  return (
    <Grid.Item className="animate-fadeIn">
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          alt={item.title}
          label={{
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode
          }}
        />
      </Link>
    </Grid.Item>
  );
}

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
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

  const popularProducts = [
    { name: 'Green Apple', icon: '/placeholder.svg' },
    { name: 'Orange', icon: '/placeholder.svg' },
    { name: 'Green Cabbage', icon: '/placeholder.svg' },
    { name: 'Green Lettuce', icon: '/placeholder.svg' },
    { name: 'Eggplant', icon: '/placeholder.svg' },
    { name: 'Eggplant', icon: '/placeholder.svg' },
    { name: 'Big Potatoes', icon: '/placeholder.svg' },
    { name: 'Egg', icon: '/placeholder.svg' },
    { name: 'Fresh Cauliflower', icon: '/placeholder.svg' },
    { name: 'Green Capsicum', icon: '/placeholder.svg' },
    { name: 'Green Chilli', icon: '/placeholder.svg' },
    { name: 'Pears', icon: '/placeholder.svg' }
  ];

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
          className="relative col-span-2 flex h-[500px] items-center overflow-hidden rounded-xl bg-gray-200"
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: 'url(/placeholder.svg)' }}
          ></div>
          <div className="absolute top-1/2 left-10 -translate-y-1/2 transform text-black">
            <h2 className="text-4xl font-bold">{mainBanner.title}</h2>
            <p className="text-xl">{mainBanner.subtitle}</p>
            <span className="mt-4 inline-block rounded-full bg-green-500 px-6 py-2 font-bold text-white">
              Shop Now
            </span>
          </div>
        </Link>
        {/* Banners Laterales */}
        <div className="col-span-1 flex flex-col gap-4">
          <Link
            href={sideBanners[0].link}
            className="relative flex h-[240px] items-center overflow-hidden rounded-xl bg-gray-200"
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: 'url(/placeholder.svg)' }}
            ></div>
            <div className="absolute top-1/2 left-5 -translate-y-1/2 transform text-black">
              <h3 className="text-2xl font-bold">{sideBanners[0].title}</h3>
              <p>{sideBanners[0].subtitle}</p>
              <span className="mt-2 inline-block font-bold underline">Shop Now</span>
            </div>
          </Link>
          <Link
            href={sideBanners[1].link}
            className="relative flex h-[240px] items-center overflow-hidden rounded-xl bg-gray-200"
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: 'url(/placeholder.svg)' }}
            ></div>
            <div className="absolute top-1/2 left-5 -translate-y-1/2 transform text-black">
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
          <Link href="/search" className="text-sm text-green-500">
            View All →
          </Link>
        </div>
        <Grid className="grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-4">
          {categories.map((category) => (
            <Grid.Item
              key={category.name}
              className="flex flex-col items-center p-4"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                <img src={category.icon} alt={category.name} className="h-full w-full object-cover" />
              </div>
              <p className="mt-2 text-center text-sm font-medium">{category.name}</p>
            </Grid.Item>
          ))}
        </Grid>
      </section>

      {/* Popular Products */}
      <section className="mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Products</h2>
          <Link href="/search" className="text-sm text-green-500">
            View All →
          </Link>
        </div>
        <Grid className="grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-4">
          {popularProducts.map((product) => (
            <Grid.Item
              key={product.name}
              className="flex flex-col items-center p-4"
            >
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                <img src={product.icon} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <p className="mt-2 text-center text-sm font-medium">{product.name}</p>
            </Grid.Item>
          ))}
        </Grid>
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