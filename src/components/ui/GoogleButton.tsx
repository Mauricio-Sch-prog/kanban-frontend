'use client';

import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useGoogleLogin } from '@/hooks/auth/useGoogleLogin';

export default function GoogleButton() {
  const googleLoginMutation = useGoogleLogin();

  return (
    <div className="flex w-full justify-center">
      <GoogleLogin
        onSuccess={googleLoginMutation.mutate}
        onError={() => {
          toast.error('Failed to login with Google');
        }}
        width="100%"
        theme='outline'
        shape="rectangular"
        size="large"
      />
    </div>
  );
}
