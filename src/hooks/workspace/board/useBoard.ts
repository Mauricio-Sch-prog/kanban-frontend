import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],

    queryFn: async () => {
      const response = await apiFetch('/board', {
        method: 'GET',
      });

      if (!response.success) {
        throw new Error('Failed to fetch boards');
      }

      return response.data.data;
    },
  });
}
