"use client"
import { fetchCategoriesAction } from '@/actions/category';
import { Category } from '@/types/product';
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import FeaturedCategoriesSkeleton from './FeaturedCategoriesSkeleton';


const FeaturedCategories = () => {

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: () => fetchCategoriesAction(),
    });

    useEffect(() => {
        console.log(categories);
    }, [categories]);

    if (isLoading) return <FeaturedCategoriesSkeleton />
    if (error) return <div>Error: {error.message}</div>
    if (!categories?.success || !categories?.data || categories.data.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 container mx-auto">
            <div className="mb-10">
                <h2 className="text-3xl font-bold">Compra por categoría</h2>
                {/* <p className="text-muted-foreground text-lg">
                    Explore our diverse range of categories and find exactly what you&apos;re looking for
                </p> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.data.map((category: Category) => (
                    <Link
                        key={category._id}
                        href={`/products?category=${category.slug}`}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    >
                        <div className="aspect-[3/2] relative">
                            <Image
                                src={category.image || "/placeholder.svg"}
                                alt={category.name}
                                fill
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                                    {category.name}
                                </h3>
                            </div>

                            <Button
                                variant="secondary"
                            >
                                Comprar ahora
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default FeaturedCategories
