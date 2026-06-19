'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/users', label: 'Users' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isInitialized, logout } = useAuth();

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/account/login?redirect=/admin');
    } else if (isInitialized && user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, isInitialized, router]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-black text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-lg font-semibold tracking-[0.15em] uppercase">elSaco</Link>
          <p className="text-xs text-white/50 mt-1">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`block px-4 py-2.5 text-sm rounded transition-colors ${active ? 'bg-white text-black font-medium' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="block px-4 py-2 text-sm text-white/70 hover:text-white">← Back to store</Link>
          <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white">Log out</button>
        </div>
      </aside>
      <main className="flex-1 bg-neutral-50 overflow-auto">
        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
