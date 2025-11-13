"use client"
import { useParams } from 'next/navigation'
import { useProductById } from '@/hooks/useProducts'
import ProductDetail from './ProductDetail'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const ProductDetailComponent = () => {
  // TODO: CHECK PARAMS OR NUQS
  const params = useParams() as { id: string }
  const { id } = params
  const { data, isLoading, error } = useProductById(id)

  if (isLoading) {
    return (
      <div className="max-w-4xl w-full mx-auto">
        <div className="flex flex-col md:flex-row gap-8 p-8 items-center md:items-start">
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <Skeleton className="rounded-lg w-full max-w-xs h-64 bg-muted" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-full mt-4" />
          </div>
        </div>
      </div>
    )
  }
  if (error) return <div className="text-destructive">Error: {error.message}</div>
  if (!data?.data) return <div>Product not found</div>
  return <ProductDetail product={data.data} />
}

export default ProductDetailComponent 