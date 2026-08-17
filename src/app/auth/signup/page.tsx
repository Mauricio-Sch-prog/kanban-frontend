'use client';

import { Input } from '@/components/ui/Input';
import { useSignup } from '@/hooks/auth/useSignup';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const signupMutation = useSignup();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    signupMutation.mutate({
      name,
      email,
      password,
      repeatPassword,
    });
  }

  return (
    <div className="bg-bg grid min-h-screen grid-cols-1 text-gray-100 lg:grid-cols-2">
      {/* Left Column: Form Section */}
      <div className="flex flex-col justify-center px-8 py-12 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
            <p className="mt-2 text-sm text-gray-400">Enter your details below to get started.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-300">Full Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Markus Lumberjack"
                required
              />
            </div>

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
                placeholder="At least 12 characters"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-300">
                Confirm Password
              </label>
              <Input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-accent hover:bg-accent/65 focus:ring-offset-accent focus:ring-accent mt-2 w-full rounded-lg px-4 py-3 font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400 lg:text-left">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: Hero Image Section */}
      <div className="relative hidden w-full overflow-hidden bg-gray-900 lg:block">
        <Image
          src="/auth-banner.jpg" // Replace with your image path
          alt="Authentication Hero"
          fill
          className="object-cover"
          priority
        />
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-gray-950/80 via-transparent to-transparent" />
      </div>
    </div>
  );
}
