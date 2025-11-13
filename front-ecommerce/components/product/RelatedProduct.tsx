import React from 'react'
import ProductCard from '../products/ProductCard'
import { useRelatedProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types/product'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import RelatedProductSkeleton from './RelatedProductSkeleton'
import { useAuth } from '@/context/auth-context';

const RelatedProduct = ({ categoryId, productId }: { categoryId: string, productId: string }) => {
  const { userId } = useAuth();
  const { data, isLoading } = useRelatedProducts(categoryId, productId, userId || undefined)
  const addToCart = useCart((state) => state.addToCart);

  if (isLoading) return <RelatedProductSkeleton />

  if (!data?.data || data.data.length === 0) return <div className="mt-12">
    <h2 className="text-2xl font-bold mb-4">Productos relacionados</h2>
    <p className="text-muted-foreground">No se encontraron productos relacionados</p>
  </div>;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Productos relacionados</h2>
      <div className="relative">
        <Carousel
          opts={{ align: 'start', slidesToScroll: 1, dragFree: true, loop: false }}
          className="w-full"
        >
          <CarouselContent className="">
            {data.data.map((product: Product) => (
              <CarouselItem
                key={product._id}
                className="basis-[calc(100%/3.5)] max-w-[calc(100%/3.5)]"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default RelatedProduct
