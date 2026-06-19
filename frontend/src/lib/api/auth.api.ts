import { apiFetch } from './client';
import type { RegisterInput, User } from '@/lib/types';

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: RegisterInput) =>
    apiFetch<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiFetch<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  getProfile: () => apiFetch<User>('/auth/me'),

  refresh: () => apiFetch<{ user: User }>('/auth/refresh', { method: 'POST' }),
};
