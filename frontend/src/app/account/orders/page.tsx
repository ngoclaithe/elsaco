'use client';

import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils/format';

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
      <Link href="/account" className="text-sm text-muted hover:text-black">← Account</Link>
      <h1 className="text-2xl font-medium mb-8 mt-4">Orders</h1>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted mb-4">No orders yet</p>
          <Link href="/collections/all-products" className="btn-primary">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="block border border-neutral-200 p-6 hover:border-black transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">#{order.orderNumber}</span>
                <span className="text-xs uppercase tracking-wider px-2 py-1 bg-neutral-100">
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted">
                <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                <span className="text-black font-medium">{formatPrice(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
