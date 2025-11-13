import { ProductOrder } from "./product";
import { Coupon } from "./coupon";

export interface Order {
    _id: string;
    paymentId?: string;
    paymentMethod: 'mercadopago' | 'cash';
    products: ProductOrder[];
    status: string;
    createdAt: string;
    shippingData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dni: string;
      course: string;
      division: string;
    };
    appliedCoupon?: Coupon | null;
  }
