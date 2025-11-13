"use client"
import { useProductsBySearch } from '@/hooks/useProducts';
import React from 'react'
import { useQueryState } from 'nuqs';
import InfiniteScroll from '../ui/infinite-scroll';
import ProductCardSkeleton from './ProductCardSkeleton';
import ProductCard from './ProductCard';
import { useCategories } from '@/hooks/useCategory';
import { useDebounce } from '@/hooks/useDebounce';
import ProductFilter from './ProductFilter';
import { useAuth } from '@/context/auth-context';

const ProductListShop = () => {

    const { userId } = useAuth();
    const { data: products, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useProductsBySearch(userId || undefined);
    const [searchQuery, setSearchQuery] = useQueryState('q', { defaultValue: '' });
    const [inputValue, setInputValue] = React.useState(searchQuery);
    const debouncedInput = useDebounce(inputValue, 300);

    React.useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);

    React.useEffect(() => {
        if (debouncedInput !== searchQuery) {
            setSearchQuery(debouncedInput);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedInput]);

    const [category, setCategory] = useQueryState('category', { defaultValue: 'all' });
    const [priceOrder, setPriceOrder] = useQueryState('priceOrder', { defaultValue: 'default' });
    const [withDiscount, setWithDiscount] = useQueryState('withDiscount', { defaultValue: false, parse: (value) => value === 'true' });
    const [featured, setFeatured] = useQueryState('featured', { defaultValue: false, parse: (value) => value === 'true' });
    const { data: categories, isLoading: categoriesLoading } = useCategories();

    const categoriesArray = Array.isArray(categories) ? categories : [];

    const allProducts = products?.pages.flatMap(page => page.products) ?? [];
    const uniqueProducts = Array.from(new Map(allProducts.map(p => [p._id, p])).values());

    return (
        <div className='w-full grid grid-cols-1 lg:grid-cols-4 gap-8'>
            <aside className="lg:col-span-1">
                <ProductFilter
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    searchQuery={searchQuery}
                    category={category}
                    setCategory={setCategory}
                    priceOrder={priceOrder}
                    setPriceOrder={setPriceOrder}
                    withDiscount={withDiscount}
                    setWithDiscount={setWithDiscount}
                    featured={featured}
                    setFeatured={setFeatured}
                    categories={categoriesArray}
                    isLoading={categoriesLoading}
                />
            </aside>
            <main className="lg:col-span-3">
                {error && <div>Error al cargar productos</div>}
                <InfiniteScroll
                    isLoading={isFetchingNextPage}
                    hasMore={!!hasNextPage}
                    next={fetchNextPage}
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {isLoading &&
                            Array.from({ length: 3 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))
                        }
                        {!isLoading && uniqueProducts.length === 0 && !isFetchingNextPage && (
                            <div className="col-span-full text-center text-muted-foreground py-8">No se encontraron productos</div>
                        )}
                        {!isLoading && uniqueProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                        {isFetchingNextPage && !isLoading &&
                            Array.from({ length: 3 }).map((_, i) => (
                                <ProductCardSkeleton key={`skeleton-next-${i}`} />
                            ))
                        }
                    </div>
                </InfiniteScroll>
            </main>
        </div>
    )
}

export default ProductListShop
