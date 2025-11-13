import React, { useState } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchProductActionsByName } from '@/actions/products'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types/product'
import { useDebounce } from '@/hooks/useDebounce'
import { Skeleton } from './ui/skeleton'
import { formatMoney } from '@/utils/money'

const HeaderSearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const debouncedSearchQuery = useDebounce(searchQuery, 300)

    const { data: response, isLoading } = useQuery({
        queryKey: ['products', debouncedSearchQuery],
        queryFn: () => fetchProductActionsByName(debouncedSearchQuery),
        enabled: debouncedSearchQuery.length >= 2,
    })

    const products = response?.success ? response.data : []

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)
        setIsDropdownOpen(value.length >= 2)
    }

    const handleInputBlur = () => {
        setTimeout(() => setIsDropdownOpen(false), 200)
    }

    const handleInputFocus = () => {
        if (searchQuery.length >= 2) {
            setIsDropdownOpen(true)
        }
    }

    const shouldShowLoading = searchQuery.length >= 2 && (isLoading || debouncedSearchQuery !== searchQuery)

    const renderPrice = (product: Product) => {
        if (product.discount > 0) {
            const discountedPrice = product.price * (1 - product.discount / 100)
            return (
                <div className="flex flex-col">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">{formatMoney(discountedPrice)}</span>
                        <span className="text-xs text-muted-foreground line-through">{formatMoney(product.price)}</span>
                    </div>
                </div>
            )
        }
        return (
            <div className="flex flex-col">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-sm font-medium truncate">{formatMoney(product.price)}</p>
            </div>
        )
    }

    return (
        <div className='relative'>
            <form className="hidden md:flex items-center gap-2 w-96">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Buscar productos"
                        className="pl-10 h-9 text-base"
                        aria-label="Buscar productos"
                    />
                </div>
            </form>

            {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-86 overflow-y-auto">
                    {shouldShowLoading ? (
                        <div className="flex items-center gap-3 px-4 py-4">
                            <Skeleton className='w-12 h-12' />
                            <div className='flex flex-col gap-2'>
                                <Skeleton className='w-24 h-3' />
                                <Skeleton className='w-14 h-3' />
                            </div>
                        </div>
                    ) : products && products.length > 0 ? (
                        <div className="py-2">
                            {products.slice(0, 3).map((product: Product) => (
                                <Link
                                    key={product._id}
                                    href={`/product/${product._id}`}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                                    onClick={() => {
                                        setSearchQuery('')
                                        setIsDropdownOpen(false)
                                    }}
                                >
                                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                        {product.images && product.images[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <span className="text-xs text-muted-foreground">Sin imagen</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {renderPrice(product)}
                                    </div>
                                </Link>
                            ))}

                            {products.length === 3 && (
                                <div className="px-4 py-2 flex justify-center">
                                    <Link className='text-sm text-muted-foreground underline text-center' href={`/products?q=${encodeURIComponent(debouncedSearchQuery)}`}>
                                        Ver más
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : debouncedSearchQuery.length >= 2 && !isLoading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            No se encontraron productos
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default HeaderSearchBar
