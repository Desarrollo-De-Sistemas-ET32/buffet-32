import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const ProductCardSkeleton = () => {
    return (
        <Card className="group py-0 flex flex-col h-full">
            <CardContent className="p-0 flex flex-col h-full">
                {/* Image skeleton */}
                <div className="relative overflow-hidden rounded-t-lg">
                    <Skeleton className="w-full h-56 object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    {/* Title skeleton */}
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    {/* Description skeleton */}
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    {/* Rating skeleton */}
                    <div className="flex items-center mb-4">
                        <Skeleton className="h-4 w-24 mr-2" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                    {/* Price skeleton */}
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-4 w-12" />
                    </div>
                    {/* Button skeleton */}
                    <Skeleton className="h-10 w-full mt-auto" />
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductCardSkeleton