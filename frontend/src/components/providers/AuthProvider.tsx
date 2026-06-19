'use client';

import { useEffect } from 'react';
import { useAuthInit } from '@/hooks/useAuth';
import { useCartInit } from '@/hooks/useCart';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthInit();
  const { user, fetchCart, clearItems } = useCartInit();

  useEffect(() => {
    if (user) fetchCart();
    else clearItems();
  }, [user, fetchCart, clearItems]);

  return <>{children}</>;
}
