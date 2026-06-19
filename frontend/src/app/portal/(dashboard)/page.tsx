'use client';

import Link from 'next/link';
import { useAdminDashboard } from '@/hooks/useAdmin';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils/format';

export default function PortalDashboardPage() {
  const { stats } = useAdminDashboard();

  if (!stats) return <div className="text-muted">Loading dashboard...</div>;

  const cards = [
    { label: 'Products', value: stats.totalProducts, href: '/portal/products' },
    { label: 'Orders', value: stats.totalOrders, href: '/portal/orders' },
    { label: 'Users', value: stats.totalUsers, href: '/portal/users' },
    { label: 'Revenue', value: formatPrice(stats.totalRevenue), href: '/portal/orders' },
    { label: 'Awaiting payment', value: stats.pendingPayments, href: '/portal/orders' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white border border-neutral-200 p-6 hover:border-black transition-colors"
          >
            <p className="text-xs uppercase tracking-wider text-muted mb-2">{c.label}</p>
            <p className="text-2xl font-medium">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white border border-neutral-200">
        <div className="p-6 border-b flex justify-between">
          <h2 className="font-medium">Recent Orders</h2>
          <Link href="/portal/orders" className="text-sm underline">
            View all
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-muted">No orders yet</p>
        ) : (
          <div className="divide-y">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="p-4 lg:px-6 flex justify-between">
                <div>
                  <p className="text-sm font-medium">#{order.orderNumber}</p>
                  <p className="text-xs text-muted">
                    {order.user?.name} · {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted">{ORDER_STATUS_LABELS[order.status]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
