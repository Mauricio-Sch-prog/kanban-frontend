import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';
import { Lane } from '@/types/lane';

interface BoardDetails extends Board {
  lanes: Lane[];
}

interface CreateLaneProps {
  id?: string;
  board: string;
  name: string;
  index?: number;
}

export function useCreateLane() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: CreateLaneProps) => {
      const payload = {
        ...props,
        id: props.id ?? crypto.randomUUID(),
      };

      const response = await apiFetch('/lane', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.success) {
        throw new Error('Failed to create lane');
      }

      return response.data;
    },

    onMutate: async (newLaneProps) => {
      const queryKey = [`boardDetails:${newLaneProps.board}`];

      await queryClient.cancelQueries({ queryKey });

      const previousBoard = queryClient.getQueryData<BoardDetails>(queryKey);

      if (!newLaneProps.id) {
        newLaneProps.id = crypto.randomUUID();
      }

      const optimisticLane: Partial<Lane> = {
        id: newLaneProps.id,
        name: newLaneProps.name,
        index: newLaneProps.index ?? previousBoard?.lanes?.length ?? 0,
        tasks: [],
      };

      queryClient.setQueryData<BoardDetails>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          lanes: [...(old.lanes || []), optimisticLane as Lane],
        };
      });

      return { previousBoard };
    },

    onError: (_err, variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData([`boardDetails:${variables.board}`], context.previousBoard);
      }
    },

    onSuccess: (responseData, variables) => {
      // Reconcile optimistic lane with server response data
      queryClient.setQueryData<BoardDetails>([`boardDetails:${variables.board}`], (old) => {
        if (!old) return old;
        return {
          ...old,
          lanes: old.lanes.map((lane) =>
            lane.id === variables.id ? { ...lane, ...responseData } : lane
          ),
        };
      });
    },

    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`boardDetails:${variables.board}`],
      });
    },
  });
}
