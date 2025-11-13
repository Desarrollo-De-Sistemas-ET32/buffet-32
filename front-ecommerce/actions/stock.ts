"use server"

import Product from "@/models/Product"

export async function checkStock(productId: string, quantity: number) {
    const product = await Product.findById(productId);
    if (!product) {
        return { success: false, error: 'Product not found' };
    }
    if (product.stock < quantity) {
        return { success: false, error: `Insufficient stock for ${product.name}` };
    }
    return { success: true };
}