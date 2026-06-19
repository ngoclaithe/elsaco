'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCheckout } from '@/hooks/useCheckout';
import { formatPrice } from '@/lib/utils/format';

export default function CheckoutPage() {
  const { user, items, subtotal, shippingFee, total, form, updateField, loading, error, submitOrder } = useCheckout();

  if (!user) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-medium mb-4">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl font-medium mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <form onSubmit={submitOrder} className="space-y-6">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4">Shipping information</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full name" required value={form.shippingName} onChange={(e) => updateField('shippingName', e.target.value)} className="input-field" />
              <input type="tel" placeholder="Phone number" required value={form.shippingPhone} onChange={(e) => updateField('shippingPhone', e.target.value)} className="input-field" />
              <input type="text" placeholder="Address" required value={form.shippingAddress} onChange={(e) => updateField('shippingAddress', e.target.value)} className="input-field" />
              <input type="text" placeholder="City" required value={form.shippingCity} onChange={(e) => updateField('shippingCity', e.target.value)} className="input-field" />
              <textarea placeholder="Order note (optional)" value={form.note} onChange={(e) => updateField('note', e.target.value)} className="input-field resize-none h-24" />
            </div>
          </div>
          {error && <p className="text-sm text-sale">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Processing...' : 'Place order'}
          </button>
        </form>
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider mb-4">Order summary</h2>
          <div className="border border-neutral-200 p-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-20 bg-neutral-100 shrink-0">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm line-clamp-2">{item.product.name}</p>
                  <p className="text-xs text-muted">Size: {item.size}</p>
                </div>
                <p className="text-sm">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(shippingFee)}</span></div>
              <div className="flex justify-between font-medium text-base pt-2 border-t"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
