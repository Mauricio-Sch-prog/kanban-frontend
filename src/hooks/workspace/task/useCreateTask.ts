import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

interface createProps {
  board: string;
  lane: string;
  title: string;
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ board, lane, title }: createProps) => {
      const response = await apiFetch('/task', {
        method: 'POST',
        body: JSON.stringify({
          lane,
          title,
        }),
      });

      if (!response.success) {
        throw new Error('Failed to create task');
      }

      return response.data;
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`boardDetails:${variables.board}`],
      });
    },
  });
}
