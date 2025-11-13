import { Order } from '@/types/order'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { useUpdateOrderStatus } from '@/hooks/useOrder'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Calendar, 
  Tag, 
  ShoppingCart, 
  DollarSign,
  Save,
  X,
  Loader2
} from 'lucide-react'

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

const statusValues = Object.entries(statusLabels).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {} as Record<string, string>);



const OrderDetailModal = ({ selectedOrder, onClose }: { selectedOrder: Order; onClose?: () => void }) => {
    const [selectedStatus, setSelectedStatus] = useState(statusLabels[selectedOrder.status as keyof typeof statusLabels]);
    const statusValue = statusValues[selectedStatus];
    const updateOrderStatusMutation = useUpdateOrderStatus(selectedOrder._id, statusValue);

    const hasStatusChanged = selectedStatus !== statusLabels[selectedOrder.status as keyof typeof statusLabels];

    const handleSaveChanges = async () => {
        try {
            await updateOrderStatusMutation.mutateAsync();
            onClose?.();
        } catch (error) {
            console.error(error);
        }
    };

    const subtotalWithProductDiscounts = selectedOrder.products.reduce((acc, product) => {
        const originalPrice = product.product.price;
        const productDiscount = product.product.discount || 0;
        const discountedPrice = originalPrice * (1 - productDiscount / 100);
        return acc + (discountedPrice * product.quantity);
    }, 0);
    
    const couponDiscount = selectedOrder.appliedCoupon ? 
        (selectedOrder.appliedCoupon.type === 'percentage' ? 
            subtotalWithProductDiscounts * (selectedOrder.appliedCoupon.value / 100) : 
            selectedOrder.appliedCoupon.value) : 0;
    const total = subtotalWithProductDiscounts - couponDiscount;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Detalles del Pedido #{selectedOrder._id.slice(0, 4)}</h2>
                        <p className="text-sm text-muted-foreground">
                            {new Date(selectedOrder.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>
                <Badge 
                    variant={selectedOrder.status === 'pending' ? 'pending' : selectedOrder.status === 'approved' ? 'approved' : selectedOrder.status === 'rejected' ? 'rejected' : selectedOrder.status === 'cancelled' ? 'cancelled' : selectedOrder.status === 'pending_shipping' ? 'pending_shipping' : selectedOrder.status === 'shipping' ? 'shipping' : 'delivered'}
                >
                    {statusLabels[selectedOrder.status as keyof typeof statusLabels]}
                </Badge>
            </div>

            {/* Order Information Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Order Information */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <CardTitle className="text-sm font-medium">Información del Pedido</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">ID del Pedido</p>
                            <p className="text-sm font-medium font-mono">{selectedOrder._id}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">ID de Pago</p>
                            <p className="text-sm font-medium font-mono">{selectedOrder.paymentId || 'No disponible'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Método de Pago</p>
                            <p className="text-sm font-medium">{paymentMethodLabels[selectedOrder.paymentMethod as keyof typeof paymentMethodLabels] || 'Mercado Pago'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Fecha</p>
                            <p className="text-sm font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label htmlFor="status-select" className="text-xs text-muted-foreground">Estado</Label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger id="status-select" className="h-8 text-sm w-full">
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(statusLabels).map((label) => (
                                        <SelectItem key={label} value={label}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {hasStatusChanged && (
                                <Button 
                                    variant="default" 
                                    size="sm"
                                    className="w-full h-8 text-xs"
                                    disabled={updateOrderStatusMutation.isPending}
                                    onClick={handleSaveChanges}
                                >
                                    {updateOrderStatusMutation.isPending ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Guardando...
                                        </div>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Information */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <CardTitle className="text-sm font-medium">Información de Envío</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Nombre</p>
                            <p className="text-sm font-medium">{selectedOrder.shippingData.firstName} {selectedOrder.shippingData.lastName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Correo electrónico</p>
                            <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                <p className="text-sm font-medium">{selectedOrder.shippingData.email}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Teléfono</p>
                            <a
                                href={`https://wa.me/${selectedOrder.shippingData.phone}?text=Hola, me comunico por la orden ${selectedOrder._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            >
                                <Phone className="w-3 h-3" />
                                {selectedOrder.shippingData.phone}
                            </a>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Número de ID (DNI)</p>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-3 h-3 text-muted-foreground mt-0.5" />
                                <p className="text-sm font-medium">{selectedOrder.shippingData.dni}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Curso</p>
                                <p className="text-sm font-medium">{selectedOrder.shippingData.course}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">División</p>
                                <p className="text-sm font-medium">{selectedOrder.shippingData.division}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Coupon Information */}
                {selectedOrder.appliedCoupon && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-muted-foreground" />
                                <CardTitle className="text-sm font-medium">Cupón Aplicado</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Código</p>
                                <p className="text-sm font-medium text-green-600 font-mono">{selectedOrder.appliedCoupon.code}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Tipo</p>
                                <p className="text-sm font-medium">
                                    {selectedOrder.appliedCoupon.type === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Valor</p>
                                <p className="text-sm font-medium text-green-600">
                                    {selectedOrder.appliedCoupon.type === 'percentage' 
                                        ? `${selectedOrder.appliedCoupon.value}%` 
                                        : `$${selectedOrder.appliedCoupon.value}`
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Products Section */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Productos</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {selectedOrder.products.map((product, index) => (
                            <div key={product.product._id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
                                    <Image 
                                        src={product.product.images[0]} 
                                        alt={product.product.name} 
                                        fill 
                                        className="object-cover" 
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium truncate">{product.product.name}</h4>
                                    <p className="text-xs text-muted-foreground">Cantidad: {product.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <div className="space-y-1">
                                        {product.product.discount > 0 ? (
                                            <>
                                                <p className="text-sm font-medium text-green-600">
                                                    ${(product.product.price * (1 - product.product.discount / 100)).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-muted-foreground line-through">
                                                    ${product.product.price}
                                                </p>
                                                <p className="text-xs text-green-600">
                                                    {product.product.discount}% de descuento
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm font-medium">${product.product.price}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Total: ${(() => {
                                                const originalPrice = product.product.price;
                                                const productDiscount = product.product.discount || 0;
                                                const discountedPrice = originalPrice * (1 - productDiscount / 100);
                                                return (discountedPrice * product.quantity).toFixed(2);
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Totals Section */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Resumen del Pedido</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Subtotal</span>
                            <span className="text-sm font-medium">${subtotalWithProductDiscounts.toFixed(2)}</span>
                        </div>
                        {selectedOrder.appliedCoupon && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">
                                    Descuento ({selectedOrder.appliedCoupon.code})
                                </span>
                                <span className="text-sm font-medium text-green-600">
                                    -${couponDiscount.toFixed(2)}
                                </span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold">Total</span>
                            <span className="text-base font-semibold">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrderDetailModal
