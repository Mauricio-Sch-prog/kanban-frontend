import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';
import { Lane } from '@/types/lane';
import { Task } from '@/types/task';

interface MoveTaskProps {
  taskId: string;
  previousBoard: string;
  targetBoard: string;
  targetLane: string;
  targetIndex: number;
}

interface BoardDetails extends Board {
  lanes: (Lane & { tasks: Task[] })[];
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: MoveTaskProps) => {
      const response = await apiFetch(`/task/${props.taskId}/move`, {
        method: 'PATCH',
        body: JSON.stringify({
          targetIndex: props.targetIndex,
          targetLane: props.targetLane,
        }),
      });

      if (!response.success) {
        throw new Error('Failed to move task index');
      }
      return response.data;
    },

    onMutate: async (props: MoveTaskProps) => {
      const { taskId, previousBoard, targetBoard, targetLane, targetIndex } = props;
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

      let movedTask: Task | undefined;

      const reindexTasks = (tasks: Task[] = []) =>
        tasks.map((task, idx) => ({ ...task, index: idx }));

      if (previousBoard === targetBoard) {
        queryClient.setQueryData<BoardDetails | undefined>(targetKey, (old) => {
          if (!old) return old;

          const lanesAfterRemoval = old.lanes.map((lane) => {
            const taskIndex = lane.tasks?.findIndex((t) => t.id === taskId) ?? -1;
            if (taskIndex !== -1) {
              const tasks = [...(lane.tasks || [])];
              [movedTask] = tasks.splice(taskIndex, 1);
              return { ...lane, tasks: reindexTasks(tasks) };
            }
            return lane;
          });

          if (!movedTask) return old;

          const finalLanes = lanesAfterRemoval.map((lane) => {
            if (lane.id === targetLane) {
              const tasks = [...(lane.tasks || [])];
              const taskToInsert = { ...movedTask!, laneId: targetLane };
              tasks.splice(targetIndex, 0, taskToInsert);
              return { ...lane, tasks: reindexTasks(tasks) };
            }
            return lane;
          });

          return { ...old, lanes: finalLanes };
        });
      } else {
        queryClient.setQueryData<BoardDetails | undefined>(previousKey, (old) => {
          if (!old) return old;

          const updatedLanes = old.lanes.map((lane) => {
            const taskIndex = lane.tasks?.findIndex((t) => t.id === taskId) ?? -1;
            if (taskIndex !== -1) {
              const tasks = [...(lane.tasks || [])];
              [movedTask] = tasks.splice(taskIndex, 1);
              return { ...lane, tasks: reindexTasks(tasks) };
            }
            return lane;
          });

          return { ...old, lanes: updatedLanes };
        });

        if (movedTask) {
          queryClient.setQueryData<BoardDetails | undefined>(targetKey, (old) => {
            if (!old) return old;

            const taskToInsert = { ...movedTask!, laneId: targetLane };
            const updatedLanes = old.lanes.map((lane) => {
              if (lane.id === targetLane) {
                const tasks = [...(lane.tasks || [])];
                tasks.splice(targetIndex, 0, taskToInsert);
                return { ...lane, tasks: reindexTasks(tasks) };
              }
              return lane;
            });

            return { ...old, lanes: updatedLanes };
          });
        }
      }

      return { previousTargetBoardData, previousSourceBoardData };
    },

    onError: (_err, variables, context) => {
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
