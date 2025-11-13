'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCategoryAction, deleteCategoryAction, fetchCategoriesAction, updateCategoryAction } from '@/actions/category';
import { Category } from '@/types/product';

const fetchCategories = async (): Promise<Category[]> => {
  const result = await fetchCategoriesAction();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch categories');
  }
  return Array.isArray(result.data) ? result.data : [];
};

export const useCategories = () => {    
    return useQuery({
        queryKey: ['categories-products'],
        queryFn: fetchCategories,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCategoryAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories-products'] });
            toast.success('Category created successfully');
        },
        onError: () => {
            toast.error('Failed to create category');
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCategoryAction,
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
                queryClient.invalidateQueries({ queryKey: ['categories-products'] });
                toast.success('Category deleted successfully');
            } else {
                toast.error(data.error || 'Failed to delete category');
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete category');
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ categoryId, data }: { categoryId: string; data: { name: string; image?: string } }) => {
            const result = await updateCategoryAction(categoryId, data);
            if (!result.success) {
                throw new Error(result.error || 'Failed to update category');
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories-products'] });
            toast.success('Category updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update category');
        },
    });
};
