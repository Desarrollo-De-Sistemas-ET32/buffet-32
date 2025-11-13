"use server";

import Coupon from "@/models/Coupon";
import { connectToDB } from "@/lib/mongodb";
import { CreateCouponData } from "@/types/coupon";

export async function getCoupons() {
    try {
        await connectToDB();
        const coupons = await Coupon.find();
        return { success: true, data: JSON.parse(JSON.stringify(coupons)) };
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return { success: false, error: 'Failed to fetch coupons' };
    }
}

export async function createCouponAction(formData: CreateCouponData) {
    try {
        await connectToDB();

        const existingCoupon = await Coupon.findOne({ code: formData.code.toUpperCase() });
        if (existingCoupon) {
            return { success: false, error: 'Coupon code already exists' };
        }

        const coupon = new Coupon({
            code: formData.code.toUpperCase(),
            description: formData.description,
            type: formData.type,
            value: formData.value,
            maxUses: formData.maxUses,
            expiresAt: new Date(formData.expiresAt),
            active: true,
        });

        await coupon.save();

        return { success: true, data: JSON.parse(JSON.stringify(coupon)) };
    } catch (error) {
        console.error('Error creating coupon:', error);
        return { success: false, error: 'Failed to create coupon' };
    }
}