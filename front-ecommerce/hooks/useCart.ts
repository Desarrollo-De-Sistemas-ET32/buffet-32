import { create } from 'zustand';
import { Product } from '@/types/product';
import { toast } from 'sonner';
export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.product._id === product._id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { product, quantity }],
      };
    });
    toast.success(`${product.name} added to cart`);
    },
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product._id !== productId),
    }));
  },
  clearCart: () => set({ items: [] }),
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      ),
    }));
  },
})); 