import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

interface DeleteLaneProps {
  id: string;
  board: string;
}

export function useDeleteLane() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, board }: DeleteLaneProps) => {
      const response = await apiFetch(`/lane/${id}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error('Failed to remove lane');
      }

      return response.data;
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [`boardDetails:${variables.board}`] });
    },
  });
}
