'use client';

import { useCallback } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { useAuth } from './useAuth';

export function useCart() {
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const addItem = useCartStore((s) => s.addItem);
  const updateItem = useCartStore((s) => s.updateItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearItems = useCartStore((s) => s.clearItems);

  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  const syncCart = useCallback(async () => {
    if (user) await fetchCart();
    else clearItems();
  }, [user, fetchCart, clearItems]);

  return {
    items,
    isOpen,
    itemCount,
    subtotal,
    setOpen,
    fetchCart,
    syncCart,
    addItem,
    updateItem,
    removeItem,
    clearItems,
  };
}

export function useCartInit() {
  const { user } = useAuth();
  const fetchCart = useCartStore((s) => s.fetchCart);
  const clearItems = useCartStore((s) => s.clearItems);
  return { user, fetchCart, clearItems };
}
