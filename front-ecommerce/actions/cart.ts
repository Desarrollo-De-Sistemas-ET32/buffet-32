"use server";

import { connectToDB } from "@/lib/mongodb";
import { checkSession } from "@/lib/session";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
mongoose.model('Product', Product.schema);
mongoose.model('Coupon', Coupon.schema);
mongoose.model('Cart', Cart.schema);

export async function getCart(userId: string) {
    try {
        await connectToDB();
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        return { success: true, data: JSON.parse(JSON.stringify(cart)) };
    } catch (error) {
        console.error('Error fetching cart:', error);
        return { success: false, error: 'Failed to fetch cart' };
    }
}
interface AddToCartInput {
    userId: string;
    productId: string;
    quantity: number;
}

export async function addToCart({ userId, productId, quantity }: AddToCartInput) {
    await connectToDB();
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        // TODO: ADD A MESSAGE TO THE USER THAT THE USER IS NOT LOGGED IN
        redirect('/register');
        return { success: false, error: "Invalid user or product ID" };
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return { success: false, error: "Quantity must be a positive integer" };
    }

    const session = await checkSession();
    if (!session.isAuthenticated || session.userId !== userId) {
        redirect('/register');
        return { success: false, error: "Unauthorized" };
    }

    const product = await Product.findById(productId);
    if (!product) {
        return { success: false, error: "Product not found" };
    }

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            if (product.stock < quantity) {
                return { success: false, error: "Product out of stock" };
            }

            cart = new Cart({
                user: userId,
                products: [{ product: productId, quantity }],
            });
        } else {
            const productIndex = cart.products.findIndex(
                (item: { product: string; }) => item.product.toString() === productId
            );

            if (productIndex >= 0) {
                const currentQuantity = cart.products[productIndex].quantity;
                const totalQuantity = currentQuantity + quantity;
                if (product.stock < totalQuantity) {
                    return { success: false, error: "Product out of stock" };
                }
                cart.products[productIndex].quantity = totalQuantity;
            } else {
                if (product.stock < quantity) {
                    return { success: false, error: "Product out of stock" };
                }
                cart.products.push({ product: productId, quantity });
            }
        }

        cart.updatedAt = new Date();
        await cart.save();

        const updatedCart = await Cart.findOne({ user: userId }).populate("products.product");
        return {
            success: true,
            data: JSON.parse(JSON.stringify(updatedCart)),
        };
    } catch (error) {
        console.error("Error adding to cart:", error);
        return { success: false, error: "Failed to add to cart" };
    }
}

export async function updateCartItemQuantity({ userId, productId, quantity }: AddToCartInput) {
    await connectToDB();
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return { success: false, error: "Invalid user or product ID" };
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return { success: false, error: "Quantity must be a positive integer" };
    }

    const session = await checkSession();
    if (!session.isAuthenticated || session.userId !== userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return { success: false, error: "Cart not found" };
        }

        const productIndex = cart.products.findIndex(
            (item: { product: string; }) => item.product.toString() === productId
        );

        if (productIndex >= 0) {
            cart.products[productIndex].quantity = quantity;
            cart.updatedAt = new Date();
            await cart.save();

            const updatedCart = await Cart.findOne({ user: userId }).populate("products.product");
            return {
                success: true,
                data: JSON.parse(JSON.stringify(updatedCart)),
            };
        } else {
            return { success: false, error: "Product not found in cart" };
        }
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        return { success: false, error: "Failed to update cart item quantity" };
    }
}

export async function removeFromCart({ userId, productId }: { userId: string; productId: string }) {
    await connectToDB();
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return { success: false, error: "Invalid user or product ID" };
    }

    const session = await checkSession();
    if (!session.isAuthenticated || session.userId !== userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return { success: false, error: "Cart not found" };
        }

        cart.products = cart.products.filter(
            (item: { product: string; }) => item.product.toString() !== productId
        );

        cart.updatedAt = new Date();
        await cart.save();

        const updatedCart = await Cart.findOne({ user: userId }).populate("products.product");
        return {
            success: true,
            data: JSON.parse(JSON.stringify(updatedCart)),
        };
    } catch (error) {
        console.error("Error removing from cart:", error);
        return { success: false, error: "Failed to remove from cart" };
    }
}

export async function applyCoupon(couponCode: string, userId: string, subtotal: number) {
    await connectToDB();
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
        return { success: false, error: "Invalid coupon code" };
    }
    if (coupon.maxUses <= coupon.usedBy.length) {
        return { success: false, error: "Coupon has reached the maximum number of uses" };
    }
    if (coupon.expiresAt < new Date()) {
        return { success: false, error: "Coupon has expired" };
    }
    if (coupon.usedBy.includes(userId)) {
        return { success: false, error: "Coupon has already been used" };
    }
    if (!coupon.active) {
        return { success: false, error: "Coupon is not active" };
    }

    let discountAmount: number;

    if (coupon.type === "percentage") {
        discountAmount = +(subtotal * (coupon.value / 100)).toFixed(2);
    } else if (coupon.type === "fixed") {
        discountAmount = coupon.value;
    } else {
        return { success: false, error: "Invalid coupon type" };
    }

    return {
        success: true,
        data: {
            discount: discountAmount,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value
            }
        }
    };
}   