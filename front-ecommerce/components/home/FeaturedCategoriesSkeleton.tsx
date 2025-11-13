import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'

const FeaturedCategoriesSkeleton = () => {
    return (
        <div className='w-full py-16 container mx-auto px-4'>
            <div className="flex justify-between mb-6 items-center">
                <h2 className="text-4xl font-bold">Compra por categoría</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6'>
                {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className='w-full h-128' />
                ))}
            </div>
        </div>
    )
}

export default FeaturedCategoriesSkeleton
