import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface loginForm {
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  return useMutation({
    mutationFn: async ({ email, password }: loginForm) => {
      const token = await executeRecaptcha?.('login');

      const headers: Record<string, string> = token ? { 'x-recaptcha-token': token } : {};

      const response = await apiFetch('/auth/login', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.success) {
        throw new Error(response.message);
      }
    },

    onSuccess: () => {
      toast.success('Logged successfully!');
      router.push('/auth/login');
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });
}
