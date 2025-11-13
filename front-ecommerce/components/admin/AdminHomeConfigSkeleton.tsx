"use client"
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Settings, Monitor } from 'lucide-react'

const AdminHomeConfigSkeleton = () => {
    return (
        <div className="w-full space-y-8">
            {/* Configuration Form Skeleton */}
            <Card className="w-full border-none shadow-lg">
                {/* Header Skeleton */}
                <div className="flex items-center gap-3 p-6 border-b">
                    <Settings className="h-6 w-6" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                </div>
                
                <CardContent className="p-8">
                    <div className="space-y-8">
                        {/* Hero Section Skeleton */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-24" />
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Form Fields */}
                                <div className="space-y-4">
                                    {/* Hero Title */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>

                                    {/* Hero Description */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-24 w-full" />
                                    </div>

                                    {/* Button Texts */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Image Upload */}
                                <div className="space-y-4">
                                    {/* Hero Image Upload */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>

                                    {/* Image Preview */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-48 w-full rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t" />

                        {/* Display Options Skeleton */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-28" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Featured Products Option */}
                                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                                    <Skeleton className="h-4 w-4" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-64" />
                                    </div>
                                </div>

                                {/* Category Banners Option */}
                                <div className="flex items-center space-x-3 p-4 border rounded-lg">
                                    <Skeleton className="h-4 w-4" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-3 w-56" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button Skeleton */}
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>

            {/* Live Preview Skeleton */}
            <Card className="w-full border-none shadow-lg">
                {/* Preview Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <Monitor className="h-6 w-6" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-4 w-80" />
                        </div>
                    </div>
                    <Skeleton className="h-9 w-28" />
                </div>
                
                {/* Preview Content */}
                <div className="p-0">
                    <div className="relative w-full h-96">
                        {/* Background Skeleton */}
                        <Skeleton className="absolute inset-0" />
                        
                        {/* Content Overlay */}
                        <div className="relative z-10 flex items-center justify-center h-full">
                            <div className="text-center max-w-2xl mx-auto px-6 space-y-6">
                                {/* Title Skeleton */}
                                <Skeleton className="h-12 w-96 mx-auto" />
                                
                                {/* Description Skeleton */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-3/4 mx-auto" />
                                </div>
                                
                                {/* Buttons Skeleton */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Skeleton className="h-12 w-32" />
                                    <Skeleton className="h-12 w-32" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminHomeConfigSkeleton; 