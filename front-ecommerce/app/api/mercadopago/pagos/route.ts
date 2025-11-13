import { Payment } from 'mercadopago';
import { revalidatePath } from 'next/cache';
import { mercadopago } from '@/app/api';
import { connectToDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Cart from '@/models/Cart';

export async function POST(request: Request) {
  try {
    // Parse the webhook body
    const body: { data: { id: string } } = await request.json();
    console.log(body, 'body');
    // Fetch payment details
    const payment = await new Payment(mercadopago).get({ id: body.data.id });
    
    // Debug: Log the payment metadata to see what we're receiving
    console.log('[Webhook] Payment metadata:', payment.metadata);
    console.log('[Webhook] Payment additional_info:', payment.additional_info);

    // Debug: Log metadata and additional_info
    // console.log('[Webhook] payment.metadata:', payment.metadata);
    // console.log('[Webhook] payment.additional_info:', payment.additional_info);

    // Process only approved payments
    if (payment.status === 'approved') {
      await connectToDB();

      // Define the type for cart items
      type CartItem = { id: string; quantity: number };
      const cart = payment.metadata.cart as CartItem[] || [];

      // Fetch full product details for each cart item
      const productIds = cart.map((item) => item.id);
      const dbProducts = await Product.find({ _id: { $in: productIds } }).populate('category');
      // Attach quantity to each product
      const productsWithQuantity = dbProducts.map((product) => {
        const cartItem = cart.find((item) => item.id === product._id.toString());
        return {
          _id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          category: product.category,
          quantity: cartItem ? cartItem.quantity : 1,
        };
      });
      
      // Save order to MongoDB
      const products = cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));
      
      // Handle coupon usage if applied
      let couponId = null;
      const couponCode = payment.metadata.coupon_code || payment.metadata.couponCode;
      
      console.log('[Webhook] Coupon code from metadata:', couponCode);
      
      if (couponCode) {
        try {
          // Find the coupon in the database
          const Coupon = (await import('@/models/Coupon')).default;
          const coupon = await Coupon.findOne({ code: couponCode });
          
          if (coupon) {
            couponId = coupon._id;
            // Mark coupon as used by this user
            await Coupon.findOneAndUpdate(
              { code: couponCode },
              { $push: { usedBy: payment.metadata.user_id } }
            );
            console.log('[Webhook] Successfully marked coupon as used:', couponCode);
          } else {
            console.log('[Webhook] Coupon not found in database:', couponCode);
          }
        } catch (error) {
          console.error('[Webhook] Error handling coupon:', error);
        }
      }
      
      await Cart.findOneAndUpdate({ user: payment.metadata.user_id }, { $set: { products: [] } });
      
      // Update stock of all products in the order
      console.log('[Webhook] Updating stock for products:', cart);
      for (const cartItem of cart) {
        try {
          const result = await Product.findByIdAndUpdate(
            cartItem.id,
            { $inc: { stock: -cartItem.quantity } },
            { new: true }
          );
          console.log(`[Webhook] Updated stock for product ${cartItem.id}: ${result?.stock} (decreased by ${cartItem.quantity})`);
        } catch (error) {
          console.error(`[Webhook] Error updating stock for product ${cartItem.id}:`, error);
        }
      }
      
      await Order.create({
        products,
        paymentId: payment.id,
        paymentMethod: 'mercadopago',
        status: payment.status,
        shippingData: {
          firstName: payment.metadata.shipping_data.first_name,
          lastName: payment.metadata.shipping_data.last_name,
          email: payment.metadata.shipping_data.email,
          phone: payment.metadata.shipping_data.phone,
          dni: payment.metadata.shipping_data.dni,
          course: payment.metadata.shipping_data.course,
          division: payment.metadata.shipping_data.division,
        },
        user: payment.metadata.user_id,
        appliedCoupon: couponId || null,
      });

      try {
        // Use absolute URL for server-side fetch
        // Set NEXT_PUBLIC_BASE_URL in your .env.local (e.g., http://localhost:3000)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const emailResponse = await fetch(`${baseUrl}/api/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: payment.metadata.shipping_data.email,
            subject: 'Your Order Confirmation',
            react: {
              component: 'CheckoutTemplate',
              props: {
                products: productsWithQuantity,
                paymentId: payment.id,
                checkoutLink: `https://www.snackly.site/profile`,
              },
            },
          }),
        });

        if (!emailResponse.ok) {
          console.error('[Webhook] Failed to send email:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('[Webhook] Email sending error:', emailError);
      }

      // Revalidate homepage
      revalidatePath('/');
    }

    // Always return 200 to acknowledge webhook
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    // Return 200 to prevent MercadoPago retries
    return new Response(null, { status: 200 });
  }
}
