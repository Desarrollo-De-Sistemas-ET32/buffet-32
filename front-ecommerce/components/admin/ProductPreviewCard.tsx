import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Star, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductPreviewCardProps {
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  images: string[];
  category?: string;
  isActive: boolean;
  isFeatured: boolean;
  categories?: Array<{ _id: string; name: string }>;
}

const ProductPreviewCard: React.FC<ProductPreviewCardProps> = ({
  name,
  description,
  price,
  discount,
  stock,
  images,
  category,
  isActive,
  isFeatured,
  categories = []
}) => {
  const discountedPrice = price * (1 - discount / 100);
  const selectedCategory = categories.find(cat => cat._id === category);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full border-2 border-dashed border-muted-foreground/25 !pt-0">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative overflow-hidden rounded-t-lg">
          {images.length > 0 ? (
            <div className="relative w-full h-56">
              <Image
                src={images[0].replace(/ /g, '%20')}
                alt={name || 'Product preview'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="w-full h-56 bg-muted/20 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No image uploaded</p>
              </div>
            </div>
          )}
          
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 ">
              {discount}% OFF
            </Badge>
          )}
          
          {selectedCategory && (
            <Badge className="absolute top-2 right-2 ">
              {selectedCategory.name}
            </Badge>
          )}
          
          {!isActive && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-white bg-gray-600">
                Inactive
              </Badge>
            </div>
          )}
          
          {isFeatured && (
            <Badge className="absolute bottom-2 left-2 bg-yellow-500">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2">
            {name || 'Product Name'}
          </h3>
          
          <p className="text-sm mb-4 line-clamp-2 text-muted-foreground">
            {description || 'Product description will appear here...'}
          </p>
          
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
            <div className="flex flex-col">
              {discount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold">
                  ${price.toFixed(2)}
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                Stock: {stock}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex gap-2 mb-2">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
              {isFeatured && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPreviewCard; 