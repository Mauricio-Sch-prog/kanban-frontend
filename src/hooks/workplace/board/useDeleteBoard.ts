import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiFetch(`/board/${id}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error('Failed to remove board');
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
