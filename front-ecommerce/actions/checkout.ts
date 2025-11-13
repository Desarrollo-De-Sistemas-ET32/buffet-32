"use server";
import api from "@/app/api";

export async function checkoutWithMercadoPago(cartItems: { product: { _id: string; name: string; price: number; description: string; images: string[]; discount: number; }, quantity: number }[], shippingData: { firstName: string; lastName: string; email: string; phone: string; dni: string; course: string; division: string }, user_id: string, appliedCoupon?: { code: string; discount: number } | null) {
  const url = await api.cart.submit(cartItems, shippingData, user_id, appliedCoupon);
  return url;
}   
