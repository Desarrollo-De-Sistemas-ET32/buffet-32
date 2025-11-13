import React, { useEffect } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useCartTanstack, useUpdateCartItemQuantity, useRemoveFromCart } from '@/hooks/useCartTanstack';
import { Product } from '@/types/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartData {
  _id: string;
  user: string;
  products: CartItem[];
  createdAt: string;
  updatedAt: string;
}

const CartDrawer = () => {
  const { data: cartResponse, isLoading, error } = useCartTanstack();
  const { updateQuantityMutation, isUpdatingItem } = useUpdateCartItemQuantity();
  const { removeFromCartMutation, isRemovingItem } = useRemoveFromCart();
  const router = useRouter();

  const cart = cartResponse?.data as CartData | undefined;
  const cartItems = cart?.products || [];
  
  // Calculate total with discounts
  const total = cartItems.reduce((sum: number, item: CartItem) => {
    const originalPrice = item.product.price;
    const discountPercentage = item.product.discount || 0;
    const discountedPrice = originalPrice * (1 - discountPercentage / 100);
    return sum + (discountedPrice * item.quantity);
  }, 0);

  // Helper function to calculate discounted price
  const getDiscountedPrice = (price: number, discount: number) => {
    return price * (1 - discount / 100);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCartMutation(productId);
  };

  useEffect(() => {
    console.log(cart, "cartreactquery");
  }, [cart]);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className='relative' aria-label="Abrir carrito">
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">{cartItems.length}</span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md z-[9999] w-full right-0 ml-auto flex flex-col h-[100dvh] max-h-[100dvh]" style={{ height: '100dvh' }}>
        <DrawerHeader className="flex flex-row items-center justify-between border-b pb-2 flex-shrink-0">
          <DrawerTitle className="text-lg font-bold">Mi carrito</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" aria-label="Cerrar carrito">
              <span className="sr-only">Cerrar</span>
              ×
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="text-muted-foreground">Cargando carrito...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center">
              <span className="text-destructive">Error al cargar el carrito</span>
            </div>
          ) : cartItems.length === 0 ? (
            <span className="text-muted-foreground">Tu carrito está vacío.</span>
          ) : (
            <ul className="flex flex-col gap-4">
              {cartItems.map((item: CartItem) => {
                const originalPrice = item.product.price;
                const discountPercentage = item.product.discount || 0;
                const discountedPrice = getDiscountedPrice(originalPrice, discountPercentage);
                const hasDiscount = discountPercentage > 0;
                
                return (
                  <li key={item.product._id} className="flex items-center gap-3 border-b pb-3">
                      <Button 
                      variant="ghost" 
                      size="icon" 
                      aria-label="Eliminar producto" 
                      onClick={() => handleRemoveItem(item.product._id)}
                      disabled={isRemovingItem(item.product._id)}
                    >
                      ×
                    </Button>
                    <div className="w-16 h-16 flex-shrink-0 rounded bg-muted overflow-hidden">
                      <Image src={item.product.images[0]} alt={item.product.name} width={256} height={256} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold leading-tight truncate">{item.product.name}</div>
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
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="px-2 py-0 h-7 w-7" 
                          onClick={() => handleUpdateQuantity(item.product._id, Math.max(1, item.quantity - 1))} 
                          disabled={item.quantity <= 1 || isUpdatingItem(item.product._id)}
                        >
                          -
                        </Button>
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          min={1} 
                          readOnly 
                          className="w-10 h-7 text-center mx-1 px-0 py-0 no-spinner" 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="px-2 py-0 h-7 w-7" 
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          disabled={isUpdatingItem(item.product._id) || item.product.stock <= item.quantity}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {/* Cart summary and checkout at the bottom */}
        <div className="border-t p-4 flex-shrink-0 bg-background">
          <div className="flex justify-between text-base font-bold mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button
            disabled={cartItems.length === 0 || isLoading}
            onClick={() => {
              if (cartItems.length === 0) {
                toast.error('Tu carrito está vacío');
              } else {
                router.push('/checkout_details');
              }
            }}
            className="w-full rounded-full text-base font-semibold" 
            size="lg"
          >
            Ir a pagar
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
