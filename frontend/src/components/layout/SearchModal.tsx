'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productsApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils/format';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import type { Product } from '@/lib/types';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useBodyScrollLock(open);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await productsApi.getAll({ search: query, limit: '4' });
        setResults(data.products);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 sm:p-6 sm:pt-20 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl shadow-2xl animate-fade-in max-h-[min(85vh,640px)] flex flex-col">
        <div className="p-4 sm:p-6 border-b shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 text-base sm:text-lg outline-none min-w-0"
            />
            <button onClick={onClose} className="text-sm text-muted hover:text-black touch-target shrink-0">
              Close
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted mb-4">
            Products
          </h4>

          {loading && <p className="text-sm text-muted">Searching...</p>}
          {!loading && query && results.length === 0 && (
            <p className="text-sm text-muted">No products found</p>
          )}

          <div className="space-y-4">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 group min-w-0"
              >
                <div className="relative w-16 h-20 bg-neutral-100 shrink-0 overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                  <p className="text-sm mt-1">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>

          {results.length > 0 && (
            <Link
              href={`/collections/all-products?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="block mt-6 text-sm text-center link-underline"
            >
              View all
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
