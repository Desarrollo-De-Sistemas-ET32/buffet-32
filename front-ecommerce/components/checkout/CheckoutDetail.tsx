"use client"
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import CartCheckoutSummary from './CartCheckoutSummary';
import { useAuth } from '@/context/auth-context';
import { useCartTanstack } from '@/hooks/useCartTanstack';
import { useUser } from '@/hooks/useUser';
import { checkStock } from '@/actions/stock';
import { Product } from '@/types/product';

interface CartItem {
    product: Product;
    quantity: number;
}

const CheckoutDetailComponent = () => {
    const { userId } = useAuth();
    const { data: cartResponse, isLoading: isLoadingCart, error: cartError } = useCartTanstack();
    const { data: user, isLoading: isLoadingUser, error: userError } = useUser();
    const items = cartResponse?.data?.products || [];
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'cash'>('mercadopago');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);


    const handlePayment = async (formData: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        dni: string;
        course: string;
        division: string;
    }) => {
        setLoading(true);
        try {
            // Check stock for all cart items before proceeding
            const stockChecks = await Promise.all(
                items.map(async (item: CartItem) => {
                    const stockCheck = await checkStock(item.product._id, item.quantity);
                    return {
                        ...stockCheck,
                        productName: item.product.name
                    };
                })
            );

            // Check if any item has insufficient stock
            const insufficientStock = stockChecks.find(check => !check.success);
            if (insufficientStock) {
                toast.error(`Stock insuficiente para ${insufficientStock.productName}`);
                setLoading(false);
                return;
            }

            if (paymentMethod === 'cash') {
                const response = await fetch('/api/orders/cash', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cartItems: items,
                        shippingData: formData,
                        user_id: userId,
                        appliedCoupon,
                    }),
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'No se pudo registrar el pedido');
                }

                toast.success('Pedido registrado. Te contactaremos para coordinar el pago.');
                router.push('/profile');
                return;
            }

            // All items have sufficient stock, proceed with Mercado Pago payment
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    cartItems: items, 
                    shippingData: formData, 
                    user_id: userId,
                    appliedCoupon 
                }),
            });
            const { url } = await response.json();
            window.location.href = url;
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'El pago falló');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (items.length === 0) {
    //         toast.error('Your cart is empty');
    //         router.push('/');
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [items]);

    if (isLoadingCart || isLoadingUser) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Cargando checkout...</span>
            </div>
        );
    }

    if (cartError || userError) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-destructive">Error al cargar los datos de pago</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto px-2 lg:px-0">
            <CartCheckoutSummary 
                items={items} 
                onCouponChange={setAppliedCoupon}
            />
            <CheckoutForm 
                user={user?.data || null} 
                onPayment={handlePayment} 
                itemsLength={items.length} 
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                isSubmitting={loading}
            />
        </div>
    );
};

export default CheckoutDetailComponent;
