"use server";
import Wishlist from "@/models/Wishlist";
import { connectToDB } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function getWishlistAction(userId: string) {
    try {
        await connectToDB();
        const wishlist = await Wishlist.find({ user: userId })
            .populate({
                path: 'products',
                populate: {
                    path: 'category'
                }
            })
            .sort({ createdAt: -1 });
        return { success: true, data: JSON.parse(JSON.stringify(wishlist)) };
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return { success: false, error: 'Failed to fetch wishlist' };
    }       
}

export async function addToWishlistAction(userId: string, productId: string) {
    try {
        await connectToDB();
        
        let wishlist = await Wishlist.findOne({ user: userId });
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [productId] });
        } else {
            const productIndex = wishlist.products.indexOf(productId);
            
            if (productIndex > -1) {
                wishlist.products.splice(productIndex, 1);
                await wishlist.save();
            } else {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }
        return { success: true, data: JSON.parse(JSON.stringify(wishlist)) };
    } catch (error) {
        console.error('Error updating wishlist:', error);
        return { success: false, error: 'Failed to update wishlist' };
    }
}