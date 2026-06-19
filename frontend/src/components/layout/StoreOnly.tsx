'use client';

import { usePathname } from 'next/navigation';

export function StoreOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/portal')) return null;
  return <>{children}</>;
}
