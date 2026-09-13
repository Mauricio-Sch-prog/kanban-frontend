import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';

interface CreateBoardProps {
  id?: string;
  name: string;
  positionX: number;
  positionY: number;
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: CreateBoardProps) => {
      if (!props.id) {
        props.id = crypto.randomUUID();
      }

      const response = await apiFetch('/board', {
        method: 'POST',
        body: JSON.stringify(props),
      });

      if (!response.success) {
        throw new Error('Failed to create board');
      }

      return response.data;
    },

    onMutate: async (newBoard) => {
      await queryClient.cancelQueries({ queryKey: ['boards'] });

      const previousBoards = queryClient.getQueryData<Board[]>(['boards']);

      if (!newBoard.id) {
        newBoard.id = crypto.randomUUID();
      }

      queryClient.setQueryData<Board[]>(['boards'], (old = []) => [...old, newBoard as Board]);

      return { previousBoards };
    },

    onError: (_err, _newBoard, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(['boards'], context.previousBoards);
      }
    },

    onSuccess: (responseData, variables) => {
      queryClient.setQueryData<Board[]>(['boards'], (old = []) =>
        old.map((board) => (board.id === variables.id ? { ...board, ...responseData } : board))
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}
