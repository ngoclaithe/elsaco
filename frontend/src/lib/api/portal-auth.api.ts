import { portalApiFetch } from './portal-client';
import type { User } from '@/lib/types';

export const portalAuthApi = {
  login: (email: string, password: string) =>
    portalApiFetch<{ user: User }>('/auth/portal/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    portalApiFetch<{ success: boolean }>('/auth/portal/logout', { method: 'POST' }),

  getProfile: () => portalApiFetch<User>('/auth/portal/me'),

  refresh: () =>
    portalApiFetch<{ user: User }>('/auth/portal/refresh', { method: 'POST' }),
};
