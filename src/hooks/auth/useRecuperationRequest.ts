import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { toast } from 'sonner';

export function useRecuperationRequest() {

  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.success) {
        throw new Error(response.message);
      }
    },

    onSuccess: () => {
      toast.success('Successfully!');
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });
}
