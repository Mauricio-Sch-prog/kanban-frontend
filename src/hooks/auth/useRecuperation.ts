import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export function useRecuperation() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  return useMutation({
    mutationFn: async (email: string) => {
      const token = await executeRecaptcha?.('forgot_password');

      const headers: Record<string, string> = token ? { 'x-recaptcha-token': token } : {};

      const response = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.success) {
        throw new Error(response.message);
      }
    },

    onSuccess: () => {
      toast.success(
        'If an account associated with this email exists we sent an recuperation email!'
      );
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });
}
