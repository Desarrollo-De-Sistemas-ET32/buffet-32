<<<<<<< Updated upstream
import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
=======

import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PageContainer from "../components/PageContainer";
import HomeContainer from "@/components/home/HomeContainer";

export default function Home() {
  return (
    <PageContainer showHeader isHomePage>
      <HomeContainer />
    </PageContainer>
>>>>>>> Stashed changes
  );
}
