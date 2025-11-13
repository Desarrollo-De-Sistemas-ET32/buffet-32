import { getCart, addToCart, updateCartItemQuantity, removeFromCart, applyCoupon } from "@/actions/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { useState } from "react";

export const useCartTanstack = () => {
    const { userId } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['cart', userId],
        queryFn: () => getCart(userId as string),
        enabled: !!userId,
    });
    return { data, isLoading, error };
}

export const useAddToCartTanstack = (quantity: number) => {
    const { userId } = useAuth();
    const queryClient = useQueryClient();
    
    const { mutate: addToCartMutation, isPending } = useMutation({
        mutationFn: (productId: string) => addToCart({ userId: userId as string, productId, quantity: quantity || 1 }),
        onSuccess: (result) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ['cart', userId] });
                toast.success('Product added to cart');
            } else {
                toast.error(result.error || 'Failed to add to cart');
            }
        },
        onError: () => {
            toast.error('Failed to add to cart');
        }
    });
    return { addToCartMutation, isPending };
}

export const useUpdateCartItemQuantity = () => {
    const { userId } = useAuth();
    const queryClient = useQueryClient();
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
    
    const { mutate: updateQuantityMutation } = useMutation({
        mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => 
            updateCartItemQuantity({ userId: userId as string, productId, quantity }),
        onMutate: ({ productId }) => {
            setUpdatingItems(prev => new Set(prev).add(productId));
        },
        onSuccess: (result) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ['cart', userId] });
            } else {
                toast.error(result.error || 'Failed to update quantity');
            }
        },
        onError: () => {
            toast.error('Failed to update quantity');
        },
        onSettled: (_, __, { productId }) => {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    });

    const isUpdatingItem = (productId: string) => updatingItems.has(productId);
    
    return { updateQuantityMutation, isUpdatingItem };
}

export const useRemoveFromCart = () => {
    const { userId } = useAuth();
    const queryClient = useQueryClient();
    const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
    
    const { mutate: removeFromCartMutation } = useMutation({
        mutationFn: (productId: string) => removeFromCart({ userId: userId as string, productId }),
        onMutate: (productId) => {
            setRemovingItems(prev => new Set(prev).add(productId));
        },
        onSuccess: (result) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ['cart', userId] });
                toast.success('Product removed from cart');
            } else {
                toast.error(result.error || 'Failed to remove from cart');
            }
        },
        onError: () => {
            toast.error('Failed to remove from cart');
        },
        onSettled: (_, __, productId) => {
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    });

    const isRemovingItem = (productId: string) => removingItems.has(productId);
    
    return { removeFromCartMutation, isRemovingItem };
}

export const useApplyCoupon = (onSuccess?: (result: { success: boolean; data?: { coupon: { code: string }; discount: number }; error?: string }) => void) => {
    const { userId } = useAuth();
    const queryClient = useQueryClient();
    const { mutate: applyCouponMutation } = useMutation({
        mutationFn: ({ couponCode, subtotal }: { couponCode: string; subtotal: number }) => 
            applyCoupon(couponCode, userId as string, subtotal),
        onSuccess: (result) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ['cart', userId] });
                toast.success('Coupon applied successfully');
                if (onSuccess) {
                    onSuccess(result);
                }
            } else {
                toast.error(result.error || 'Failed to apply coupon');
            }
        },
        onError: () => {
            toast.error('Failed to apply coupon');
        }
    });
    return { applyCouponMutation };
}