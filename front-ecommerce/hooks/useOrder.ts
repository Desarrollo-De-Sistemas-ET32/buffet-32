'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchOrderByPaymentIdAction, fetchOrdersAction, updateOrderStatusAction } from '@/actions/order';
import { Order } from '@/types/order';
import { toast } from 'sonner';

const fetchOrderByPaymentId = async (paymentId: string): Promise<Order> => {
  const result = await fetchOrderByPaymentIdAction(paymentId);
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch products');
  }
  return result.data;
};

const fetchOrders = async (): Promise<Order[]> => {
  const result = await fetchOrdersAction();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch orders');
  }
  return result.data;
};

export const useOrders = (paymentId: string) => {
  return useQuery({
    queryKey: ['orders', paymentId],
    queryFn: () => fetchOrderByPaymentId(paymentId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateOrderStatus = (orderId: string, status: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateOrderStatusAction(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update order status');
    },
  });
};