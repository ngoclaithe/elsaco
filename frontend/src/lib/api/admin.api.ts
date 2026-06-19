import { apiFetch } from './client';
import type {
  AdminUser,
  DashboardStats,
  Order,
  Product,
  ProductFormInput,
} from '@/lib/types';

export const adminApi = {
  getDashboard: () => apiFetch<DashboardStats>('/admin/dashboard'),

  getProducts: () => apiFetch<Product[]>('/admin/products'),

  createProduct: (data: ProductFormInput) =>
    apiFetch<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: Partial<ProductFormInput>) =>
    apiFetch<Product>(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    apiFetch<{ success: boolean }>(`/admin/products/${id}`, { method: 'DELETE' }),

  getOrders: () => apiFetch<Order[]>('/admin/orders'),

  updateOrderStatus: (id: string, status: string) =>
    apiFetch<Order>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getUsers: () => apiFetch<AdminUser[]>('/admin/users'),
};
