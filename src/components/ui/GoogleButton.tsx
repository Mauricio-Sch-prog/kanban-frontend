'use client';

import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useGoogleLogin } from '@/hooks/auth/useGoogleLogin';

export default function GoogleButton() {
  const googleLoginMutation = useGoogleLogin();

  return (
    <GoogleLogin
      onSuccess={googleLoginMutation.mutate}
      onError={() => {
        toast.error('Failed to login with Google');
      }}
    />
  );
}
