'use server';

import { connectToDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import mongoose from 'mongoose';
mongoose.model('Order', Order.schema);
mongoose.model('Coupon', Coupon.schema);
mongoose.model('Product', Product.schema);
export async function fetchOrderByPaymentIdAction(paymentId: string) {
  try {
    await connectToDB();
    const order = await Order.findOne({ paymentId })
      .populate('products.product')
      .populate('appliedCoupon');
    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

export async function fetchOrdersAction() {
  try {
    await connectToDB();
    const orders = await Order.find()
      .populate('products.product')
      .populate('appliedCoupon');
    return { success: true, data: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    await connectToDB();
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}