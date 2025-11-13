import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton'

const HeroSkeleton = () => {
    return (
        <section className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                <Skeleton className="w-full h-full" />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center mb-6">
                    <Skeleton className="w-16 h-16 rounded-full" />
                </div>

                <div className="mb-6">
                    <Skeleton className="h-12 lg:h-16 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-12 lg:h-16 w-1/2 mx-auto" />
                </div>

                <div className="mb-8 max-w-2xl mx-auto space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6 mx-auto" />
                    <Skeleton className="h-6 w-4/5 mx-auto" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-40" />
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <Skeleton className="w-6 h-10 rounded-full" />
            </div>
        </section>
    )
}

const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 w-full h-full bg-background z-[9999] flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <Image
                    src="/logoremoved.png"
                    alt="Logo"
                    width={256}
                    height={64}
                    className="animate-pulse filter dark:brightness-0 dark:invert h-auto"
                />
            </div>
        </div>
    )
}

interface HeroProps {
    data: {
        heroTitle: string;
        heroDescription: string;
        heroImage: string;
        heroPrimaryButtonText: string;
        heroSecondaryButtonText: string;
    };
}

const Hero = ({ data }: HeroProps) => {
    // Safety check for undefined data
    if (!data) {
        return <HeroSkeleton />;
    }

    return (
        <section className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={data.heroImage}
                    alt="Hero background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl text-white lg:text-6xl font-bold leading-tight mb-6">
                    {data.heroTitle}
                </h1>

                <p className="text-xl mb-8 leading-relaxed text-white/90 max-w-2xl mx-auto">
                    {data.heroDescription}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/products" className='w-full sm:w-auto'>
                        <Button size="lg" className="flex items-center w-full sm:w-auto gap-2">
                            {data.heroPrimaryButtonText}
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="flex items-center gap-2">
                        {data.heroSecondaryButtonText}
                        {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg> */}
                    </Button>
                </div>
            </div>

            {/* Scroll indicator */}
            {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-bounce"></div>
                </div>
            </div> */}
        </section>
    )
}

export { Hero, HeroSkeleton, FullScreenLoader }
export default Hero