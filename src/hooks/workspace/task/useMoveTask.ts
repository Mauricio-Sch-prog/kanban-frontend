import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

interface moveTaskProps {
  taskId: string;
  previousBoard: string;
  targetBoard: string;
  targetLane: string;
  targetIndex: number;
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: moveTaskProps) => {
      const response = await apiFetch(`/task/${props.taskId}/move`, {
        method: 'PATCH',
        body: JSON.stringify({ targetIndex: props.targetIndex, targetLane: props.targetLane }),
      });

      if (!response.success) {
        throw new Error('Failed to move task index');
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
