'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { fetchProductsAction, createProductAction, fetchProductsActionBySearch, fetchProductByIdAction, fetchRelatedProductsAction } from '../actions/products';
import { toast } from 'sonner';
import { useQueryState } from 'nuqs';
import type { Product, ProductsActionResult, ProductsSearchActionResult } from '@/types/product';

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  discount: number;
  images?: string[];
}

const fetchProducts = async (page: number = 1, limit: number = 10, searchName?: string, userId?: string): Promise<{ data: Product[]; pagination?: { currentPage: number; totalPages: number; totalCount: number; hasNextPage: boolean; hasPrevPage: boolean } }> => {
  const result = await fetchProductsAction(page, limit, searchName, userId) as ProductsActionResult;
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch products');
  }
  if (!result.data) {
    throw new Error('No data received from server');
  }
  return {
    data: result.data,
    pagination: result.pagination
  };
};

const fetchProductsBySearch = async (searchQuery: string, category: string, priceOrder: string, withDiscount: boolean, featured: boolean, skip: number = 0, limit: number = 8, userId?: string): Promise<{ products: Product[], hasMore: boolean }> => {
  const result = await fetchProductsActionBySearch(searchQuery, category, priceOrder, withDiscount, featured, skip, limit, userId) as ProductsSearchActionResult;
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch products');
  }
  if (!result.data) {
    throw new Error('No data received from server');
  }
  return { products: result.data, hasMore: result.hasMore || false };
};

export const useProductsBySearch = (userId?: string) => {
  const [searchQuery] = useQueryState('q', { defaultValue: '' });
  const [category] = useQueryState('category', { defaultValue: 'all' });
  const [priceOrder] = useQueryState('priceOrder', { defaultValue: 'default' });
  const [withDiscount] = useQueryState('withDiscount', { defaultValue: false, parse: (value) => value === 'true' });
  const [featured] = useQueryState('featured', { defaultValue: false, parse: (value) => value === 'true' });
  return useInfiniteQuery({
    queryKey: ['productsBySearch', searchQuery, category, priceOrder, withDiscount, featured, userId],
    queryFn: ({ pageParam = 0 }) => fetchProductsBySearch(searchQuery, category, priceOrder, withDiscount, featured, pageParam, 8, userId),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.flatMap(page => page.products).length;
      }
      return undefined;
    },
    initialPageParam: 0,
    refetchOnWindowFocus: true
  });
};

export const useProducts = (page: number = 1, limit: number = 10, searchName?: string, userId?: string) => {
  return useQuery({
    queryKey: ['products', page, limit, searchName, userId],
    queryFn: () => fetchProducts(page, limit, searchName, userId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductByIdAction(id),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      const result = await createProductAction(data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create product');
      }
      return result.data;
    },
    onSuccess: () => {
      console.log("Success created product");
      toast.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
    onError: (error: Error) => {
      console.log("Error:", error.message);
      toast.error('Failed to create product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const result = await import('../actions/products').then(m => m.deleteProductAction(productId));
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete product');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Product deleted successfully');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: CreateProductData }) => {
      const result = await import('../actions/products').then(m => m.updateProductAction(productId, data));
      if (!result.success) {
        throw new Error(result.error || 'Failed to update product');
      }
      return { data: result.data, shouldSendStockAlerts: result.shouldSendStockAlerts, productId };
    },
    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      toast.success('Product updated successfully');

      // Send stock alert emails in the background if needed
      if (result.shouldSendStockAlerts) {
        // Use setTimeout to ensure this runs after the UI updates
        setTimeout(async () => {
          try {
            const emailResult = await import('../actions/products').then(m => m.sendStockAlertEmailsAction(result.productId));
            if (emailResult.success) {
              console.log('Stock alert emails sent:', emailResult.message);
            } else {
              console.error('Failed to send stock alert emails:', emailResult.error);
              toast.error('Product updated but failed to send stock alerts');
            }
          } catch (error) {
            console.error('Error sending stock alert emails:', error);
            toast.error('Product updated but failed to send stock alerts');
          }
        }, 0);
      }
    },
  });
};

export const useRelatedProducts = (categoryId: string, excludeProductId?: string, userId?: string) => {
  return useQuery({
    queryKey: ['relatedProducts', categoryId, excludeProductId, userId],
    queryFn: () => fetchRelatedProductsAction(categoryId, excludeProductId, userId),
  });
};