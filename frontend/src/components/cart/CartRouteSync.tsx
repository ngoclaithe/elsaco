'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cart.store';

export function CartRouteSync() {
  const pathname = usePathname();
  const setOpen = useCartStore((s) => s.setOpen);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return null;
}
