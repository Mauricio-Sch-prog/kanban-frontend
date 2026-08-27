import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

export function useBoardDetails(boardId: string) {
  return useQuery({
    queryKey: [`boardDetails:${boardId}`, boardId],

    queryFn: async () => {
      const response = await apiFetch(`/board/${boardId}/details`, {
        method: 'GET',
      });

      if (!response.success) {
        throw new Error('Failed to fetch board details');
      }

      return response.data;
    },
  });
}
