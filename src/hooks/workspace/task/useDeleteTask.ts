import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

interface DeleteTaskProps {
  id: string;
  board: string;
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, board }: DeleteTaskProps) => {
      const response = await apiFetch(`/task/${id}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error('Failed to remove task');
      }

      return response.data;
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [`boardDetails:${variables.board}`] });
    },
  });
}
