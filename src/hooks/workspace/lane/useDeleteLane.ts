import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';

interface DeleteLaneProps {
  id: string;
  board: string;
}

export function useDeleteLane() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteLaneProps) => {
      const response = await apiFetch(`/lane/${id}`, {
        method: 'DELETE',
      });

      if (!response.success) {
        throw new Error('Failed to remove lane');
      }

      return response.data;
    },

    onMutate: async ({ id, board }) => {
      const queryKey = [`boardDetails:${board}`];

      await queryClient.cancelQueries({ queryKey });

      const previousBoardDetails = queryClient.getQueryData<Board>(queryKey);

      if (previousBoardDetails) {
        queryClient.setQueryData<Board>(queryKey, {
          ...previousBoardDetails,
          lanes: previousBoardDetails.lanes?.filter((lane) => lane.id !== id) ?? [],
        });
      }

      return { previousBoardDetails };
    },

    onError: (_err, { board }, context) => {
      if (context?.previousBoardDetails) {
        queryClient.setQueryData([`boardDetails:${board}`], context.previousBoardDetails);
      }
    },

    onSettled: (_data, _err, { board }) => {
      queryClient.invalidateQueries({ queryKey: [`boardDetails:${board}`] });
    },
  });
}
