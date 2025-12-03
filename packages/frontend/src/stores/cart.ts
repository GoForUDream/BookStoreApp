import { create } from 'zustand';
import type { Cart, CartItem } from '@bookstore/shared';

interface CartState {
  cart: Cart;
  setCart: (cart: Cart) => void;
  isInCart: (bookId: string) => boolean;
  getCartItem: (bookId: string) => CartItem | undefined;
  clearCartState: () => void;
}

const emptyCart: Cart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: emptyCart,
  setCart: (cart) => set({ cart }),
  isInCart: (bookId) => get().cart.items.some((item) => item.book.id === bookId),
  getCartItem: (bookId) => get().cart.items.find((item) => item.book.id === bookId),
  clearCartState: () => set({ cart: emptyCart }),
}));
