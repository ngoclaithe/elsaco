'use client';

import Link from 'next/link';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { user, form, updateField, loading, message, saveProfile } = useProfile();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/account" className="text-sm text-muted hover:text-black">← Account</Link>
      <h1 className="text-2xl font-medium mb-8 mt-4">Profile</h1>
      <form onSubmit={saveProfile} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted">Email</label>
          <p className="text-sm mt-1">{user.email}</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted">Name</label>
          <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className="input-field mt-1" />
        </div>
        {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-sale'}`}>{message}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
