import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface resetPasswordForm {
  password: string;
  repeatPassword: string;
  token: string;
  email: string;
}

export function useResetPassword() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  return useMutation({
    mutationFn: async ({ password, repeatPassword, token, email }: resetPasswordForm) => {
      if (password.length < 12) {
        throw new Error('Password must contain at least 12 characters');
      }

      if (password !== repeatPassword) {
        throw new Error('Passwords do not match');
      }

      const recaptchaToken = await executeRecaptcha?.('reset_password');

      const headers: Record<string, string> = recaptchaToken
        ? { 'x-recaptcha-token': recaptchaToken }
        : {};

      const response = await apiFetch('/auth/reset-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          password,
          token,
          email,
        }),
      });

      if (!response.success) {
        throw new Error(response.message);
      }
    },

    onSuccess: () => {
      toast.success('Successfully!');
      router.push('/auth/login');
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });
}
