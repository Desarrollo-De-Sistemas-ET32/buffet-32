"use client"
import React, { useState } from 'react'
import { Product } from '@/types/product'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import RelatedProduct from './RelatedProduct'
import { Input } from '../ui/input'
import { useMutation } from '@tanstack/react-query'
import { createStockAlertAction } from '@/actions/user'
import { toast } from 'sonner'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const stockAlertSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
});

type StockAlertFormData = z.infer<typeof stockAlertSchema>;

const ProductDetail = ({ product }: { product: Product }) => {

    const addToCart = useCart((state) => state.addToCart);
    const [showRemindMe, setShowRemindMe] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<StockAlertFormData>({
        mode: 'onChange',
        resolver: zodResolver(stockAlertSchema),
        defaultValues: {
            email: '',
        },
    });

    const createStockAlertMutation = useMutation({
        mutationFn: ({ productId, email }: { productId: string; email: string }) =>
            createStockAlertAction(productId, email),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || 'Alerta de stock creada correctamente');
                reset();
                setShowRemindMe(false);
            } else {
                toast.error(response.error || 'No se pudo crear la alerta');
            }
        },
    });

    const onSubmitStockAlert = (data: StockAlertFormData) => {
        createStockAlertMutation.mutate({
            productId: product._id,
            email: data.email
        });
    };

    return (
        <div className="flex flex-col gap-8 w-full">
            <Card className="max-w-4xl w-full mx-auto">
                <CardContent className="flex flex-col md:flex-row gap-8 p-8 items-center md:items-start">
                    <div className="w-full md:w-1/2 flex justify-center items-center">
                        <Image
                            src={(product.images[0] || '/placeholder.png').replace(/ /g, '%20')}
                            alt={product.name}
                            className="rounded-lg w-full h-full bg-muted"
                            width={512}
                            height={512}
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
                            <Badge>{product.category.name}</Badge>
                        </div>
                        <p className="text-muted-foreground text-lg">{product.description}</p>
                        <div className="text-2xl font-semibold">${product.price}</div>
                        <Button size="lg" className="mt-4 w-full" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                            {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                        </Button>

                        {product.stock === 0 && (
                            <div className="space-y-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRemindMe(!showRemindMe)}
                                    className="w-full"
                                >
                                    {showRemindMe ? "Cancelar" : "Avísame cuando haya stock"}
                                </Button>

                                {showRemindMe && (
                                    <form onSubmit={handleSubmit(onSubmitStockAlert)} className="space-y-3">
                                        <div className="space-y-2">
                                            <Input
                                                type="email"
                                                placeholder="Ingresa tu correo"
                                                {...register('email')}
                                                className={errors.email ? 'border-red-500' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{errors.email.message}</p>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || createStockAlertMutation.isPending}
                                            className="w-full"
                                        >
                                            {isSubmitting || createStockAlertMutation.isPending
                                                ? "Guardando alerta..."
                                                : "Crear alerta de stock"
                                            }
                                        </Button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <RelatedProduct categoryId={product.category._id.toString()} productId={product._id.toString()} />
        </div>
    )
}

export default ProductDetail
