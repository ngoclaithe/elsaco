'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePortalAuth, usePortalAuthInit } from '@/hooks/usePortalAuth';

const navItems = [
  { href: '/portal', label: 'Dashboard', exact: true },
  { href: '/portal/products', label: 'Products' },
  { href: '/portal/categories', label: 'Categories' },
  { href: '/portal/orders', label: 'Orders' },
  { href: '/portal/users', label: 'Users' },
  { href: '/portal/settings', label: 'Settings' },
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-muted">
        Loading portal...
      </div>
    );
  }

  if (!user) return null;

  const currentPage = navItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href),
  )?.label;

  return (
    <div className="min-h-screen flex bg-neutral-100">
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-neutral-200">
          <Link href="/portal" className="text-base font-semibold tracking-[0.12em] uppercase">
            elSaco
          </Link>
          <p className="text-xs text-muted mt-1">Admin portal</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${
                  active
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-200 space-y-1">
          <p className="px-3 py-1 text-xs text-muted truncate">{user.email}</p>
          <Link
            href="/"
            className="block px-3 py-2 text-sm text-neutral-600 hover:text-black rounded-md hover:bg-neutral-100"
          >
            ← View store
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-3 py-2 text-sm text-neutral-600 hover:text-black rounded-md hover:bg-neutral-100"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-neutral-200 px-6 flex items-center justify-between shrink-0">
          <p className="text-sm text-muted">{currentPage || 'Portal'}</p>
          <Link href="/" className="text-xs text-muted hover:text-black">
            elsaco.dosutech.site
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
