"use client"
import React, { useEffect, useState } from 'react'
import { useQueryState } from 'nuqs'
import { useOrders } from '@/hooks/useOrder'
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const statusLabels = {
    pending: "Pendiente",
    approved: "Aprobado",
    pending_shipping: "Pendiente de envío",
    delivered: "Entregado",
    cancelled: "Cancelado",
    shipping: "En envío",
    rejected: "Rechazado",
}

const paymentMethodLabels = {
    mercadopago: 'Mercado Pago',
    cash: 'Efectivo',
} as const;

const CheckoutSummary = () => {
    const [paymentId, setPaymentId] = useQueryState('collection_id');
    const [initialLoading, setInitialLoading] = useState(true);
    const { data: order, isLoading, error, isFetching, refetch } = useOrders(paymentId as string);
    // TODO: CHECK WHEN LOADING THE DATA FROM THE ORDER IF MATCHES THE ORDER/PAYMENTID WITH THE USERID AND IF NOT, REDIRECT TO THE HOME PAGE
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (initialLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-2">
                <Card className="w-full max-w-xl shadow-lg">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={48} />
                        <CardTitle className="text-2xl text-center">Pago exitoso</CardTitle>
                        <div className="text-muted-foreground text-center">¡Gracias por tu compra! Tu pedido se registró correctamente.</div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="text-center text-muted-foreground">Procesando tu pedido...</span>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading || isFetching) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Cargando pedido...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-2">
                <Card className="w-full max-w-xl shadow-lg">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CardTitle className="text-2xl text-center text-destructive">Error al cargar el pedido</CardTitle>
                        <div className="text-muted-foreground text-center">Ocurrió un error al cargar los detalles de tu pedido.</div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="text-center text-destructive">Error: {error.message}</div>
                        <Button
                            onClick={() => refetch()}
                            className="flex items-center gap-2"
                            disabled={isFetching}
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                            Recargar pedido
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-2">
                <Card className="w-full max-w-xl shadow-lg">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <CardTitle className="text-2xl text-center">Pedido no encontrado</CardTitle>
                        <div className="text-muted-foreground text-center">No encontramos un pedido para este pago.</div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Button
                            onClick={() => refetch()}
                            className="flex items-center gap-2"
                            disabled={isFetching}
                        >
                            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                            Recargar pedido
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-2">
            <Card className="w-full max-w-xl shadow-lg">
                <CardHeader className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={48} />
                    <CardTitle className="text-2xl text-center">Payment Success</CardTitle>
                    <div className="text-muted-foreground text-center">Thank you for your purchase! Your order has been placed successfully.</div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-4 justify-between text-sm">
                            <div>
                                <span className="font-semibold">Pedido ID:</span> #{order._id?.toString()}
                            </div>
                            <div>
                                <span className="font-semibold">Pago ID:</span> {order.paymentId ? `#${order.paymentId}` : 'No aplica'}
                            </div>
                            <div>
                                <span className="font-semibold">Estado:</span> <Badge className='capitalize' variant={order.status === 'pending' ? 'pending' : order.status === 'approved' ? 'approved' : order.status === 'rejected' ? 'rejected' : order.status === 'cancelled' ? 'cancelled' : order.status === 'pending_shipping' ? 'pending_shipping' : order.status === 'shipping' ? 'shipping' : 'delivered'}>
                                    {statusLabels[order.status as keyof typeof statusLabels]}
                                </Badge>
                            </div>
                            <div>
                                <span className="font-semibold">Fecha:</span> {new Date(order.createdAt).toLocaleString()}
                            </div>
                            <div>
                                <span className="font-semibold">Forma de pago:</span> {paymentMethodLabels[order.paymentMethod as keyof typeof paymentMethodLabels] || 'Mercado Pago'}
                            </div>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.products.map((item) => (
                                <TableRow key={item.product._id}>
                                    <TableCell>
                                        {item.product?.images[0] && (
                                            <Image src={item.product.images[0]} alt={item.product.name} width={48} height={48} className="rounded object-cover" />
                                        )}
                                    </TableCell>
                                    <TableCell>{item.product?.name}</TableCell>
                                    <TableCell className="max-w-xs truncate">{item.product?.description}</TableCell>
                                    <TableCell>${item.product?.price?.toFixed(2)}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${(item.product?.price * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-end mt-6">
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                                Subtotal: ${order.products.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0).toFixed(2)}
                            </div>
                            {order.appliedCoupon && (
                                <div className="text-sm text-green-600">
                                    Descuento ({order.appliedCoupon.code}): -${(() => {
                                        const subtotal = order.products.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
                                        if (order.appliedCoupon.type === 'percentage') {
                                            return (subtotal * (order.appliedCoupon.value / 100)).toFixed(2);
                                        } else {
                                            return order.appliedCoupon.value.toFixed(2);
                                        }
                                    })()}
                                </div>
                            )}
                            <div className="text-lg font-bold">
                                Total: ${(() => {
                                    const subtotal = order.products.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
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
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-3">Información de envío</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Nombre:</span> {order.shippingData.firstName} {order.shippingData.lastName}
                            </div>
                            <div>
                                <span className="font-medium">Correo:</span> {order.shippingData.email}
                            </div>
                            <div>
                                <span className="font-medium">Teléfono:</span> {order.shippingData.phone}
                            </div>
                            <div>
                                <span className="font-medium">ID Number (DNI):</span> {order.shippingData.dni}
                            </div>
                            <div>
                                <span className="font-medium">Course:</span> {order.shippingData.course}
                            </div>
                            <div>
                                <span className="font-medium">Division:</span> {order.shippingData.division}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CheckoutSummary
