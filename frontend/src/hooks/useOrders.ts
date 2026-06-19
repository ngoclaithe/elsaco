'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/lib/types';
import { useAuth } from './useAuth';

export function useOrders() {
  const router = useRouter();
  const { user, requireAuth } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth('/account/orders')) return;
    ordersApi
      .getAll()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, requireAuth]);

  return { orders, loading };
}

export function useOrderDetail(orderId: string) {
  const { requireAuth } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth('/account/orders')) return;
    ordersApi
      .getById(orderId)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId, requireAuth]);

  return { order, loading };
}
