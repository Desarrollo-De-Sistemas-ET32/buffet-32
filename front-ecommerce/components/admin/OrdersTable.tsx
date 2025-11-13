import { useAllOrders } from '@/hooks/useOrder';
import React, { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Order } from '@/types/order';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import SkeletonTable from './SkeletonTable';
import { Badge } from '../ui/badge';
import { EyeIcon } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
    
const statusLabels = {
    pending: "Pendiente",
    approved: "Aprobado",
    pending_shipping: "Envío Pendiente",
    delivered: "Entregado",
    cancelled: "Cancelado",
    shipping: "Enviado",
    rejected: "Rechazado",
}

const paymentMethodLabels = {
    mercadopago: 'Mercado Pago',
    cash: 'Efectivo',
} as const;

const OrdersTable = () => {
    const { data: orders, isLoading, error } = useAllOrders();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pedidos</CardTitle>
                <CardDescription>
                    Gestiona tus pedidos
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <SkeletonTable columns={8} rows={8} />
                ) : error ? (
                    <div className="flex justify-center items-center p-8 text-destructive">
                        <span>Error: {error.message}</span>
                    </div>
                ) : !orders || orders.length === 0 ? (
                    <div className="flex justify-center items-center p-8 text-muted-foreground">
                        <span>No se encontraron pedidos</span>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Pago</TableHead>
                                <TableHead>Productos</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Cupón</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Información del Estudiante</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => {
                                const paymentMethodLabel = paymentMethodLabels[order.paymentMethod as keyof typeof paymentMethodLabels] || 'Mercado Pago';
                                return (
                                    <TableRow key={order._id}>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">{paymentMethodLabel}</div>
                                            <div className="text-xs text-muted-foreground font-mono">{order.paymentId ? `#${order.paymentId}` : 'Sin ID de pago'}</div>
                                        </TableCell>
                                    <TableCell>{order.products.map((product) => product.product.name).join(', ')}</TableCell>
                                    <TableCell>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                ${(() => {
                                                    // Calculate subtotal with product discounts applied
                                                    const subtotalWithProductDiscounts = order.products.reduce((acc, product) => {
                                                        const originalPrice = product.product.price;
                                                        const productDiscount = product.product.discount || 0;
                                                        const discountedPrice = originalPrice * (1 - productDiscount / 100);
                                                        return acc + (discountedPrice * product.quantity);
                                                    }, 0);
                                                    
                                                    // Apply coupon discount if exists
                                                    if (order.appliedCoupon) {
                                                        let couponDiscount = 0;
                                                        if (order.appliedCoupon.type === 'percentage') {
                                                            couponDiscount = subtotalWithProductDiscounts * (order.appliedCoupon.value / 100);
                                                        } else {
                                                            couponDiscount = order.appliedCoupon.value;
                                                        }
                                                        return (subtotalWithProductDiscounts - couponDiscount).toFixed(2);
                                                    }
                                                    return subtotalWithProductDiscounts.toFixed(2);
                                                })()}
                                            </div>
                                            {order.appliedCoupon && (
                                                <div className="text-xs text-muted-foreground">
                                                    Después de productos: ${order.products.reduce((acc, product) => {
                                                        const originalPrice = product.product.price;
                                                        const productDiscount = product.product.discount || 0;
                                                        const discountedPrice = originalPrice * (1 - productDiscount / 100);
                                                        return acc + (discountedPrice * product.quantity);
                                                    }, 0).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {order.appliedCoupon ? (
                                            <div className="text-sm">
                                                <div className="font-medium text-green-600">{order.appliedCoupon.code}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {order.appliedCoupon.type === 'percentage' ? `${order.appliedCoupon.value}%` : `$${order.appliedCoupon.value}`}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">Ninguno</span>
                                        )}
                                    </TableCell>
                                    <TableCell className='capitalize'>
                                        <Badge variant={order.status === 'pending' ? 'pending' : order.status === 'approved' ? 'approved' : order.status === 'rejected' ? 'rejected' : order.status === 'cancelled' ? 'cancelled' : order.status === 'pending_shipping' ? 'pending_shipping' : order.status === 'shipping' ? 'shipping' : 'delivered'}>
                                            {statusLabels[order.status as keyof typeof statusLabels]}
                                        </Badge>
                                    </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">DNI: {order.shippingData.dni || '—'}</div>
                                            <div className="text-xs text-muted-foreground">Curso: {order.shippingData.course || '—'} • División: {order.shippingData.division || '—'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                <EyeIcon className='w-4 h-4 mr-0' />
                                                Ver
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className='min-w-5xl max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle>Detalles del Pedido</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                            <OrderDetailModal 
                                selectedOrder={selectedOrder} 
                                onClose={() => setDialogOpen(false)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

export default OrdersTable
