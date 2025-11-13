export interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  usedBy: string[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface CreateCouponData {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  expiresAt: string;
} 