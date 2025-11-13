import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const RelatedProductSkeleton = () => {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Productos relacionados</h2>
            <div className="flex gap-4 overflow-x-hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className={
                            'flex-shrink-0 bg-card rounded-xl border shadow-sm p-4 pt-0 px-0 flex flex-col gap-3' +
                            (i === 3 ? ' w-1/2' : ' w-1/4')
                        }
                        style={{ minWidth: i === 3 ? '12.5%' : '25%' }}
                    >
                        <Skeleton className="w-full h-60 rounded-t-xl rounded-b-none mb-2" /> {/* Image */}
                        <div className="flex flex-col gap-3 p-4">
                            <Skeleton className="h-6 w-3/4 mb-1" /> {/* Title */}
                            <Skeleton className="h-4 w-16 mb-2" /> {/* Badge */}
                            <Skeleton className="h-10 w-full mt-auto" /> {/* Button */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RelatedProductSkeleton
