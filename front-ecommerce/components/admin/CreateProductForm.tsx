'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProduct } from '@/hooks/useProducts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategory';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon, Plus, X, Eye } from 'lucide-react';
import { ReactSortable } from 'react-sortablejs';
import ProductPreviewCard from './ProductPreviewCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0').max(999999.99, 'Price must be less than $1,000,000'),
  category: z.string().min(1, 'Category is required'),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  stock: z.number().min(0, 'Stock cannot be negative').max(999999, 'Stock must be less than 1,000,000'),
  discount: z.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%'),
  images: z.array(z.string()).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
});

type ProductFormData = z.infer<typeof productSchema>;

type CreateProductFormProps = {
  onCreated?: () => void;
};

export default function CreateProductForm({ onCreated }: CreateProductFormProps) {
  const createProductMutation = useCreateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ id: string; url: string }[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      images: [],
    },
  });

  const isActiveValue = watch('isActive');
  const isFeaturedValue = watch('isFeatured');
  const imagesValue = watch('images');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check total image count limit
    const totalImages = previewUrls.length + files.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed. Please remove some images first.');
      return;
    }

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select valid image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
    }

    // Create preview URLs with unique IDs for SortableJS
    const newPreviewUrls = files.map((file, index) => ({
      id: `${Date.now()}-${index}`, // Unique ID for each image
      url: URL.createObjectURL(file),
    }));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    
    // Update form validation for images
    const updatedImages = [...previewUrls, ...newPreviewUrls].map(preview => preview.url);
    setValue('images', updatedImages, { shouldValidate: true });
  };

  const uploadImageToS3 = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return result.url;
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsUploading(true);

      let finalImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        // Upload images in the order of previewUrls
        const orderedFiles = previewUrls.map((preview) =>
          selectedFiles.find((file, index) => URL.createObjectURL(file) === preview.url || index === previewUrls.indexOf(preview))
        ).filter((file): file is File => !!file);

        finalImageUrls = await Promise.all(orderedFiles.map((file) => uploadImageToS3(file)));
      }

      const updatedData = {
        ...data,
        images: finalImageUrls,
      };

      await createProductMutation.mutateAsync(updatedData);

      // Clean up preview URLs
      previewUrls.forEach((preview) => URL.revokeObjectURL(preview.url));
      setPreviewUrls([]);
      setSelectedFiles([]);

      reset();
      if (onCreated) onCreated();
    } catch (error) {
      toast.error('Failed to create product');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag-and-drop reordering
  const handleSort = (newList: { id: string; url: string }[]) => {
    setPreviewUrls(newList);
    // Reorder selectedFiles to match previewUrls
    const newFiles = newList
      .map((preview) =>
        selectedFiles.find((file, index) => URL.createObjectURL(file) === preview.url || index === previewUrls.indexOf(preview))
      )
      .filter((file): file is File => !!file);
    setSelectedFiles(newFiles);
  };

  return (
    <div className="overflow-y-auto">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create Product</h2>
              <p className="text-sm text-muted-foreground">
                Add a new product to your inventory
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview Product
          </Button>
        </div>
      </div>

      <div className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Product Name
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter product name"
                  className={`h-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                {categoriesLoading ? (
                  <Skeleton className="h-10" />
                ) : categories && categories.length > 0 ? (
                  <Select
                    value={undefined}
                    onValueChange={(value) => {
                      setValue('category', value, { shouldValidate: true });
                    }}
                    disabled={!categories}
                  >
                    <SelectTrigger className="h-10 w-full" id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(categories) && categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-10 flex items-center text-sm text-muted-foreground">
                    No categories found
                  </div>
                )}
                {errors.category && (
                  <p className="text-xs text-red-500">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter product description"
                className={`min-h-[80px] resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Pricing & Inventory Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    $
                  </span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="0.00"
                    className={`h-10 pl-8 ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  step="1"
                  {...register('stock', { valueAsNumber: true })}
                  placeholder="0"
                  className={`h-10 ${errors.stock ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.stock && (
                  <p className="text-xs text-red-500">{errors.stock.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount" className="text-sm font-medium">
                  Discount (%)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  step="1"
                  {...register('discount', { valueAsNumber: true })}
                  placeholder="0"
                  className={`h-10 ${errors.discount ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.discount && (
                  <p className="text-xs text-red-500">{errors.discount.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Product Images
            </h3>

            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <div
                  className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200 cursor-pointer group bg-muted/20 flex-shrink-0"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                                     <div className="flex flex-col items-center justify-center h-full text-muted-foreground group-hover:text-primary transition-colors duration-200">
                     <div className="p-3 bg-muted/50 rounded-full mb-3 group-hover:bg-primary/10 transition-colors duration-200">
                       <ImageIcon className="w-8 h-8" />
                     </div>
                     <p className="text-sm font-medium mb-1">Click to upload images</p>
                     <p className="text-sm font-medium mb-1">
                       {previewUrls.length}/5 images
                     </p>
                     <p className="text-xs text-muted-foreground/70">JPG, PNG, GIF up to 5MB</p>
                   </div>
                </div>

                {previewUrls.length > 0 && (
                  <ReactSortable
                    list={previewUrls}
                    setList={handleSort}
                    className="flex gap-2 overflow-x-auto pb-2 flex-1"
                    animation={150}
                    ghostClass="sortable-ghost"
                    handle=".drag-handle"
                  >
                    {previewUrls.map((preview, index) => (
                      <div
                        key={preview.id}
                        className="relative flex-shrink-0 w-32 h-32 sortable-item"
                      >
                        <Image
                          src={preview.url}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="drag-handle absolute inset-0 cursor-drag" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-5 w-5 p-0 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newUrls = previewUrls.filter((_, i) => i !== index);
                            const newFiles = selectedFiles.filter((_, i) => i !== index);
                            setPreviewUrls(newUrls);
                            setSelectedFiles(newFiles);
                            
                            // Update form validation for images
                            setValue('images', newUrls.map(preview => preview.url), { shouldValidate: true });
                          }}
                        >
                          <X className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    ))}
                  </ReactSortable>
                )}
              </div>

              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                multiple
                max={5}
                onChange={handleImageSelect}
                disabled={isUploading}
                className="hidden"
              />

              {errors.images && (
                <p className="text-xs text-red-500">{errors.images.message}</p>
              )}
            </div>
          </div>

          {/* Status & Submit Section */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id="isActive"
                  checked={isActiveValue}
                  onCheckedChange={(checked) => {
                    setValue('isActive', checked as boolean, { shouldValidate: true });
                  }}
                />
                <div>
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Active Product
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Make this product visible to customers
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id="isFeatured"
                  checked={isFeaturedValue}
                  onCheckedChange={(checked) => {
                    setValue('isFeatured', checked as boolean, { shouldValidate: true });
                  }}
                />
                <div>
                  <Label htmlFor="isFeatured" className="text-sm font-medium">
                    Featured Product
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Show this product in the featured section
                  </p>
                </div>
              </div>
            </div>

            {errors.isActive && (
              <p className="text-xs text-red-500">{errors.isActive.message}</p>
            )}

            {errors.isFeatured && (
              <p className="text-xs text-red-500">{errors.isFeatured.message}</p>
            )}

            <Button
              type="submit"
              className="w-full font-medium"
              disabled={createProductMutation.isPending || isUploading}
            >
              {createProductMutation.isPending || isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Product...
                </div>
              ) : (
                'Create Product'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Product Preview
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <ProductPreviewCard
              name={watch('name') || ''}
              description={watch('description') || ''}
              price={watch('price') || 0}
              discount={watch('discount') || 0}
              stock={watch('stock') || 0}
              images={previewUrls.map(preview => preview.url)}
              category={watch('category') || ''}
              isActive={watch('isActive') || false}
              isFeatured={watch('isFeatured') || false}
              categories={categories || []}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}