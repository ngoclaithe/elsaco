'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuthStore } from '@/stores/portal-auth.store';

export function usePortalAuth() {
  const router = useRouter();
  const user = usePortalAuthStore((s) => s.user);
  const isLoading = usePortalAuthStore((s) => s.isLoading);
  const isInitialized = usePortalAuthStore((s) => s.isInitialized);
  const login = usePortalAuthStore((s) => s.login);
  const logoutStore = usePortalAuthStore((s) => s.logout);

  const handleLogout = useCallback(async () => {
    await logoutStore();
    router.push('/portal/login');
  }, [logoutStore, router]);

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    logout: handleLogout,
  };
}

export function usePortalAuthInit() {
  const fetchProfile = usePortalAuthStore((s) => s.fetchProfile);
  const isInitialized = usePortalAuthStore((s) => s.isInitialized);

  useEffect(() => {
    if (!isInitialized) fetchProfile();
  }, [fetchProfile, isInitialized]);
}
