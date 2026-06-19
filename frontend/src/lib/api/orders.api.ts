import { apiFetch } from './client';
import type { CheckoutInput, Order, OrderPaymentResponse } from '@/lib/types';

export const ordersApi = {
  create: (data: CheckoutInput) =>
    apiFetch<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () => apiFetch<Order[]>('/orders'),

  getById: (id: string) => apiFetch<Order>(`/orders/${id}`),

  getPayment: (id: string) => apiFetch<OrderPaymentResponse>(`/orders/${id}/payment`),
};
