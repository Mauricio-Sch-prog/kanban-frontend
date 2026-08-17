import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface signupForm {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ name, email, password, repeatPassword }: signupForm) => {
      if (password.length < 12) {
        throw new Error('Password must contain at least 12 characters');
      }

      if (password !== repeatPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await apiFetch('/auth/signup', {
        method: 'POST',
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
