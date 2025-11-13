"use server"

import { connectToDB } from "@/lib/mongodb";
import { createSession } from "@/lib/session";
import Order from "@/models/Order";
import StockAlert from "@/models/StockAlert";
import User from "@/models/User";
import Wishlist from "@/models/Wishlist";
import bcrypt from "bcrypt";


export async function getUserAction(userId: string) {
    try {
        await connectToDB();
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        return { success: true, data: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: 'Failed to fetch user' };
    }
}

export async function getUserWithOrdersAndWishlistCounts(userId: string) {
    try {
        await connectToDB();
        const user = await User.findById(userId);
        const wishlist = await Wishlist.find({ user: userId });
        const orders = await Order.find({ user: userId });
        
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        // Get counts
        const ordersCount = orders?.length || 0;
        const wishlistCount = wishlist && wishlist.length > 0 ? wishlist.reduce((total, wl) => total + (wl.products?.length || 0), 0) : 0;

        return { 
            success: true, 
            data: {
                user: JSON.parse(JSON.stringify(user)),
                ordersCount,
                wishlistCount
            }
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: 'Failed to fetch user' };
    }
}

export async function getUsersAction(startDate?: string, endDate?: string) {
    try {
        await connectToDB();
        
        const query: { createdAt?: { $gte?: Date; $lte?: Date } } = {};
        
        // Add date range filter if provided
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }
        
        const users = await User.find(query).sort({ createdAt: -1 });
        return { success: true, data: JSON.parse(JSON.stringify(users)) };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, error: 'Failed to fetch users' };
    }
}

export async function getUserProfileAction(userId: string) {
    try {
        await connectToDB();
        console.log(userId, 'userId');
        const user = await User.findById(userId).select('-password');
        // const userOrders = await Order.find({ user: userId }).populate('products.product');
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        return { success: true, data: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: `Failed to fetch user: ${error}` };
    }
}

export async function updateUserAction(userId: string, formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dni: string;
    course: string;
    division: string;
}) {
    try {
        await connectToDB();
        const user = await User.findByIdAndUpdate(userId, formData, { new: true });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        return { success: true, data: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, error: 'Failed to update user' };
    }
}

export async function registerCheckoutUserAction(formData: FormData) {
    try {
        await connectToDB();
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const phone = formData.get("phone") as string;
        const dni = formData.get("dni") as string;
        const course = formData.get("course") as string;
        const division = formData.get("division") as string;

        // Validate required fields
        if (!username || !email || !password) {
            return { success: false, error: 'All fields are required' };
        }

        // Check if user already exists by email
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            console.log("User with this email already exists");
            return { success: false, error: 'User with this email already exists' };
        }

        // Check if user already exists by username
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            console.log("Username is already taken");
            return { success: false, error: 'Username is already taken' };
        }

        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user with hashed password
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "user",
            firstName,
            lastName,
            phone,
            dni,
            course,
            division
        });

        // Create session with user role
        await createSession(user._id.toString(), user.role);

        return { success: true, data: JSON.parse(JSON.stringify(user)) };

    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, error: 'Failed to create user' };
    }
}

export const getUserOrdersAction = async (userId: string) => {
    try {
        await connectToDB();
        const userOrders = await Order.find({ user: userId })
            .populate('products.product')
            .populate('appliedCoupon')
            .sort({ createdAt: -1 });
        if (!userOrders) {
            return { success: false, error: 'User orders not found' };
        }
        return { success: true, data: JSON.parse(JSON.stringify(userOrders)) };
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return { success: false, error: 'Failed to fetch user orders' };
    }
}

export async function createStockAlertAction(productId: string, email: string) {
    try {
        await connectToDB();

        const existingStockAlert = await StockAlert.findOne({ email, product: productId });

        if (existingStockAlert) {
            if (existingStockAlert.notified) {
                await StockAlert.findByIdAndUpdate(existingStockAlert._id, { notified: false });
                return { success: true, data: JSON.parse(JSON.stringify(existingStockAlert)), message: 'Stock alert reactivated' };
            } else {
                return { success: false, error: 'Stock alert already exists for this product' };
            }
        }

        // Create new stock alert if none exists
        const stockAlert = await StockAlert.create({ product: productId, email });
        return { success: true, data: JSON.parse(JSON.stringify(stockAlert)) };
    } catch (error: unknown) {
        console.error('Error creating stock alert:', error);
        return { success: false, error: 'Failed to create stock alert' };
    }
}
