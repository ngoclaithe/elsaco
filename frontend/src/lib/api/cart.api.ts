import { apiFetch } from './client';
import type { Cart } from '@/lib/types';

export const cartApi = {
  get: () => apiFetch<Cart>('/cart'),

  addItem: (productId: string, size: string, quantity = 1) =>
    apiFetch<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, size, quantity }),
    }),

  updateItem: (itemId: string, quantity: number) =>
    apiFetch<Cart>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (itemId: string) =>
    apiFetch<Cart>(`/cart/items/${itemId}`, { method: 'DELETE' }),
};
