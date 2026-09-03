import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Task } from '@/types/task';

export function useUpdateTask(board: string) {
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [`boardDetails:${board}`] });
    },
  });
}
