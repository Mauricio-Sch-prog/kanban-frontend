import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Task } from '@/types/task';
import { Board } from '@/types/board';

interface useUpdateTaskProps {
  board: string;
  invalidQueries?: boolean;
}

export function useUpdateTask({ board, invalidQueries = true }: useUpdateTaskProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proprieties: Partial<Task>) => {
      const response = await apiFetch(`/task/${proprieties.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...proprieties, id: undefined }),
      });

      if (!response.success) {
        throw new Error('Failed to update task');
      }
      return response.data;
    },
    onSettled: (_updatedTask, _error, proprieties) => {
      if (invalidQueries) {
        queryClient.invalidateQueries({ queryKey: [`boardDetails:${board}`] });
      } else {
        queryClient.setQueryData<Board>([`boardDetails:${board}`], (oldBoard) => {
          if (!oldBoard) return oldBoard;
          return {
            ...oldBoard,
            lanes: oldBoard.lanes.map((lane) => ({
              ...lane,
              tasks: lane.tasks.map((task) =>
                task.id === proprieties.id ? { ...task, ...proprieties } : task
              ),
            })),
          };
        });
      }
    },
  });
}
