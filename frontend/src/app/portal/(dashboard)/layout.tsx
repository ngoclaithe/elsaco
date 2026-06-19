'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePortalAuth, usePortalAuthInit } from '@/hooks/usePortalAuth';

const navItems = [
  { href: '/portal', label: 'Dashboard', exact: true },
  { href: '/portal/products', label: 'Products' },
  { href: '/portal/orders', label: 'Orders' },
  { href: '/portal/users', label: 'Users' },
];

export default function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  usePortalAuthInit();
  const { user, isInitialized, logout } = usePortalAuth();

  useEffect(() => {
    if (isInitialized && !user) {
      router.push(`/portal/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isInitialized, router, pathname]);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-black text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/portal" className="text-lg font-semibold tracking-[0.15em] uppercase">
            elSaco
          </Link>
          <p className="text-xs text-white/50 mt-1">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2.5 text-sm rounded transition-colors ${
                  active
                    ? 'bg-white text-black font-medium'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="block px-4 py-2 text-sm text-white/70 hover:text-white">
            ← Back to store
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-neutral-50 overflow-auto">
        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
