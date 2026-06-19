'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  const requireAuth = useCallback(
    (redirectTo?: string) => {
      if (!isInitialized) return false;
      if (!user) {
        router.push(`/account/login?redirect=${encodeURIComponent(redirectTo || '/account')}`);
        return false;
      }
      return true;
    },
    [user, isInitialized, router],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/');
  }, [logout, router]);

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    register,
    logout: handleLogout,
    fetchProfile,
    requireAuth,
  };
}

export function useAuthInit() {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (!isInitialized) fetchProfile();
  }, [fetchProfile, isInitialized]);
}
