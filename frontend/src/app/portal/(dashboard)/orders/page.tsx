'use client';

import { useAdminOrders } from '@/hooks/useAdmin';
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from '@/lib/utils/format';

export default function PortalOrdersPage() {
  const { orders, loading, expanded, setExpanded, updateStatus } = useAdminOrders();

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Orders</h1>
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border">
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full p-4 lg:px-6 flex justify-between text-left hover:bg-neutral-50"
              >
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-xs text-muted">
                    {order.user?.name} · {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                  <span className="text-xs uppercase px-2 py-0.5 bg-neutral-100">
                    {order.paymentStatus || 'PENDING'}
                  </span>
                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border px-2 py-1"
                  >
                    {ORDER_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </button>
              {expanded === order.id && (
                <div className="border-t p-4 lg:px-6 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.productName} — {item.size} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
