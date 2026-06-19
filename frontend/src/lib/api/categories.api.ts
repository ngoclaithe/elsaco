import { apiFetch } from './client';
import type { Category } from '@/lib/types';

export const categoriesApi = {
  getAll: () => apiFetch<Category[]>('/categories'),
};
