"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Monitor } from 'lucide-react'
import Image from 'next/image'

interface HeroPreviewProps {
    showPreview: boolean;
    onTogglePreview: () => void;
    heroData: {
        heroTitle: string;
        heroDescription: string;
        heroImage: string;
        heroPrimaryButtonText: string;
        heroSecondaryButtonText: string;
    };
}

const HeroPreview: React.FC<HeroPreviewProps> = ({
    showPreview,
    onTogglePreview,
    heroData
}) => {
    return (
        <div className="w-full border-none shadow-lg">
            <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                    <Monitor className="h-6 w-6" />
                    <div>
                        <h2 className="text-2xl font-bold">Vista Previa en Vivo</h2>
                        <p className="text-base text-muted-foreground">
                            Mira cómo se verá tu sección de héroe en la página de inicio
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onTogglePreview}
                    className="flex items-center gap-2"
                >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPreview ? 'Ocultar Vista Previa' : 'Mostrar Vista Previa'}
                </Button>
            </div>
            
            {showPreview && (
                <div className="p-0">
                    <div className="relative w-full h-96">
                        {/* Hero Image Background */}
                        {heroData.heroImage && (
                            <div className="absolute inset-0">
                                <Image
                                    src={heroData.heroImage}
                                    alt="Hero background"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40"></div>
                            </div>
                        )}
                        
                        {/* Hero Content */}
                        <div className="relative z-10 flex items-center justify-center h-full">
                            <div className="text-center max-w-2xl mx-auto px-6">
                                <h1 className="text-4xl md:text-5xl text-white font-bold mb-4">
                                    {heroData.heroTitle || 'Tu Título de Héroe'}
                                </h1>
                                <p className="text-lg text-white md:text-xl mb-8 leading-relaxed">
                                    {heroData.heroDescription || 'Tu descripción de héroe aparecerá aquí'}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button 
                                        size="lg" 
                                        className="px-8 py-3"
                                    >
                                        {heroData.heroPrimaryButtonText || 'Comprar Ahora'}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="lg" 
                                        className=""
                                    >
                                        {heroData.heroSecondaryButtonText || 'Saber Más'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroPreview; 