import React from 'react'
import ProductCardSkeleton from './ProductCardSkeleton'
import { Input } from '../ui/input'

const ProductSuspense = () => {
    return (
        <div className='w-full'>
            <Input
                placeholder="Buscar por nombre..."
                disabled
                className={`col-span-4`}
            />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={`skeleton-next-${i}`} />
                ))}
            </div>
        </div>
    )
}

export default ProductSuspense
