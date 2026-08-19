'use client';

import React, { useState } from 'react';

import { Input } from '@/components/ui/Input';
import { useResetPassword } from '@/hooks/auth/useResetPassword';

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, email } = React.use(searchParams);

  const isParamsExist = !!(token && email);

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const resetPasswordMutation = useResetPassword();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    resetPasswordMutation.mutate({
      password,
      repeatPassword,
      email: email!,
      token: token!,
    });
  };

  return (
    <main className="bg-bg flex min-h-screen items-center justify-center px-4">
      <div className="border-text/10 bg-primary w-full max-w-md rounded-2xl border p-8 text-center shadow-lg">
        {isParamsExist ? (
          <>
            <h1 className="text-text mb-3 text-2xl font-semibold">Change your password</h1>

            <p className="text-text/70 mb-8">Confirm your new password</p>
            <form onSubmit={handleLogin} className="space-y-4">
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

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-300">
                  Confirm password
                </label>
                <Input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-accent hover:bg-accent/65 focus:ring-offset-accent focus:ring-accent mt-2 w-full rounded-lg px-4 py-3 font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Reset password
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Failed to retrieve params</h1>
          </>
        )}
      </div>
    </main>
  );
}
