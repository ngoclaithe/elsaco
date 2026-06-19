'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { SearchModal } from './SearchModal';
import { MobileMenu } from './MobileMenu';

const shopLinks = [
  { href: '/shop', label: 'All products' },
  { href: '/shop/tops', label: 'Tops' },
  { href: '/shop/bottoms', label: 'Bottoms' },
  { href: '/shop/accessories', label: 'Accessories' },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user } = useAuth();
  const { itemCount, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="border-b border-neutral-200">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden p-2 -ml-2"
                aria-label="Menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>

              <nav className="hidden lg:flex items-center gap-8">
                <Link
                  href="/"
                  className={`text-sm tracking-wide link-underline ${
                    pathname === '/' ? 'font-medium' : ''
                  }`}
                >
                  Home
                </Link>
                <div
                  className="relative"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <Link
                    href="/shop"
                    className={`text-sm tracking-wide link-underline ${
                      pathname.startsWith('/shop') ? 'font-medium' : ''
                    }`}
                  >
                    Shop
                  </Link>
                  {shopOpen && (
                    <div className="absolute top-full left-0 pt-2 animate-fade-in">
                      <div className="bg-white border border-neutral-200 py-3 min-w-[180px] shadow-lg">
                        {shopLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-5 py-2 text-sm hover:bg-neutral-50 transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/about"
                  className={`text-sm tracking-wide link-underline ${
                    pathname === '/about' ? 'font-medium' : ''
                  }`}
                >
                  About us
                </Link>
              </nav>

              <Link
                href="/"
                className="absolute left-1/2 -translate-x-1/2 text-lg lg:text-xl font-semibold tracking-[0.2em] uppercase"
              >
                elSaco
              </Link>

              <div className="flex items-center gap-3 lg:gap-5">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 hover:opacity-70 transition-opacity"
                  aria-label="Search"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>

                <Link
                  href={user ? '/account' : '/account/login'}
                  className="p-2 hover:opacity-70 transition-opacity hidden sm:block"
                  aria-label="Account"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 18c0-3.3 2.7-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </Link>

                <button
                  onClick={() => setCartOpen(true)}
                  className="p-2 hover:opacity-70 transition-opacity relative"
                  aria-label="Cart"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2 2h2l1.5 9h11L18 6H6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <circle cx="8" cy="17" r="1.5" fill="currentColor" />
                    <circle cx="15" cy="17" r="1.5" fill="currentColor" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-2xs flex items-center justify-center rounded-full">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
