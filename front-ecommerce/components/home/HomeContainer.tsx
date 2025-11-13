"use client"
import { getHomeConfig } from '@/actions/admin'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Hero, { HeroSkeleton, FullScreenLoader } from './Hero'
import FeaturedProducts from './FeaturedProducts'
import FeaturedCategories from './FeaturedCategories'

const HomeContainer = () => {

    const { data, isLoading, error } = useQuery({
        queryKey: ['home-config'],
        queryFn: getHomeConfig,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 15,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    if (isLoading) {
        return (
            <>
                <FullScreenLoader />
                <HeroSkeleton />
            </>
        )
    }
    
    if (error) return <div>Error: {error.message}</div>
    if (!data?.success || !data?.data) return <div>No configuration data found</div>

    return (
        <div className='w-full flex flex-col gap-8'>
            <Hero data={data.data} />
            {
                data?.data.featuredProducts?.isEnabled && (
                    <FeaturedProducts 
                        title={data.data.featuredProducts.title}
                        layout={data.data.featuredProducts.layout}
                        maxProducts={data.data.featuredProducts.maxProducts}
                        autoPlay={data.data.featuredProducts.autoPlay}
                        showViewAllButton={data.data.featuredProducts.showViewAllButton}
                        viewAllButtonText={data.data.featuredProducts.viewAllButtonText}
                    />
                )
            }
            <FeaturedCategories />
            {/* {
                data?.data.showCategoryBanners && (
                    <CategoryBanners />
                )
            } */}
        </div>
    )
}

export default HomeContainer