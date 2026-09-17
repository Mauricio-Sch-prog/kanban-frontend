import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Lane } from '@/types/lane';
import { Board } from '@/types/board';

interface useUpdateLaneProps {
  board: string;
  invalidQueries?: boolean;
}

export function useUpdateLane({ board, invalidQueries = true }: useUpdateLaneProps) {
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
    onSettled: (_updatedLane, _error, proprieties) => {
      if (invalidQueries) {
        queryClient.invalidateQueries({ queryKey: [`boardDetails:${board}`] });
      } else {
        queryClient.setQueryData<Board>([`boardDetails:${board}`], (oldBoard) => {
          if (!oldBoard) return oldBoard;
          return {
            ...oldBoard,
            lanes: oldBoard.lanes.map((lane) =>
              lane.id === proprieties.id ? { ...lane, ...proprieties } : lane
            ),
          };
        });
      }
    },
  });
}
