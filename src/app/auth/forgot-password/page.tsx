'use client';

import { Input } from '@/components/ui/Input';
import { useRecuperationRequest } from '@/hooks/auth/useRecuperationRequest';
import { useState } from 'react';

export default function Login() {
  const recuperationMutation = useRecuperationRequest();

  const [email, setEmail] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    recuperationMutation.mutate(email);
  }

  return (
    <div className="bg-bg text-text-100 grid min-h-screen">
      <div className="flex flex-col justify-center px-8 py-12 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <div className="mb-8">
            <h1 className="text-accent/70 text-3xl font-bold tracking-tight">
              Restore your account
            </h1>
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
    </div>
  );
}
