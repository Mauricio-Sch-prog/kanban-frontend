import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface resetPasswordForm {
  password: string;
  repeatPassword: string;
  token: string;
  email: string;
}

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ password, repeatPassword, token, email }: resetPasswordForm) => {
      if (password.length < 12) {
        throw new Error('Password must contain at least 12 characters');
      }

      if (password !== repeatPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await apiFetch('/auth/reset-password', {
        method: 'POST',
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
