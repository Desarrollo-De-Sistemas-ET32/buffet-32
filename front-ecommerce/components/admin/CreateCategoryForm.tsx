import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useCreateCategory } from '@/hooks/useCategory';
import { toast } from 'sonner';
import Image from 'next/image';
import { ImageIcon, Upload } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  image: z.string().min(1, 'La imagen de la categoría es obligatoria'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

type CreateCategoryFormProps = {
  onCreated?: () => void;
};

const CreateCategoryForm = ({ onCreated }: CreateCategoryFormProps) => {
  const createCategoryMutation = useCreateCategory();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const imageValue = watch('image');

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
    setValue('image', url, { shouldValidate: true });
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

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsUploading(true);

      let finalImageUrl = data.image;
      if (selectedFile) {
        finalImageUrl = await uploadImageToS3(selectedFile);
      }

      const updatedData = {
        ...data,
        image: finalImageUrl,
      };

      await createCategoryMutation.mutateAsync(updatedData);

      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSelectedFile(null);
      }

      reset();
      if (onCreated) onCreated();
    } catch (error) {
      toast.error('Fallo al crear la categoría');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Información de la Categoría
        </h3>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nombre de la Categoría
          </Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Introduce el nombre de la categoría"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryImage" className="text-sm font-medium">
            Imagen de la Categoría
          </Label>
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={isUploading}
            className="cursor-pointer"
          />
          {errors.image && (
            <p className="text-sm text-red-500">{errors.image.message}</p>
          )}
        </div>

        {(imageValue || previewUrl) && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Vista previa de la imagen:</Label>
            <div
              className="relative w-48 h-48 rounded-lg overflow-hidden border cursor-pointer group"
              onClick={() => document.getElementById('imageUpload')?.click()}
            >
              <Image
                src={previewUrl || imageValue || ''}
                alt="Category image preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <p className="text-white text-center text-sm font-medium">
                  Haz clic para cambiar la imagen
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <input type="hidden" {...register('image')} />

      <Button 
        type="submit" 
        className="w-full" 
        disabled={createCategoryMutation.isPending || isUploading}
      >
        {createCategoryMutation.isPending || isUploading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creando Categoría...
          </div>
        ) : (
          'Crear Categoría'
        )}
      </Button>
    </form>
  );
}

export default CreateCategoryForm