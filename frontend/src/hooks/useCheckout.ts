'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api';
import { SHIPPING_FEE } from '@/lib/utils/format';
import { useAuth } from './useAuth';
import { useCart } from './useCart';

export function useCheckout() {
  const router = useRouter();
  const { user, requireAuth } = useAuth();
  const { items, subtotal, clearItems } = useCart();

  const [form, setForm] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!requireAuth('/checkout')) return;
    if (user) {
      setForm((f) => ({
        ...f,
        shippingName: user.name || '',
        shippingPhone: user.phone || '',
      }));
    }
  }, [user, requireAuth]);

  const total = subtotal + SHIPPING_FEE;

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitOrder = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const order = await ordersApi.create(form);
        clearItems();
        router.push(`/checkout/payment/${order.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Checkout failed');
      }
      setLoading(false);
    },
    [form, clearItems, router],
  );

  return {
    user,
    items,
    subtotal,
    shippingFee: SHIPPING_FEE,
    total,
    form,
    updateField,
    loading,
    error,
    submitOrder,
  };
}
