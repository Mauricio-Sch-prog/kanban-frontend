import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

interface createProps {
  board: string;
  name: string;
}

export function useCreateLane() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ board, name }: createProps) => {
      const response = await apiFetch('/lane', {
        method: 'POST',
        body: JSON.stringify({
          board,
          name,
        }),
      });

      if (!response.success) {
        throw new Error('Failed to create lane');
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
