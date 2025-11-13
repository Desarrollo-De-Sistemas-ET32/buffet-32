import { NextRequest, NextResponse } from "next/server";
import { checkoutWithMercadoPago } from "@/actions/checkout";

export async function POST(req: NextRequest) {
  const { cartItems, shippingData, user_id, appliedCoupon } = await req.json();
  console.log(user_id, 'userIdendpoint');
  console.log(appliedCoupon, 'appliedCoupon');
  const url = await checkoutWithMercadoPago(cartItems, shippingData, user_id, appliedCoupon);
  return NextResponse.json({ url });
} 