import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

export function useAccountInfo() {
  return useQuery({
    queryKey: ['user'],

    queryFn: async () => {
      const response = await apiFetch('/auth', {
        method: 'GET',
      });

      if (!response.success) {
        throw new Error('Failed to fetch account details');
      }

      return response.data;
    },
  });
}
