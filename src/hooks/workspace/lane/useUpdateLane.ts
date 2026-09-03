import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Lane } from '@/types/lane';

export function useUpdateLane(board: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proprieties: Partial<Lane>) => {
      const response = await apiFetch(`/lane/${proprieties.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...proprieties, id: undefined }),
      });

      if (!response.success) {
        throw new Error('Failed to update lane');
      }
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [`boardDetails:${board}`] });
    },
  });
}
