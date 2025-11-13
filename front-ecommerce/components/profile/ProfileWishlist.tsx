import React, { useState, useCallback } from 'react'
import { useAuth } from '@/context/auth-context';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types/product';
import ProductCardSkeleton from '../products/ProductCardSkeleton';

// Type for the wishlist item structure
interface WishlistItem {
  _id: string;
  user: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

const ProfileWishlist = () => {
  const { userId, isAuthenticated } = useAuth();
  const { wishlist, isLoading, error } = useWishlist(userId || undefined);

  // Local state to track products that are being removed
  const [removingProducts, setRemovingProducts] = useState<Set<string>>(new Set());

  const displayProducts = wishlist && wishlist.length > 0
    ? wishlist.flatMap((item: WishlistItem) =>
      item.products ? item.products : []
    )
    : [];

  // Filter out products that are being removed
  const visibleProducts = displayProducts.filter((product: Product) => !removingProducts.has(product._id));

  // Callback to handle when a product is removed from wishlist
  const handleProductRemoved = useCallback((productId: string) => {
    setRemovingProducts(prev => new Set(prev).add(productId));
  }, []);

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8'>
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  if (!isAuthenticated || !userId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Please log in to view your wishlist</div>
      </div>
    );
  }

  if (visibleProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-lg text-muted-foreground">Your wishlist is empty</div>
        <p className="text-sm text-muted-foreground text-center">
          Start adding products to your wishlist to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Wishlist</h2>
        <p className="text-muted-foreground">
          {visibleProducts.length} {visibleProducts.length === 1 ? 'item' : 'items'} in your wishlist
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProducts.map((product: Product) => (
          <div key={product._id} className="relative">
            <ProductCard
              product={{
                ...product,
                isWishlisted: true
              }}
              onWishlistChange={handleProductRemoved}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileWishlist;