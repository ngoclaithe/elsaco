'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const { login, isLoading } = useAuth();
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
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
      <h1 className="text-2xl font-medium text-center mb-2">Log in</h1>
      <p className="text-sm text-muted text-center mb-8">
        Don&apos;t have an account?{' '}
        <Link href="/account/register" className="underline text-black">
          Create account
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
        {error && <p className="text-sm text-sale">{error}</p>}
        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="text-xs text-muted text-center mt-6">Demo: user@elsaco.com / user123</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
