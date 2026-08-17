'use client';

import { Input } from '@/components/ui/Input';
import { useLogin } from '@/hooks/auth/useLogin';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
    <div className="bg-bg text-text-100 grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Form Section */}
      <div className="flex flex-col justify-center px-8 py-12 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <div className="mb-8">
            <h1 className="text-text text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-400">
              Please enter your credentials to access your account.
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

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-300">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-accent hover:bg-accent/65 focus:ring-offset-accent focus:ring-accent mt-2 w-full rounded-lg px-4 py-3 font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400 lg:text-left">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-accent hover:text-accent/80 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: Hero Image Section */}
      <div className="bg-primary relative hidden w-full overflow-hidden lg:block">
        <Image
          src="/auth-banner.jpg" // Replace with your image path
          alt="Authentication Hero"
          fill
          className="object-cover"
          priority
        />
        {/* Subtle dark gradient overlay */}
        <div className="from-accent/20 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
      </div>
    </div>
  );
}
