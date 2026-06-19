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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-medium">Account</h1>
          <p className="text-sm text-muted mt-1 truncate">Welcome back, {user.name}</p>
        </div>
        <button onClick={logout} className="text-sm underline hover:no-underline self-start min-h-[44px] px-1">Log out</button>
      </div>

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
