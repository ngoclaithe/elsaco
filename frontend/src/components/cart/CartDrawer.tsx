'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { formatPrice } from '@/lib/utils/format';

export function CartDrawer() {
  const { items, isOpen, setOpen, updateItem, removeItem, subtotal } = useCart();
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-white flex flex-col animate-slide-in-right shadow-2xl safe-bottom">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b shrink-0">
          <h2 className="text-lg font-medium">Cart</h2>
          <button onClick={() => setOpen(false)} className="touch-target" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted mb-6">
              Have an account?{' '}
              <Link href="/account/login" className="underline" onClick={() => setOpen(false)}>
                Log in
              </Link>{' '}
              to check out faster.
            </p>
            <button onClick={() => setOpen(false)} className="btn-primary w-full max-w-xs">
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 sm:gap-4">
                  <div className="relative w-20 h-24 bg-neutral-100 shrink-0 overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium line-clamp-2 hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted mt-1">Size: {item.size}</p>
                    <p className="text-sm mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="flex items-center border border-neutral-300">
                        <button
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          className="w-11 h-11 flex items-center justify-center hover:bg-neutral-50"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="w-11 h-11 flex items-center justify-center hover:bg-neutral-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-muted hover:text-black underline min-h-[44px] px-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 sm:p-6 space-y-4 shrink-0 safe-bottom">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted">Shipping and taxes calculated at checkout</p>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="btn-primary w-full text-center"
              >
                Check out
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="w-full text-sm text-center link-underline min-h-[44px]"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
