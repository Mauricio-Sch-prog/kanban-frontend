'use client';

import { Input } from '@/components/ui/Input';
import { useRecuperation } from '@/hooks/auth/useRecuperation';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const recuperationMutation = useRecuperation();

  const [email, setEmail] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    recuperationMutation.mutate(email);
  }

  return (
    <div className="bg-primary text-text-100 relative flex min-h-screen items-center justify-center p-6">
      <Link
        href="/auth/login"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span>Go back</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-accent/70 text-3xl font-bold tracking-tight">Restore your account</h1>
          <p className="mt-2 text-sm text-gray-400">
            We&apos;ll send a recuperation request to your email.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-accent hover:bg-accent/65 focus:ring-offset-accent focus:ring-accent mt-2 w-full rounded-lg px-4 py-3 font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Send recuperation email
          </button>
        </form>
      </div>
    </div>
  );
}
