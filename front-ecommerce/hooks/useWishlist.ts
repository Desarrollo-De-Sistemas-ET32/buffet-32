'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToWishlistAction, getWishlistAction } from '@/actions/wishlist';
import { Product } from '@/types/product';
import { toast } from 'sonner';

// Type for the wishlist item structure
interface WishlistItem {
  _id: string;
  user: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export const useWishlist = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading, error } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: () => getWishlistAction(userId!),
    enabled: !!userId,
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return await addToWishlistAction(userId, productId);
    },
    onSuccess: (result, productId) => {
      if (result.success) {
        // Invalidate queries to update UI
        queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });
        queryClient.invalidateQueries({ queryKey: ['productsBySearch'] });
        queryClient.invalidateQueries({ queryKey: ['relatedProducts'] });
        
        // Show success toast
        const isCurrentlyWishlisted = wishlist?.data?.some((item: WishlistItem) => 
          item.products?.some((p: Product) => p._id === productId)
        ) || false;
        
        toast.success(isCurrentlyWishlisted 
          ? 'Product removed from wishlist' 
          : 'Product added to wishlist'
        );
      } else {
        toast.error(result.error || 'Failed to update wishlist');
      }
    },
    onError: (error) => {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    },
  });

  const toggleWishlist = (productId: string) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }
    toggleWishlistMutation.mutate(productId);
  };

  const isProductWishlisted = (productId: string): boolean => {
    if (!wishlist?.success || !wishlist.data) return false;
    return wishlist.data.some((item: WishlistItem) => item.products?.some((p: Product) => p._id === productId));
  };

  return {
    wishlist: wishlist?.data || [],
    isLoading,
    error,
    toggleWishlist,
    isProductWishlisted,
    isWishlistActionPending: toggleWishlistMutation.isPending,
  };
};
