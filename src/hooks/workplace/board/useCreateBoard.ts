import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const response = await apiFetch('/board', {
        method: 'POST',
        body: JSON.stringify({
          name,
        }),
      });

      if (!response.success) {
        throw new Error('Failed to create board');
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['boards'],
      });
    },
  });
}
