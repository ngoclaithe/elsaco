'use client';

import Link from 'next/link';
import { useAdminDashboard } from '@/hooks/useAdmin';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils/format';
import { PortalPageHeader, PortalPanel } from '@/components/admin/PortalUI';

export default function PortalDashboardPage() {
  const { stats } = useAdminDashboard();

  if (!stats) {
    return (
      <PortalPanel className="p-8 text-center text-muted">
        <p>Failed to load dashboard.</p>
        <button onClick={() => window.location.reload()} className="text-sm underline mt-2">
          Retry
        </button>
      </PortalPanel>
    );
  }

  const cards = [
    { label: 'Products', value: stats.totalProducts, href: '/portal/products' },
    { label: 'Orders', value: stats.totalOrders, href: '/portal/orders' },
    { label: 'Users', value: stats.totalUsers, href: '/portal/users' },
    { label: 'Revenue', value: formatPrice(stats.totalRevenue), href: '/portal/orders' },
    { label: 'Awaiting payment', value: stats.pendingPayments, href: '/portal/orders' },
  ];

  return (
    <div>
      <PortalPageHeader title="Dashboard" description="Store overview and recent activity" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm hover:border-neutral-400 transition-colors"
          >
            <p className="text-xs uppercase tracking-wider text-muted mb-2">{c.label}</p>
            <p className="text-2xl font-semibold tracking-tight">{c.value}</p>
          </Link>
        ))}
      </div>

      <PortalPanel>
        <div className="p-5 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="font-medium">Recent orders</h2>
          <Link href="/portal/orders" className="text-sm text-muted hover:text-black">
            View all →
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-muted">No orders yet</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-4 flex justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">#{order.orderNumber}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {order.user?.name} · {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted mt-0.5">{ORDER_STATUS_LABELS[order.status]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </PortalPanel>
    </div>
  );
}
