'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
      <h1 className="text-2xl font-medium text-center mb-2">Create account</h1>
      <p className="text-sm text-muted text-center mb-8">
        Already have an account?{' '}
        <Link href="/account/login" className="underline text-black">Log in</Link>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
        <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
        <input type="password" placeholder="Password (min 6 characters)" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
        {error && <p className="text-sm text-sale">{error}</p>}
        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
