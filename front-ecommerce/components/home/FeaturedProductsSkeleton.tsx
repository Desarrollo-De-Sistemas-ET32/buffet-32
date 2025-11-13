import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import ProductCardSkeleton from '../products/ProductCardSkeleton'
import Link from 'next/link'
import { Button } from '../ui/button'

interface FeaturedProductsSkeletonProps {
    layout?: 'grid' | 'carousel'
    maxProducts?: number
}

const FeaturedProductsSkeleton = ({ layout = 'carousel', maxProducts = 6 }: FeaturedProductsSkeletonProps) => {
    const skeletonItems = Array.from({ length: maxProducts }, (_, index) => index)

    return (
        <div className="w-full container mx-auto px-4">
            <div className="flex justify-between mb-6 items-center">
                <h2 className="text-2xl font-bold">Productos destacados</h2>
                <Link href="/products">
                    <Button variant="outline" size="sm">Ver todo</Button>
                </Link>
            </div>
            
            {layout === 'carousel' ? (
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {skeletonItems.map((index) => (
                            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-[28.5%]">
                                <div className="p-1">
                                    <ProductCardSkeleton />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-1 xl:-left-10 top-1/2 transform -translate-y-1/2" />
                    <CarouselNext className="absolute right-1 xl:-right-10 top-1/2 transform -translate-y-1/2" />
                </Carousel>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {skeletonItems.map((index) => (
                        <div key={index} className="w-full">
                            <ProductCardSkeleton />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FeaturedProductsSkeleton 
