'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePortalAuth } from '@/hooks/usePortalAuth';

function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/portal';
  const { login, isLoading } = usePortalAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push(redirect);
    } catch {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 p-8">
        <div className="text-center mb-8">
          <p className="text-lg font-semibold tracking-[0.15em] uppercase">elSaco</p>
          <p className="text-sm text-muted mt-1">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          {error && <p className="text-sm text-sale">{error}</p>}
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-muted text-center mt-6">
          admin@elsaco.com / admin123
        </p>
        <Link href="/" className="block text-sm text-center mt-4 link-underline">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PortalLoginForm />
    </Suspense>
  );
}
