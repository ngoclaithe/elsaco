'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useOrderDetail } from '@/hooks/useOrders';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils/format';

function OrderDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { order, loading } = useOrderDetail(params.id as string);
  const success = searchParams.get('success');

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/account/orders" className="text-sm text-muted hover:text-black">← Orders</Link>
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 text-sm text-green-800">
          Order placed successfully! Thank you for your purchase.
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mt-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-medium break-all">#{order.orderNumber}</h1>
          <p className="text-sm text-muted mt-1">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
        </div>
        <span className="text-xs uppercase tracking-wider px-3 py-1 bg-neutral-100 self-start shrink-0">
          {ORDER_STATUS_LABELS[order.status] || order.status}
        </span>
      </div>
      <div className="border border-neutral-200 p-4 sm:p-6 mb-6 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-3 sm:gap-4 min-w-0">
            <div className="relative w-16 h-20 bg-neutral-100 shrink-0">
              <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm line-clamp-2">{item.productName}</p>
              <p className="text-xs text-muted">Size: {item.size} × {item.quantity}</p>
            </div>
            <p className="text-sm shrink-0">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shippingFee)}</span></div>
          <div className="flex justify-between font-medium"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
