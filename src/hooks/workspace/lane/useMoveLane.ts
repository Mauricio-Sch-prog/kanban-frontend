import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';
import { Lane } from '@/types/lane';

interface MoveLaneProps {
  laneId: string;
  targetBoard: string;
  previousBoard: string;
  targetIndex: number;
}

interface BoardDetails extends Board {
  lanes: Lane[];
}

export function useMoveLane() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: MoveLaneProps) => {
      const response = await apiFetch(`/lane/${props.laneId}/move`, {
        method: 'PATCH',
        body: JSON.stringify({
          targetBoard: props.targetBoard,
          targetIndex: props.targetIndex,
        }),
      });

      if (!response.success) {
        throw new Error('Failed to move lane index');
      }
      return response.data;
    },

    onMutate: async (props: MoveLaneProps) => {
      const { laneId, targetBoard, previousBoard, targetIndex } = props;
      const targetKey = [`boardDetails:${targetBoard}`];
      const previousKey = [`boardDetails:${previousBoard}`];

      await queryClient.cancelQueries({ queryKey: targetKey });
      if (previousBoard !== targetBoard) {
        await queryClient.cancelQueries({ queryKey: previousKey });
      }

      const previousTargetBoardData = queryClient.getQueryData<BoardDetails>(targetKey);
      const previousSourceBoardData =
        previousBoard !== targetBoard
          ? queryClient.getQueryData<BoardDetails>(previousKey)
          : previousTargetBoardData;

      const reindexLanes = (lanes: Lane[]) => lanes.map((lane, idx) => ({ ...lane, index: idx }));

      if (previousBoard === targetBoard) {
        queryClient.setQueryData<BoardDetails | undefined>(targetKey, (old) => {
          if (!old) return old;

          const lanes = [...(old.lanes || [])];
          const movedLaneIndex = lanes.findIndex((l) => l.id === laneId);

          if (movedLaneIndex === -1) return old;

          const [movedLane] = lanes.splice(movedLaneIndex, 1);
          lanes.splice(targetIndex, 0, movedLane);

          return {
            ...old,
            lanes: reindexLanes(lanes),
          };
        });
      } else {
        let movedLane: Lane | undefined;
        queryClient.setQueryData<BoardDetails | undefined>(previousKey, (old) => {
          if (!old) return old;

          const lanes = [...(old.lanes || [])];
          const movedLaneIndex = lanes.findIndex((l) => l.id === laneId);

          if (movedLaneIndex === -1) return old;

          [movedLane] = lanes.splice(movedLaneIndex, 1);

          return {
            ...old,
            lanes: reindexLanes(lanes),
          };
        });

        // Add to target board
        if (movedLane) {
          const laneToInsert = { ...movedLane, boardId: targetBoard };

          queryClient.setQueryData<BoardDetails | undefined>(targetKey, (old) => {
            if (!old) return old;

            const lanes = [...(old.lanes || [])];
            lanes.splice(targetIndex, 0, laneToInsert);

            return {
              ...old,
              lanes: reindexLanes(lanes),
            };
          });
        }
      }

      return { previousTargetBoardData, previousSourceBoardData };
    },

    onError: (_err, variables, context) => {
      // Rollback source & target board caches on error
      if (context?.previousTargetBoardData) {
        queryClient.setQueryData(
          [`boardDetails:${variables.targetBoard}`],
          context.previousTargetBoardData
        );
      }
      if (context?.previousSourceBoardData && variables.previousBoard !== variables.targetBoard) {
        queryClient.setQueryData(
          [`boardDetails:${variables.previousBoard}`],
          context.previousSourceBoardData
        );
      }
    },

    onSettled: (_data, _err, variables) => {
      // Sync cache with backend state
      queryClient.invalidateQueries({
        queryKey: [`boardDetails:${variables.targetBoard}`],
      });
      if (variables.previousBoard !== variables.targetBoard) {
        queryClient.invalidateQueries({
          queryKey: [`boardDetails:${variables.previousBoard}`],
        });
      }
    },
  });
}
