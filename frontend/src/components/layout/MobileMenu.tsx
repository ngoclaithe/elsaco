'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/collections/all-products', label: 'All products' },
  { href: '/collections/tops', label: 'Tops' },
  { href: '/collections/bottoms', label: 'Bottoms' },
  { href: '/collections/accessories', label: 'Accessories' },
  { href: '/about', label: 'About us' },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { user } = useAuth();
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[min(280px,85vw)] bg-white animate-slide-in-left safe-bottom">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-sm font-semibold tracking-widest uppercase">Menu</span>
          <button onClick={onClose} className="touch-target -mr-2" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        <nav className="py-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block px-6 py-3.5 text-sm hover:bg-neutral-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-neutral-200 mt-2 pt-2">
            <Link
              href={user ? '/account' : '/account/login'}
              onClick={onClose}
              className="block px-6 py-3.5 text-sm hover:bg-neutral-50 transition-colors"
            >
              {user ? 'My account' : 'Log in'}
            </Link>
            {!user && (
              <Link
                href="/account/register"
                onClick={onClose}
                className="block px-6 py-3.5 text-sm hover:bg-neutral-50 transition-colors"
              >
                Create account
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
