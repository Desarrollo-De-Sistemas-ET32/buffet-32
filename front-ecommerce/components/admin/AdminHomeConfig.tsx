"use client"
import { getHomeConfig, updateHeroConfig } from '@/actions/admin'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import HomeConfigForm, { HomeConfigFormData } from './HomeConfigForm'
import HeroPreview from './HeroPreview'
import ConfigHeader from './ConfigHeader'
import AdminHomeConfigSkeleton from './AdminHomeConfigSkeleton'
import FeaturedProductsConfig from './FeaturedProductsConfig'

const AdminHomeConfig = () => {
    const queryClient = useQueryClient()
    const [showPreview, setShowPreview] = useState(true)

    const { data, isLoading, error } = useQuery({
        queryKey: ['home-config'],
        queryFn: getHomeConfig,
    })

    const updateHeroConfigMutation = useMutation({
        mutationFn: updateHeroConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['home-config'] })
            toast.success('Configuración del héroe actualizada con éxito')
        },
        onError: () => {
            toast.error('Fallo al actualizar la configuración del héroe')
        }
    })

    const handleSubmit = async (formData: HomeConfigFormData) => {
        await updateHeroConfigMutation.mutateAsync(formData);
    };

    if (isLoading) return <AdminHomeConfigSkeleton />
    if (error) return <div>Error: {error.message}</div>
    if (!data?.data) return <div>No se encontraron datos de configuración</div>

    const heroData = {
        heroTitle: data.data.heroTitle,
        heroDescription: data.data.heroDescription,
        heroImage: data.data.heroImage,
        heroPrimaryButtonText: data.data.heroPrimaryButtonText,
        heroPrimaryButtonLink: data.data.heroPrimaryButtonLink,
        heroSecondaryButtonText: data.data.heroSecondaryButtonText,
        heroSecondaryButtonLink: data.data.heroSecondaryButtonLink,
    };

    return (
        <div className="w-full space-y-8">
            <Card className="w-full border-none shadow-lg">
                <ConfigHeader
                    title="Configuración de Inicio"
                    description="Personaliza la sección de héroe de tu página de inicio y las opciones de visualización"
                />
                <CardContent className="p-8 space-y-8">
                    <HomeConfigForm
                        initialData={data.data}
                        onSubmit={handleSubmit}
                        isSubmitting={updateHeroConfigMutation.isPending}
                        isUploading={false}
                    />
                    <FeaturedProductsConfig
                        initialData={data.data}
                    />
                </CardContent>
            </Card>
            <HeroPreview
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
                heroData={heroData}
            />
        </div>
    )
}

export default AdminHomeConfig