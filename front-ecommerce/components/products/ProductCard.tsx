import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Plus, Minus, Heart } from 'lucide-react'
import { Button } from '../ui/button'
import { Product } from '@/types/product'
import { Badge } from '../ui/badge'
import { useAddToCartTanstack } from '@/hooks/useCartTanstack';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { formatMoney } from '@/utils/money'
import { useAuth } from '@/context/auth-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToWishlistAction } from '@/actions/wishlist'
interface ProductCardProps {
  product: Product;
  onWishlistChange?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onWishlistChange }) => {
  const addToCartMutation = useAddToCartTanstack(1);
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { mutate: addToWishlistMutation } = useMutation({
    mutationFn: (productId: string) => addToWishlistAction(userId as string, productId),
    onSuccess: (result) => {
      if (result.success) {
        // Update local state only after successful API call
        setIsWishlisted(!isWishlisted);
        
        // Call the callback for ProfileWishlist if product was removed
        if (isWishlisted) {
          onWishlistChange?.(product._id);
        }
        
        // Invalidate all relevant queries
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['productsBySearch'] });
        queryClient.invalidateQueries({ queryKey: ['featured-products'] });
        queryClient.invalidateQueries({ queryKey: ['relatedProducts'] });
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        if (userId) {
          queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
        }
      }
    },
  });

  const handleExecuteWishlistMutation = () => {
    addToWishlistMutation(product._id);
    setIsWishlistLoading(true);
    setTimeout(() => {
      setIsWishlistLoading(false);
    }, 1000);
  }

  useEffect(() => {
    setIsWishlisted(product.isWishlisted);
  }, [product.isWishlisted]);

  return (
    <Link href={`/product/${product._id}`} className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Card className="py-0 flex flex-col h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
            {product.images.length > 1 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-56">
                        <Image
                          src={image.replace(/ /g, '%20')}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 top-1/2 transform -translate-y-1/2" />
                <CarouselNext className="right-2 top-1/2 transform -translate-y-1/2" />
              </Carousel>
            ) : (
              <div className="relative w-full h-56">
                <Image
                  src={(product.images[0] || '/placeholder-image.jpg').replace(/ /g, '%20')}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            {product.discount > 0 && (
              <Badge className="absolute top-2 left-2">
                {product.discount}% DTO
              </Badge>
            )}

            {userId && (
              <Button
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full p-2 h-8 w-8 disabled:opacity-100 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation when clicking wishlist button
                  handleExecuteWishlistMutation();
                }}
                disabled={isWishlistLoading}
              >
                <Heart
                  className={`h-4 w-4 transition-all duration-200 ${isWishlisted
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600'
                    }`}
                />
              </Button>
            )}
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{product.name}</h3>
              {product.category && product.category.name ? (
                <Badge variant="secondary" className="text-xs">
                  {product.category.name}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Sin categoría
                </Badge>
              )}
            </div>
            <p className=" text-sm mb-4 line-clamp-2 text-muted-foreground">{product.description}</p>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">(4.0)</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-muted-foreground ml-2">{formatMoney(product.price)}</span>
                <span className="text-sm text-muted-foreground ml-2">Stock: {product.stock}</span>
              </div>
            </div>

            <Button onClick={() => addToCartMutation.addToCartMutation(product._id)}
              disabled={addToCartMutation.isPending || product.stock === 0}
              className="w-full mt-auto">
              {product.stock === 0 ? <Minus className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ProductCard
