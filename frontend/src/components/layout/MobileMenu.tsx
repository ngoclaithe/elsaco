'use client';

import Link from 'next/link';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'All products' },
  { href: '/shop/tops', label: 'Tops' },
  { href: '/shop/bottoms', label: 'Bottoms' },
  { href: '/shop/accessories', label: 'Accessories' },
  { href: '/about', label: 'About us' },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-sm font-semibold tracking-widest uppercase">Menu</span>
          <button onClick={onClose} className="p-2" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        <nav className="py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block px-6 py-3 text-sm hover:bg-neutral-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
