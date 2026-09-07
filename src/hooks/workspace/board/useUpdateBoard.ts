import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (properties: Partial<Board>) => {
      const response = await apiFetch(`/board/${properties.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...properties, id: undefined }),
      });

      if (!response.success) {
        throw new Error('Failed to update board');
      }
      return response.data;
    },

    onMutate: (updatedBoard) => {
      queryClient.cancelQueries({ queryKey: ['boards'] });

      const previousBoards = queryClient.getQueryData<Board[]>(['boards']);

      queryClient.setQueryData<Board[]>(['boards'], (old = []) =>
        old.map((board) =>
          board.id === updatedBoard.id
            ? {
                ...board,
                ...updatedBoard,
              }
            : board
        )
      );

      return { previousBoards };
    },

    onError: (err, newBoard, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(['boards'], context.previousBoards);
      }
    },

    onSuccess: (responseData, variables) => {
      queryClient.setQueryData<Board[]>(['boards'], (old = []) =>
        old.map((board) => (board.id === variables.id ? { ...board, ...responseData } : board))
      );
    },

    onSettled: (_data, err, variables) => {
      queryClient.invalidateQueries({ queryKey: [`boardDetails:${variables.id}`] });
    },
  });
}
