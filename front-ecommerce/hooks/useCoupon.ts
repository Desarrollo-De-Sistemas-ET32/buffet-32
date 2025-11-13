
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoupons, createCouponAction } from '@/actions/coupon';
import { toast } from 'sonner';
import { CreateCouponData } from '@/types/coupon';

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: getCoupons,
  });
}

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCouponData) => {
      const result = await createCouponAction(data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create coupon');
      }
      return result.data;
    },
    onSuccess: () => {
      console.log("Success created coupon");
      toast.success('Coupon created successfully');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error: Error) => {
      console.log("Error:", error.message);
      toast.error(error.message || 'Failed to create coupon');
    },
  });
};