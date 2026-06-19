'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePortalAuth, usePortalAuthInit } from '@/hooks/usePortalAuth';

const STORAGE_KEY = 'portal-sidebar-collapsed';

const navItems = [
  { href: '/portal', label: 'Dashboard', short: 'D', exact: true },
  { href: '/portal/products', label: 'Products', short: 'P' },
  { href: '/portal/categories', label: 'Categories', short: 'C' },
  { href: '/portal/orders', label: 'Orders', short: 'O' },
  { href: '/portal/users', label: 'Users', short: 'U' },
  { href: '/portal/settings', label: 'Settings', short: 'S' },
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  useEffect(() => {
    if (isInitialized && !user) {
      router.push(`/portal/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isInitialized, router, pathname]);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      return next;
    });
  };

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
      <aside
        className={`${
          collapsed ? 'w-[72px]' : 'w-64'
        } bg-white border-r border-neutral-200 flex flex-col shrink-0 transition-[width] duration-200 overflow-hidden`}
      >
        <div className={`border-b border-neutral-200 flex items-center ${collapsed ? 'p-3 justify-center' : 'p-5 justify-between'}`}>
          {collapsed ? (
            <Link href="/portal" className="text-sm font-bold tracking-widest" title="elSaco">
              ES
            </Link>
          ) : (
            <>
              <div>
                <Link href="/portal" className="text-base font-semibold tracking-[0.12em] uppercase">
                  elSaco
                </Link>
                <p className="text-xs text-muted mt-1">Admin portal</p>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 text-muted"
                title="Collapse sidebar"
              >
                ‹
              </button>
            </>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center gap-3 rounded-md transition-colors ${
                  collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
                } text-sm ${
                  active
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                {collapsed ? (
                  <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-md bg-inherit">
                    {item.short}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`p-2 border-t border-neutral-200 space-y-1 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          {!collapsed && (
            <p className="px-3 py-1 text-xs text-muted truncate">{user.email}</p>
          )}
          <Link
            href="/"
            title="View store"
            className={`text-sm text-neutral-600 hover:text-black rounded-md hover:bg-neutral-100 ${
              collapsed ? 'w-10 h-10 flex items-center justify-center' : 'block px-3 py-2'
            }`}
          >
            {collapsed ? '↗' : '← View store'}
          </Link>
          <button
            onClick={logout}
            title="Log out"
            className={`text-sm text-neutral-600 hover:text-black rounded-md hover:bg-neutral-100 ${
              collapsed ? 'w-10 h-10 flex items-center justify-center' : 'block w-full text-left px-3 py-2'
            }`}
          >
            {collapsed ? '⎋' : 'Log out'}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-neutral-200 px-4 lg:px-6 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {collapsed && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-neutral-200 hover:bg-neutral-50 shrink-0"
                title="Expand sidebar"
              >
                ☰
              </button>
            )}
            <p className="text-sm font-medium truncate">{currentPage || 'Portal'}</p>
          </div>
          <Link href="/" className="text-xs text-muted hover:text-black shrink-0">
            elsaco.dosutech.site
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
