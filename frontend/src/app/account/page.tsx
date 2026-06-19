'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function AccountPage() {
  const { user, isInitialized, logout } = useAuth();

  useEffect(() => {
    if (isInitialized && !user) {
      window.location.href = '/account/login';
    }
  }, [user, isInitialized]);

  if (!user) return null;

  const links = [
    { href: '/account/orders', label: 'Orders', desc: 'View your order history' },
    { href: '/account/profile', label: 'Profile', desc: 'Manage your account details' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium">Account</h1>
          <p className="text-sm text-muted mt-1">Welcome back, {user.name}</p>
        </div>
        <button onClick={logout} className="text-sm underline hover:no-underline">Log out</button>
      </div>

      {user.role === 'ADMIN' && (
        <Link href="/admin" className="block border border-black p-4 mb-4 hover:bg-black hover:text-white transition-colors">
          <p className="font-medium">Admin Portal</p>
          <p className="text-sm opacity-70">Manage products, orders, and users</p>
        </Link>
      )}

      <div className="space-y-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block border border-neutral-200 p-6 hover:border-black transition-colors group">
            <p className="font-medium group-hover:underline">{link.label}</p>
            <p className="text-sm text-muted mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
