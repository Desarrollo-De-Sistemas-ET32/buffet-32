import React from 'react'
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Category } from '@/types/product';

interface ProductFilterProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  searchQuery: string;
  category: string;
  setCategory: (v: string) => void;
  priceOrder: string;
  setPriceOrder: (v: string) => void;
  withDiscount: boolean;
  setWithDiscount: (v: boolean) => void;
  featured: boolean;
  setFeatured: (v: boolean) => void;
  categories?: Category[];
  isLoading?: boolean;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  inputValue,
  setInputValue,
  searchQuery,
  category,
  setCategory,
  priceOrder,
  setPriceOrder,
  withDiscount,
  setWithDiscount,
  featured,
  setFeatured,
  categories,
  isLoading
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className="flex flex-col gap-2">
        <Label htmlFor="search-input">Buscar</Label>
        <Input
          id="search-input"
          placeholder="Buscar por nombre..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`${searchQuery.length > 0 && searchQuery.length < 3 ? 'border-red-500/50' : ''}`}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="category-select">Categoría</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger disabled={isLoading || categories?.length === 0} id="category-select" className="w-full">
            <SelectValue>
              {isLoading ? 'Cargando...' : (category === 'all'
                ? 'Todas'
                : Array.isArray(categories) && categories.find(c => c.slug === category)?.name || 'Todas')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Array.isArray(categories) && categories.map((cat) => (
              <SelectItem key={cat._id} value={cat.slug}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="price-select">Precio</Label>
        <Select value={priceOrder} onValueChange={setPriceOrder}>
          <SelectTrigger id="price-select" className="w-full">
            <SelectValue>{priceOrder === 'default' ? 'Por defecto' : priceOrder === 'asc' ? 'Menor a mayor' : 'Mayor a menor'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Por defecto</SelectItem>
            <SelectItem value="asc">Menor a mayor</SelectItem>
            <SelectItem value="desc">Mayor a menor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="discount-checkbox">Descuento</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="discount-checkbox"
            checked={withDiscount}
            onCheckedChange={(checked) => setWithDiscount(checked as boolean)}
          />
          <Label htmlFor="discount-checkbox" className="text-sm">Mostrar solo productos con descuento</Label>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="featured-checkbox">Destacados</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured-checkbox"
            checked={featured}
            onCheckedChange={(checked) => setFeatured(checked as boolean)}
          />
          <Label htmlFor="featured-checkbox" className="text-sm">Mostrar solo productos destacados</Label>
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
