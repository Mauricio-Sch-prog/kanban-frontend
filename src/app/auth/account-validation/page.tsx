import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AccountValidationPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AccountValidationPage({ searchParams }: AccountValidationPageProps) {
  const { status } = await searchParams;

  const isSuccess = status === 'success';

  return (
    <main className="bg-bg flex min-h-screen items-center justify-center px-4">
      <div className="border-text/10 bg-primary w-full max-w-md rounded-2xl border p-8 text-center shadow-lg">
        {isSuccess ? (
          <>
            <div className="mb-6 flex justify-center">
              <div className="bg-accent/15 flex h-16 w-16 items-center justify-center rounded-full">
                <CheckCircle2 className="text-accent h-9 w-9" />
              </div>
            </div>

            <h1 className="text-text mb-3 text-2xl font-semibold">Account verified!</h1>

            <p className="text-text/70 mb-8">
              Your email address has been successfully verified. Your account is now ready to use.
            </p>

            <Link
              href="/auth/login"
              className="bg-accent inline-flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              Continue to login
            </Link>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <XCircle className="h-9 w-9 text-red-500" />
              </div>
            </div>

            <h1 className="text-text mb-3 text-2xl font-semibold">Verification failed</h1>

            <p className="text-text/70 mb-8">
              We couldn&apos;t verify your email address. The verification link may be invalid or
              expired.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="bg-accent inline-flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                Go to login
              </Link>

              <Link
                href="/auth/signup"
                className="border-text/10 text-text hover:bg-bg inline-flex w-full items-center justify-center rounded-lg border px-5 py-3 font-medium transition-colors"
              >
                Create a new account
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
