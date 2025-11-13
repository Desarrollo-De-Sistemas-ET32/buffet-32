"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchFeaturedProductsAction } from '@/actions/products'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import ProductCard from '../products/ProductCard'
import { Product } from '@/types/product'
import { Button } from '../ui/button'
import Link from 'next/link'
import FeaturedProductsSkeleton from './FeaturedProductsSkeleton'
import Autoplay from "embla-carousel-autoplay";
import { useAuth } from '@/context/auth-context';

interface FeaturedProductsProps {
    title: string
    layout: 'grid' | 'carousel'
    maxProducts: number
    autoPlay: boolean
    showViewAllButton: boolean
    viewAllButtonText: string
}

const FeaturedProducts = ({
    title,
    layout,
    maxProducts,
    autoPlay,
    showViewAllButton,
    viewAllButtonText
}: FeaturedProductsProps) => {

    const { userId } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['featured-products', maxProducts, userId],
        queryFn: () => fetchFeaturedProductsAction(maxProducts, userId || undefined),
    })

    if (isLoading) return <FeaturedProductsSkeleton layout={layout} maxProducts={maxProducts} />
    if (error) return <div>Error: {error.message}</div>
    if (!data?.success || !data?.data || data.data.length === 0) {
        return null;
    }

    const products = data.data

    return (
        <div className="w-full container mx-auto px-4">
            <div className="flex justify-between mb-6 items-center">
                <h2 className="text-3xl font-bold">{title}</h2>
                {showViewAllButton && (
                    <Link href="/products">
                        <Button variant="outline" size="sm">{viewAllButtonText}</Button>
                    </Link>
                )}
            </div>

            {layout === 'carousel' ? (
                <Carousel
                    plugins={autoPlay ? [
                        Autoplay({
                            delay: 2000,
                            stopOnMouseEnter: true,
                        }),
                    ] : []}
                    opts={{
                        align: "start",
                        loop: false,
                        dragFree: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {products.map((product: Product) => (
                            <CarouselItem key={product._id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-[28.5%]">
                                <div className="p-1">
                                    <ProductCard product={product} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-1 xl:-left-10 top-1/2 transform -translate-y-1/2" />
                    <CarouselNext className="absolute right-1 xl:-right-10 top-1/2 transform -translate-y-1/2" />
                </Carousel>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product: Product) => (
                        <div key={product._id} className="w-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FeaturedProducts