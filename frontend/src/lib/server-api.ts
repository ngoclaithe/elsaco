import type { Product } from '@/lib/types';

const API_INTERNAL =
  process.env.API_INTERNAL_URL || 'http://localhost:4021/api';

export async function serverFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_INTERNAL}${endpoint}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return serverFetch<Product[]>('/products/featured');
}
