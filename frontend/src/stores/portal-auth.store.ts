import { create } from 'zustand';
import { portalAuthApi } from '@/lib/api/portal-auth.api';
import type { User } from '@/lib/types';

interface PortalAuthStore {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<User | null>;
}

export const usePortalAuthStore = create<PortalAuthStore>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user } = await portalAuthApi.login(email, password);
      set({ user, isLoading: false, isInitialized: true });
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      await portalAuthApi.logout();
    } finally {
      set({ user: null });
    }
  },

  fetchProfile: async () => {
    try {
      const user = await portalAuthApi.getProfile();
      set({ user, isInitialized: true });
      return user;
    } catch {
      set({ user: null, isInitialized: true });
      return null;
    }
  },
}));
