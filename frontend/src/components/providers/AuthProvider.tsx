'use client';

import { useEffect } from 'react';
import { useAuthInit } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthInit();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const clearItems = useCartStore((s) => s.clearItems);

  useEffect(() => {
    if (!isInitialized) return;
    if (user) fetchCart();
    else clearItems();
  }, [user, isInitialized, fetchCart, clearItems]);

  return <>{children}</>;
}
