import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Cart from '@/models/Cart';
import Coupon from '@/models/Coupon';

type CartItemPayload = {
  product: {
    _id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    discount: number;
  };
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const { cartItems, shippingData, user_id, appliedCoupon } = await req.json();
    const items: CartItemPayload[] = cartItems || [];

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'Usuario no autenticado' }, { status: 401 });
    }

    if (!items.length) {
      return NextResponse.json({ success: false, error: 'El carrito está vacío' }, { status: 400 });
    }

    await connectToDB();

    const productIds = items.map((item) => item.product._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    const insufficientStockItem = items.find((item) => {
      const product = dbProducts.find((dbProduct) => dbProduct._id.toString() === item.product._id);
      return !product || product.stock < item.quantity;
    });

    if (insufficientStockItem) {
      return NextResponse.json({
        success: false,
        error: `Stock insuficiente para ${insufficientStockItem.product.name}`,
      }, { status: 400 });
    }

    let couponId = null;
    if (appliedCoupon?.code) {
      const coupon = await Coupon.findOne({ code: appliedCoupon.code });
      if (coupon) {
        couponId = coupon._id;
        await Coupon.findOneAndUpdate(
          { code: appliedCoupon.code },
          { $push: { usedBy: user_id } }
        );
      }
    }

    const products = items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      products,
      paymentMethod: 'cash',
      status: 'pending',
      shippingData: {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        dni: shippingData.dni,
        course: shippingData.course,
        division: shippingData.division,
      },
      user: user_id,
      appliedCoupon: couponId,
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    await Cart.findOneAndUpdate({ user: user_id }, { $set: { products: [] } });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: shippingData.email,
          subject: 'Confirmación de pedido',
          react: {
            component: 'CheckoutTemplate',
            props: {
              products: items.map((item) => ({
                ...item.product,
                quantity: item.quantity,
              })),
              paymentId: order._id.toString(),
              checkoutLink: 'https://www.snackly.site/profile',
            },
          },
        }),
      });
    } catch (emailError) {
      console.error('[Cash Order] Error sending email:', emailError);
    }

    return NextResponse.json({ success: true, orderId: order._id.toString() });
  } catch (error) {
    console.error('[Cash Order] Error:', error);
    return NextResponse.json({ success: false, error: 'No se pudo crear el pedido' }, { status: 500 });
  }
}
