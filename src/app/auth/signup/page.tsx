'use client';

import HeroImage from '@/assets/HeroImage';
import GoogleButton from '@/components/ui/GoogleButton';
import { Input } from '@/components/ui/Input';
import { useSignup } from '@/hooks/auth/useSignup';
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
    console.log("i'm here");

    signupMutation.mutate({
      name,
      email,
      password,
      repeatPassword,
    });
  }

  return (
    <div className="bg-primary grid h-dvh grid-cols-1 overflow-hidden text-gray-100 lg:grid-cols-2">
      <div className="flex flex-col justify-center overflow-y-auto px-8 py-6 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <div className="mb-6">
            <h1 className="text-accent/70 text-3xl font-bold tracking-tight">Create an account</h1>
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
            <GoogleButton />
          </form>

          <p className="mt-6 text-center text-sm text-gray-400 lg:text-left">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="bg-bg relative hidden h-full w-full overflow-hidden lg:block">
        <HeroImage />
        <div className="from-accent/5 absolute inset-0 bg-linear-to-b via-transparent to-transparent" />
      </div>
    </div>
  );
}
