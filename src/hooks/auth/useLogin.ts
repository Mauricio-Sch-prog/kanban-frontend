import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface loginForm {
  email: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: loginForm) => {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
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
