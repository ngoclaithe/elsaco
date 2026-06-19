import { apiFetch } from './client';
import type { User } from '@/lib/types';

export const usersApi = {
  updateProfile: (data: { name?: string; phone?: string }) =>
    apiFetch<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
