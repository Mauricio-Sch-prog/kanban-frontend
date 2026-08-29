import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

interface moveLaneProps {
  laneId: string;
  targetBoard: string;
  previousBoard: string;
  targetIndex: number;
}

export function useMoveLane() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: moveLaneProps) => {
      const response = await apiFetch(`/lane/${props.laneId}/move`, {
        method: 'PATCH',
        body: JSON.stringify({ ...props, laneId: undefined, previousBoard: undefined }),
      });

      if (!response.success) {
        throw new Error('Failed to move lane index');
      }
      return response.data;
    },
    onSettled: (_data, err, variables) => {
      if (variables.previousBoard === variables.targetBoard) {
        queryClient.invalidateQueries({ queryKey: [`boardDetails:${variables.targetBoard}`] });
      } else {
        queryClient.invalidateQueries({ queryKey: [`boardDetails:${variables.targetBoard}`] });
        queryClient.invalidateQueries({ queryKey: [`boardDetails:${variables.previousBoard}`] });
      }
    },
  });
}
