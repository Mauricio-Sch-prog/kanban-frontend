import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';
import { Lane } from '@/types/lane';
import { Task } from '@/types/task';

interface DeleteTaskProps {
  id: string;
  board: string;
}

interface BoardDetails extends Board {
  lanes: (Lane & { tasks: Task[] })[];
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteTaskProps) => {
      const response = await apiFetch(`/task/${id}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error('Failed to remove task');
      }

      return response.data;
    },

    onMutate: async ({ id, board }: DeleteTaskProps) => {
      const queryKey = [`boardDetails:${board}`];

      await queryClient.cancelQueries({ queryKey });

      const previousBoardData = queryClient.getQueryData<BoardDetails>(queryKey);

      queryClient.setQueryData<BoardDetails | undefined>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          lanes: (old.lanes || []).map((lane) => ({
            ...lane,
            tasks: (lane.tasks || []).filter((task) => task.id !== id),
          })),
        };
      });

      return { previousBoardData };
    },

    onError: (_err, variables, context) => {
      if (context?.previousBoardData) {
        queryClient.setQueryData([`boardDetails:${variables.board}`], context.previousBoardData);
      }
    },

    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`boardDetails:${variables.board}`],
      });
    },
  });
}
