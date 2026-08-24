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
        // Force the Google iframe to stretch full-width or maintain consistent width
        width="100%"
        theme="filled_black" // or "outline" / "filled_blue" depending on your design
        shape="rectangular"
        size="large"
      />
    </div>
  );
}
