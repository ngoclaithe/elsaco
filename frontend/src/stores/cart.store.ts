import { create } from 'zustand';
import { cartApi } from '@/lib/api';
import type { CartItem } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  setItems: (items: CartItem[]) => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, size: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearItems: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  setOpen: (isOpen) => set({ isOpen }),
  setItems: (items) => set({ items }),

  fetchCart: async () => {
    try {
      const cart = await cartApi.get();
      set({ items: cart.items });
    } catch {
      set({ items: [] });
    }
  },

  addItem: async (productId, size, quantity = 1) => {
    const cart = await cartApi.addItem(productId, size, quantity);
    set({ items: cart.items, isOpen: true });
  },

  updateItem: async (itemId, quantity) => {
    const cart = await cartApi.updateItem(itemId, quantity);
    set({ items: cart.items });
  },

  removeItem: async (itemId) => {
    const cart = await cartApi.removeItem(itemId);
    set({ items: cart.items });
  },

  clearItems: () => set({ items: [] }),

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
}));

// Selectors as standalone helpers (Zustand getState)
export const cartSelectors = {
  itemCount: () =>
    useCartStore.getState().items.reduce((sum, item) => sum + item.quantity, 0),
  subtotal: () =>
    useCartStore.getState().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
};
