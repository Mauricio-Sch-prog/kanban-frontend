import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await apiFetch('/auth/logout', {
        method: 'GET',
      });

      if (!response.success) {
        throw new Error(response.message);
      }
      router.push('/auth/login');
    },

    onSuccess: () => {
      toast.success('Logged out!');
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });
}
