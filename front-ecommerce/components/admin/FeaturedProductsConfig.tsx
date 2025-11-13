'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Grid3X3, 
  ArrowLeftRight, 
  Star, 
  Settings
} from 'lucide-react';
import { updateFeaturedProductsConfig } from '@/actions/admin';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const featuredProductsSchema = z.object({
  isEnabled: z.boolean(),
  title: z.string().min(1, 'El título es obligatorio'),
  layout: z.enum(['grid', 'carousel']),
  maxProducts: z.number().min(1, 'Debe mostrar al menos 1 producto').max(12, 'No se pueden mostrar más de 12 productos'),
  autoPlay: z.boolean(),
  showViewAllButton: z.boolean(),
  viewAllButtonText: z.string().optional(),
});

type FeaturedProductsFormData = z.infer<typeof featuredProductsSchema>;

interface FeaturedProductsConfigProps {
  initialData?: {
    _id: string;
    featuredProducts: {
      isEnabled: boolean;
      title: string;
      layout: 'grid' | 'carousel';
      maxProducts: number;
      autoPlay: boolean;
      showViewAllButton: boolean;
      viewAllButtonText?: string;
    };
  };
  isSubmitting?: boolean;
}



export default function FeaturedProductsConfig({ 
  initialData, 
  isSubmitting 
}: FeaturedProductsConfigProps) {
  const queryClient = useQueryClient();

  const updateFeaturedProductsMutation = useMutation({
    mutationFn: updateFeaturedProductsConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-config'] });
      toast.success('Configuración de productos destacados actualizada con éxito');
    },
    onError: () => {
      toast.error('Fallo al actualizar la configuración de productos destacados');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FeaturedProductsFormData>({
    resolver: zodResolver(featuredProductsSchema),
    defaultValues: {
      isEnabled: initialData?.featuredProducts?.isEnabled ?? false,
      title: initialData?.featuredProducts?.title ?? 'Featured Products',
      layout: initialData?.featuredProducts?.layout ?? 'grid',
      maxProducts: initialData?.featuredProducts?.maxProducts ?? 6,
      autoPlay: initialData?.featuredProducts?.autoPlay ?? true,
      showViewAllButton: initialData?.featuredProducts?.showViewAllButton ?? true,
      viewAllButtonText: initialData?.featuredProducts?.viewAllButtonText ?? 'View All Products',
    },
  });

  const watchedValues = watch();
  const { isEnabled, layout, showViewAllButton } = watchedValues;

  const handleFormSubmit = async (data: FeaturedProductsFormData) => {
    if (!initialData?._id) {
      toast.error('No se encontró ID de configuración');
      return;
    }
    
    await updateFeaturedProductsMutation.mutateAsync({
      _id: initialData._id,
      featuredProducts: {
        ...data,
        viewAllButtonText: data.viewAllButtonText || 'Ver Todos los Productos',
      },
    });
  };

  return (
    <div className="overflow-y-auto">
      <div className="pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Configuración de Productos Destacados</h2>
            <p className="text-sm text-muted-foreground">
              Configura la sección de productos destacados en tu página de inicio
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-6 space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
              <Checkbox
                id="isEnabled"
                checked={isEnabled}
                onCheckedChange={(checked) => {
                  setValue('isEnabled', checked as boolean, { shouldValidate: true });
                }}
              />
              <div>
                <Label htmlFor="isEnabled" className="text-sm font-medium">
                  Habilitar Sección de Productos Destacados
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mostrar la sección de productos destacados en la página de inicio
                </p>
              </div>
            </div>
          </div>

          {isEnabled && (
            <>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Información de la Sección
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Título de la Sección
                  </Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Productos Destacados"
                    className={`h-10 ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500">{errors.title.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Configuración de Diseño
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Diseño de Visualización</Label>
                    <RadioGroup
                      value={layout}
                      onValueChange={(value) => setValue('layout', value as 'grid' | 'carousel')}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="grid" id="grid" />
                        <Label htmlFor="grid" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                          <Grid3X3 className="w-4 h-4" />
                          Diseño de Cuadrícula
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="carousel" id="carousel" />
                                                 <Label htmlFor="carousel" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                           <ArrowLeftRight className="w-4 h-4" />
                           Carrusel
                         </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxProducts" className="text-sm font-medium">
                        Máximo de Productos a Mostrar
                      </Label>
                      <Select
                        value={watchedValues.maxProducts.toString()}
                        onValueChange={(value) => setValue('maxProducts', parseInt(value))}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[4, 6, 8, 10, 12].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} productos
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {layout === 'carousel' && (
                      <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <Checkbox
                          id="autoPlay"
                          checked={watchedValues.autoPlay}
                          onCheckedChange={(checked) => {
                            setValue('autoPlay', checked as boolean, { shouldValidate: true });
                          }}
                        />
                        <div>
                          <Label htmlFor="autoPlay" className="text-sm font-medium">
                            Carrusel con reproducción automática
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Rotar automáticamente a través de los productos
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Call-to-Action
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <Checkbox
                      id="showViewAllButton"
                      checked={showViewAllButton}
                      onCheckedChange={(checked) => {
                        setValue('showViewAllButton', checked as boolean, { shouldValidate: true });
                      }}
                    />
                    <div>
                      <Label htmlFor="showViewAllButton" className="text-sm font-medium">
                                                 Show &quot;View All&quot; Button
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Display a button to view all products
                      </p>
                    </div>
                  </div>
                  
                  {showViewAllButton && (
                    <div className="space-y-2">
                      <Label htmlFor="viewAllButtonText" className="text-sm font-medium">
                        Button Text
                      </Label>
                      <Input
                        id="viewAllButtonText"
                        {...register('viewAllButtonText')}
                        placeholder="View All Products"
                        className="h-10"
                      />
                    </div>
                  )}
                </div>
              </div>


            </>
          )}

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full font-medium"
              disabled={updateFeaturedProductsMutation.isPending}
            >
              {updateFeaturedProductsMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Configuration...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Save Featured Products Configuration
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 