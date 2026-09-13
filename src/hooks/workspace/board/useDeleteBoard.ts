import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';

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

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['boards'] });

      const previousBoards = queryClient.getQueryData<Board[]>(['boards']);

      queryClient.setQueryData<Board[]>(['boards'], (old = []) =>
        old.filter((board) => board.id !== id)
      );

      return { previousBoards };
    },

    onError: (_err, _id, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(['boards'], context.previousBoards);
      }
    },

    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.removeQueries({ queryKey: [`boardDetails:${id}`] });
    },
  });
}