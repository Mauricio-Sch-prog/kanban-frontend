import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiFetch('/auth/logout', {
        method: 'GET',
      });

      if (!response.success) {
        throw new Error(response.message);
      }
    },

    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out!');
      router.push('/auth/login');
      router.refresh();
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });
}
