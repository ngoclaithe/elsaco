import { create } from 'zustand';
import { authApi } from '@/lib/api';
import { useCartStore } from '@/stores/cart.store';
import type { RegisterInput, User } from '@/lib/types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (value: boolean) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<User | null>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user } = await authApi.login(email, password);
      set({ user, isLoading: false });
      await useCartStore.getState().fetchCart();
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const { user } = await authApi.register(data);
      set({ user, isLoading: false });
      await useCartStore.getState().fetchCart();
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null });
      useCartStore.getState().clearItems();
    }
  },

  fetchProfile: async () => {
    try {
      const user = await authApi.getProfile();
      set({ user, isInitialized: true });
      return user;
    } catch {
      set({ user: null, isInitialized: true });
      return null;
    }
  },
}));
