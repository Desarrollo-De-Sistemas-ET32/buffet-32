"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Image from 'next/image'

const homeConfigSchema = z.object({
    _id: z.string(),
    heroTitle: z.string().min(1, 'El título del héroe es obligatorio'),
    heroDescription: z.string().min(1, 'La descripción del héroe es obligatoria'),
    heroImage: z.url('La imagen del héroe debe ser una URL válida'),
    heroPrimaryButtonText: z.string().min(1, 'El texto del botón principal es obligatorio'),
    heroPrimaryButtonLink: z.string().min(1, 'El enlace del botón principal es obligatorio'),
    heroSecondaryButtonText: z.string().min(1, 'El texto del botón secundario es obligatorio'),
    heroSecondaryButtonLink: z.string().min(1, 'El enlace del botón secundario es obligatorio'),
});

export type HomeConfigFormData = z.infer<typeof homeConfigSchema>;

interface HomeConfigFormProps {
    initialData?: {
        _id: string;
        heroTitle: string;
        heroDescription: string;
        heroImage: string;
        heroPrimaryButtonText: string;
        heroPrimaryButtonLink: string;
        heroSecondaryButtonText: string;
        heroSecondaryButtonLink: string;
    };
    onSubmit: (data: HomeConfigFormData) => Promise<void>;
    isSubmitting: boolean;
    isUploading: boolean;
}

