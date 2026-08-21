import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

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

      console.log(response.header);
      
    },

    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged successfully!');
      router.push('/home');
      router.refresh();
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });
}
