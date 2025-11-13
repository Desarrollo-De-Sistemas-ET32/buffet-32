import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, updateCartItemQuantity, removeFromCart } from '@/actions/cart';

// Hardcoded userId for React Native use
const HARDCODED_USER_ID = '688c2129d5b09d03db281bf9';

export async function GET() {
    try {
        const result = await getCart(HARDCODED_USER_ID);

        if (result.success) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { productId, quantity } = await request.json();

        if (!productId || !quantity) {
            return NextResponse.json(
                { success: false, error: 'Product ID and quantity are required' },
                { status: 400 }
            );
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return NextResponse.json(
                { success: false, error: 'Quantity must be a positive integer' },
                { status: 400 }
            );
        }

        const result = await addToCart({
            userId: HARDCODED_USER_ID,
            productId,
            quantity
        });

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to add to cart' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { productId, quantity } = await request.json();

        if (!productId || !quantity) {
            return NextResponse.json(
                { success: false, error: 'Product ID and quantity are required' },
                { status: 400 }
            );
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return NextResponse.json(
                { success: false, error: 'Quantity must be a positive integer' },
                { status: 400 }
            );
        }

        const result = await updateCartItemQuantity({
            userId: HARDCODED_USER_ID,
            productId,
            quantity
        });

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update cart item quantity' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const result = await removeFromCart({
            userId: HARDCODED_USER_ID,
            productId
        });

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to remove from cart' },
            { status: 500 }
        );
    }
}