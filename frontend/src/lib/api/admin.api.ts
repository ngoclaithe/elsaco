import { portalApiFetch } from './portal-client';
import type {
  AdminUser,
  DashboardStats,
  Order,
  Product,
  ProductFormInput,
} from '@/lib/types';

export const adminApi = {
  getDashboard: () => portalApiFetch<DashboardStats>('/admin/dashboard'),

  getProducts: () => portalApiFetch<Product[]>('/admin/products'),

  createProduct: (data: ProductFormInput) =>
    portalApiFetch<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: Partial<ProductFormInput>) =>
    portalApiFetch<Product>(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    portalApiFetch<{ success: boolean }>(`/admin/products/${id}`, { method: 'DELETE' }),

  getOrders: () => portalApiFetch<Order[]>('/admin/orders'),

  updateOrderStatus: (id: string, status: string) =>
    portalApiFetch<Order>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getUsers: () => portalApiFetch<AdminUser[]>('/admin/users'),
};
