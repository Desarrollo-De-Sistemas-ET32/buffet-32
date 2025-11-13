import React from 'react'
import { Order } from '@/types/order'
import { ProductOrder } from '@/types/product'
import { useAuth } from '@/context/auth-context'
import { useQuery } from '@tanstack/react-query'
import { getUserOrdersAction } from '@/actions/user'
import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Image from 'next/image'

const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    pending_shipping: "Pending Shipping",
    delivered: "Delivered",
    cancelled: "Cancelled",
    shipping: "Shipping",
    rejected: "Rejected",
}

const paymentMethodLabels = {
    mercadopago: 'Mercado Pago',
    cash: 'Efectivo',
} as const;

const ProfileOrders = () => {
    const { userId, isAuthenticated } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['userOrders', userId],
        queryFn: () => getUserOrdersAction(userId as string),
        enabled: !!userId && isAuthenticated,
    });

    if (isAuthenticated && isLoading) {
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-0'>
                    <h2 className='text-2xl font-bold'>Orders</h2>
                    <p className="text-muted-foreground">View your orders details</p>
                </div>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading orders...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated && userId === null) {
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-0'>
                    <h2 className='text-2xl font-bold'>Orders</h2>
                    <p className="text-muted-foreground">View your orders details</p>
                </div>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Checking authentication...</span>
                </div>
            </div>
        );
    }

    if (isAuthenticated && error) {
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-0'>
                    <h2 className='text-2xl font-bold'>Orders</h2>
                    <p className="text-muted-foreground">View your orders details</p>
                </div>
                <div className="text-center py-8">
                    <p className="text-destructive">Error loading orders: {error.message}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-0'>
                    <h2 className='text-2xl font-bold'>Orders</h2>
                    <p className="text-muted-foreground">View your orders details</p>
                </div>
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Please log in to view your orders</p>
                </div>
            </div>
        );
    }

    if (!data?.data || data.data.length === 0) {
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-0'>
                    <h2 className='text-2xl font-bold'>Orders</h2>
                    <p className="text-muted-foreground">View your orders details</p>
                </div>
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No orders found</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-0'>
                <h2 className='text-2xl font-bold'>Orders</h2>
                <p className="text-muted-foreground">View your orders details</p>
            </div>
            {data.data.map((order: Order) => {
                const paymentReference = order.paymentId ? `#${order.paymentId}` : `Order ${order._id.slice(-6)}`;
                const paymentMethodLabel = paymentMethodLabels[order.paymentMethod as keyof typeof paymentMethodLabels] || 'Mercado Pago';

                return (
                    <Card key={order._id} className="border border-muted-foreground/20">
                        <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">{paymentReference}</h3>
                                <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className="text-xs text-muted-foreground mt-1">Payment method: {paymentMethodLabel}</p>
                            </div>
                            <div className="text-right">
                                <Badge className='capitalize' variant={order.status === 'pending' ? 'pending' : order.status === 'approved' ? 'approved' : order.status === 'rejected' ? 'rejected' : order.status === 'cancelled' ? 'cancelled' : order.status === 'pending_shipping' ? 'pending_shipping' : order.status === 'shipping' ? 'shipping' : 'delivered'}>
                                    {statusLabels[order.status as keyof typeof statusLabels]}
                                </Badge>
                                <div className="mt-1">
                                    {order.appliedCoupon && (
                                        <div className="text-xs text-green-600 mb-1">
                                            Coupon: {order.appliedCoupon.code}
                                        </div>
                                    )}
                                    <p className="font-semibold text-lg">
                                        ${(() => {
                                            const subtotal = order.products.reduce((acc, product) => acc + (product.product?.price || 0) * product.quantity, 0);
                                            if (order.appliedCoupon) {
                                                let discount = 0;
                                                if (order.appliedCoupon.type === 'percentage') {
                                                    discount = subtotal * (order.appliedCoupon.value / 100);
                                                } else {
                                                    discount = order.appliedCoupon.value;
                                                }
                                                return (subtotal - discount).toFixed(2);
                                            }
                                            return subtotal.toFixed(2);
                                        })()}
                                    </p>
                                    {order.appliedCoupon && (
                                        <p className="text-xs text-muted-foreground">
                                            Original: ${order.products.reduce((acc, product) => acc + (product.product?.price || 0) * product.quantity, 0).toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Separator className="mb-4" />
                        <div className="space-y-3">
                            {order.products.map((item) => (
                                <div key={item.product._id} className="flex items-center space-x-4">
                                    <Image
                                        src={item.product.images[0] || "/placeholder.svg"}
                                        alt={item.product.name || 'Product'}
                                        width={50}
                                        height={50}
                                        className="rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.product.name || 'Unknown Product'}</h4>
                                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <span className="text-sm text-muted-foreground">{order.products.length} item(s)</span>
                            <div className="flex space-x-2">
                                {/* {order.status === "delivered" && (
                                    <Button variant="outline" size="sm">
                                        Reorder
                                    </Button>
                                )} */}
                                <Button disabled variant="outline" size="sm">
                                    View Details
                                </Button>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}

export default ProfileOrders
