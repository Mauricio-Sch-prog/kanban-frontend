import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';

export function useUpdateBoard(isDetailsOnly: boolean = false) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proprieties: Partial<Board>) => {
      const response = await apiFetch(`/board/${proprieties.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...proprieties, id: undefined }),
      });

      if (!response.success) {
        throw new Error('Failed to update board position');
      }
      return response.data;
    },
    onMutate: async (updatedBoard) => {
      await queryClient.cancelQueries({ queryKey: ['boards'] });

      const previousBoards = queryClient.getQueryData<Board[]>(['boards']);

      queryClient.setQueryData<Board[]>(['boards'], (old = []) =>
        old.map((board) =>
          board.id === updatedBoard.id
            ? {
                ...board,
                ...(updatedBoard.positionX !== undefined && { positionX: updatedBoard.positionX }),
                ...(updatedBoard.positionY !== undefined && { positionY: updatedBoard.positionY }),
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

    onSettled: (_data, err, variables) => {
      if (isDetailsOnly) {
        queryClient.invalidateQueries({ queryKey: [`boardDetails:${variables.id}`] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['boards'] });
      }
    },
  });
}
