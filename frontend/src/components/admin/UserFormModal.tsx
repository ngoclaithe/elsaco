'use client';

import { useState } from 'react';
import type { AdminUser, AdminUserFormInput } from '@/lib/types';
import { PortalField } from './PortalUI';

interface UserFormModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onSave: (data: AdminUserFormInput & { password?: string }) => Promise<void>;
}

export function UserFormModal({ user, onClose, onSave }: UserFormModalProps) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'USER',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSave({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role as 'USER' | 'ADMIN',
        ...(isEdit ? {} : { password: form.password }),
      });
    } catch {
      setError('Failed to save user');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="text-lg font-semibold">{isEdit ? 'Edit user' : 'Add user'}</h2>
            <p className="text-xs text-muted mt-0.5">
              {isEdit ? 'Update account details' : 'Create a new store account'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <PortalField label="Full name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </PortalField>
          <PortalField label="Email">
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          </PortalField>
          <PortalField label="Phone">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="Optional" />
          </PortalField>
          <PortalField label="Role">
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'USER' | 'ADMIN' })} className="input-field">
              <option value="USER">Customer (USER)</option>
              <option value="ADMIN">Admin (portal access)</option>
            </select>
          </PortalField>
          {!isEdit && (
            <PortalField label="Password" hint="Minimum 6 characters">
              <input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
            </PortalField>
          )}
          {error && <p className="text-sm text-sale">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