const HomeConfigForm: React.FC<HomeConfigFormProps> = ({
    initialData,
    onSubmit,
    isSubmitting,
    isUploading
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<HomeConfigFormData>({
        resolver: zodResolver(homeConfigSchema),
        defaultValues: {
            _id: '',
            heroTitle: '',
            heroDescription: '',
            heroImage: '',
            heroPrimaryButtonText: '',
            heroPrimaryButtonLink: '',
            heroSecondaryButtonText: '',
            heroSecondaryButtonLink: '',
        },
    });

    const heroImageValue = watch('heroImage');

    React.useEffect(() => {
        if (initialData) {
            reset({
                _id: initialData._id,
                heroTitle: initialData.heroTitle,
                heroDescription: initialData.heroDescription,
                heroImage: initialData.heroImage,
                heroPrimaryButtonText: initialData.heroPrimaryButtonText,
                heroPrimaryButtonLink: initialData.heroPrimaryButtonLink,
                heroSecondaryButtonText: initialData.heroSecondaryButtonText,
                heroSecondaryButtonLink: initialData.heroSecondaryButtonLink,
            });
        }
    }, [initialData, reset]);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecciona un archivo de imagen válido');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('El tamaño de la imagen debe ser inferior a 5MB');
            return;
        }

        const url = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(url);
        setValue('heroImage', url, { shouldValidate: true });
    };

    const handleFormSubmit = async (formData: HomeConfigFormData) => {
        if (!formData._id || !formData.heroTitle || !formData.heroDescription || !formData.heroImage) {
            toast.error('Por favor, rellena todos los campos obligatorios');
            return;
        }

        try {
            let finalImageUrl = formData.heroImage;
            if (selectedFile) {
                setIsUploadingImage(true);
                finalImageUrl = await uploadImageToS3(selectedFile);
                setIsUploadingImage(false);
            }

            const updatedFormData = {
                ...formData,
                heroImage: finalImageUrl
            };

            await onSubmit(updatedFormData);

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                setSelectedFile(null);
            }
        } catch (error) {
            setIsUploadingImage(false);
            toast.error('Fallo al actualizar la configuración de inicio');
            console.error('Form submission error:', error);
        }
    };

    const uploadImageToS3 = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Fallo en la subida');
        }

        const result = await response.json();
        return result.url;
    };

    // Combine external isUploading with local isUploadingImage
    const isCurrentlyUploading = isUploading || isUploadingImage;

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            <input type="hidden" {...register('_id')} />

            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm font-medium">Sección de Héroe</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="heroTitle" className="text-sm font-medium">Título del Héroe</Label>
                            <Input
                                id="heroTitle"
                                {...register('heroTitle')}
                                placeholder="Introduce el título del héroe"
                                className={errors.heroTitle ? 'border-red-500' : ''}
                            />
                            {errors.heroTitle && (
                                <p className="text-sm text-red-500">{errors.heroTitle.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="heroDescription" className="text-sm font-medium">Descripción del Héroe</Label>
                            <Textarea
                                id="heroDescription"
                                {...register('heroDescription')}
                                placeholder="Introduce la descripción del héroe"
                                rows={4}
                                className={errors.heroDescription ? 'border-red-500' : ''}
                            />
                            {errors.heroDescription && (
                                <p className="text-sm text-red-500">{errors.heroDescription.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className='space-y-3'>
                                <div className="space-y-2">
                                    <Label htmlFor="heroPrimaryButtonText" className="text-sm font-medium">Texto del Botón Principal</Label>
                                    <Input
                                        id="heroPrimaryButtonText"
                                        {...register('heroPrimaryButtonText')}
                                        className={errors.heroPrimaryButtonText ? 'border-red-500' : ''}
                                    />
                                    {errors.heroPrimaryButtonText && (
                                        <p className="text-sm text-red-500">{errors.heroPrimaryButtonText.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="heroPrimaryButtonLink" className="text-sm font-medium">Enlace del Botón Principal</Label>
                                    <Input
                                        id="heroPrimaryButtonLink"
                                        {...register('heroPrimaryButtonLink')}
                                        className={errors.heroPrimaryButtonLink ? 'border-red-500' : ''}
                                    />
                                    {errors.heroPrimaryButtonLink && (
                                        <p className="text-sm text-red-500">{errors.heroPrimaryButtonLink.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className='space-y-3'>
                                <div className="space-y-2">
                                    <Label htmlFor="heroSecondaryButtonText" className="text-sm font-medium">Texto del Botón Secundario</Label>
                                    <Input
                                        id="heroSecondaryButtonText"
                                        {...register('heroSecondaryButtonText')}
                                        className={errors.heroSecondaryButtonText ? 'border-red-500' : ''}
                                    />
                                    {errors.heroSecondaryButtonText && (
                                        <p className="text-sm text-red-500">{errors.heroSecondaryButtonText.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="heroSecondaryButtonLink" className="text-sm font-medium">Enlace del Botón Secundario</Label>
                                    <Input
                                        id="heroSecondaryButtonLink"
                                        {...register('heroSecondaryButtonLink')}
                                        className={errors.heroSecondaryButtonLink ? 'border-red-500' : ''}
                                    />
                                    {errors.heroSecondaryButtonLink && (
                                        <p className="text-sm text-red-500">{errors.heroSecondaryButtonLink.message}</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="heroImage" className="text-sm font-medium">Imagen del Héroe</Label>
                            <Input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                disabled={isCurrentlyUploading}
                                className="cursor-pointer"
                            />
                            {errors.heroImage && (
                                <p className="text-sm text-red-500">{errors.heroImage.message}</p>
                            )}
                        </div>

                        {(heroImageValue || previewUrl) && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Vista previa de la imagen:</Label>
                                <div
                                    className="relative w-full h-48 rounded-lg overflow-hidden border cursor-pointer group"
                                    onClick={() => document.getElementById('imageUpload')?.click()}
                                >
                                    <Image
                                        src={previewUrl || heroImageValue || ''}
                                        alt="Hero image preview"
                                        width={512}
                                        height={512}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                        <p className="text-white text-sm font-medium">
                                            {selectedFile ? 'Haz clic para cambiar la imagen (aún no subida)' : 'Haz clic para cambiar la imagen'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <input type="hidden" {...register('heroImage')} />

            <Button
                type="submit"
                className="w-full font-medium py-3"
                disabled={isSubmitting || isCurrentlyUploading}
            >
                {isSubmitting || isCurrentlyUploading ? 'Actualizando...' : 'Actualizar Configuración de Inicio'}
            </Button>
        </form>
    );
};

export default HomeConfigForm; 