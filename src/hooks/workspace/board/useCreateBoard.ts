import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

interface createBoardProps {
  name: string;
  positionX: number;
  positionY: number;
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: createBoardProps) => {
      const response = await apiFetch('/board', {
        method: 'POST',
        body: JSON.stringify({
          ...props,
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
