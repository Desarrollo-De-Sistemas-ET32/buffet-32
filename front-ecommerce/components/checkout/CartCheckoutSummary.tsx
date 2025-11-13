"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useApplyCoupon } from '@/hooks/useCartTanstack';

interface CartItem {
  product: {
    _id: string;
    images: string[];
    name: string;
    price: number;
    discount: number;
    stock: number;
  };
  quantity: number;
}

interface CartCheckoutSummaryProps {
  items: CartItem[];
  onRemoveItem?: (productId: string) => void;
  onCouponChange?: (coupon: { code: string; discount: number } | null) => void;
}

const CartCheckoutSummary = ({ items, onRemoveItem, onCouponChange }: CartCheckoutSummaryProps) => {
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    
    // Helper function to calculate discounted price
    const getDiscountedPrice = (price: number, discount: number) => {
        return price * (1 - discount / 100);
    };

    const handleCouponSuccess = (result: { success: boolean; data?: { coupon: { code: string }; discount: number } }) => {
        if (result.success && result.data) {
            const couponData = {
                code: result.data.coupon.code,
                discount: result.data.discount
            };
            setAppliedCoupon(couponData);
            onCouponChange?.(couponData);
            setShowCouponInput(false);
            setCouponCode('');
        }
    };
    
    const { applyCouponMutation } = useApplyCoupon(handleCouponSuccess);
    
    // Calculate subtotal with product discounts
    const subtotal = items.reduce((sum: number, item: CartItem) => {
        const originalPrice = item.product.price;
        const discountPercentage = item.product.discount || 0;
        const discountedPrice = getDiscountedPrice(originalPrice, discountPercentage);
        return sum + (discountedPrice * item.quantity);
    }, 0);
    
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    const grandTotal = +(subtotal - couponDiscount).toFixed(2);

    const handleApplyCoupon = () => {
        if (couponCode.trim()) {
            applyCouponMutation({ couponCode: couponCode.trim(), subtotal });
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        onCouponChange?.(null);
    };

    return (
        <>
            <h3 className='text-3xl flex md:hidden font-bold'>Resumen del pedido</h3>
            <Card className="flex-1 min-w-[320px] max-w-lg">
                <CardHeader>
                    <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        {items.length === 0 ? (
                            <div className="text-muted-foreground">Tu carrito está vacío.</div>
                        ) : (
                            <ul className="divide-y">
                                {items.map((item: CartItem) => {
                                    const originalPrice = item.product.price;
                                    const discountPercentage = item.product.discount || 0;
                                    const discountedPrice = getDiscountedPrice(originalPrice, discountPercentage);
                                    const hasDiscount = discountPercentage > 0;
                                    
                                    return (
                                        <li key={item.product._id} className="flex items-center py-3 gap-3">
                                            <div className="w-14 h-14 flex-shrink-0 rounded bg-muted overflow-hidden">
                                                <Image src={item.product.images[0]} alt={item.product.name} width={256} height={256} className="object-cover w-full h-full" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium leading-tight truncate">{item.product.name} {item.product.stock === 0 && <span className="text-xs ml-2 text-red-500">Sin stock</span>}</div>
                                                {hasDiscount && (
                                                    <div className="text-xs text-green-600 font-medium">
                                                        {discountPercentage}% DTO
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end min-w-[80px]">
                                                <div className="flex flex-col items-end">
                                                    {hasDiscount ? (
                                                        <>
                                                            <span className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                                                            <span className="font-bold text-sm text-green-600">${discountedPrice.toFixed(2)}</span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-sm">${originalPrice.toFixed(2)}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                </div>
                                            </div>
                                            {onRemoveItem && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    aria-label="Remove item" 
                                                    onClick={() => onRemoveItem(item.product._id)}
                                                >
                                                    ×
                                                </Button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        <div className="border-t pt-4 mt-4">
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-green-600 font-medium">
                                            Cupón aplicado: {appliedCoupon.code}
                                        </span>
                                        <span className="text-sm text-green-600">
                                            -${appliedCoupon.discount.toFixed(2)}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveCoupon}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Quitar
                                    </Button>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    {!showCouponInput ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowCouponInput(true)}
                                            className="w-full"
                                        >
                                            ¿Tienes un cupón?
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label htmlFor="coupon-code" className="text-sm font-medium">
                                                Código de cupón
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="coupon-code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    placeholder="Ingresa tu código"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={handleApplyCoupon}
                                                    disabled={!couponCode.trim()}
                                                >
                                                    Aplicar
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setShowCouponInput(false);
                                                    setCouponCode('');
                                                }}
                                                className="w-full"
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Totals */}
                        <div className="border-t pt-4 flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Descuento cupón</span>
                                    <span>-${appliedCoupon.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-bold mt-2">
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default CartCheckoutSummary;
