'use client';

import { useState } from 'react';
import type { AdminUser } from '@/lib/types';
import { PortalField } from './PortalUI';

interface UserPasswordModalProps {
  user: AdminUser;
  onClose: () => void;
  onSave: (password: string) => Promise<void>;
}

export function UserPasswordModal({ user, onClose, onSave }: UserPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSave(password);
    } catch {
      setError('Failed to change password');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold">Change password</h2>
            <p className="text-xs text-muted mt-0.5 truncate max-w-[260px]">{user.email}</p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <PortalField label="New password">
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </PortalField>
          <PortalField label="Confirm password">
            <input required type="password" minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field" />
          </PortalField>
          {error && <p className="text-sm text-sale">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
