'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/api';
import { useAuth } from './useAuth';

export function useProfile() {
  const router = useRouter();
  const { user, requireAuth, fetchProfile } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!requireAuth('/account/profile')) return;
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user, requireAuth]);

  const updateField = (field: 'name' | 'phone', value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');
      try {
        await usersApi.updateProfile(form);
        await fetchProfile();
        setMessage('Profile updated successfully');
      } catch {
        setMessage('Failed to update profile');
      }
      setLoading(false);
    },
    [form, fetchProfile],
  );

  return { user, form, updateField, loading, message, saveProfile };
}
