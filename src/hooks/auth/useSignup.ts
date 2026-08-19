import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface signupForm {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export function useSignup() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  return useMutation({
    mutationFn: async ({ name, email, password, repeatPassword }: signupForm) => {
      if (password.length < 12) {
        throw new Error('Password must contain at least 12 characters');
      }

      if (password !== repeatPassword) {
        throw new Error('Passwords do not match');
      }

      const token = await executeRecaptcha?.('signup');

      const headers: Record<string, string> = token ? { 'x-recaptcha-token': token } : {};

      const response = await apiFetch('/auth/signup', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!response.success) {
        throw new Error(response.message);
      }
    },

    onSuccess: () => {
      toast.success('Account created successfully!');
      router.push('/auth/login');
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });
}
