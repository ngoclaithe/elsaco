import { apiFetch } from './client';
import type { Product, ProductsResponse } from '@/lib/types';

export const productsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ProductsResponse>(`/products${query}`);
  },

  getFeatured: () => apiFetch<Product[]>('/products/featured'),

  getBySlug: (slug: string) => apiFetch<Product>(`/products/${slug}`),

  getRelated: (slug: string) => apiFetch<Product[]>(`/products/${slug}/related`),
};
