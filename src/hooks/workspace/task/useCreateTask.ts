import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Board } from '@/types/board';
import { Lane } from '@/types/lane';
import { Task } from '@/types/task';

interface CreateTaskProps {
  id?: string;
  board: string;
  lane: string;
  title: string;
}

interface BoardDetails extends Board {
  lanes: Lane[];
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: CreateTaskProps) => {
      if (!props.id) {
        props.id = crypto.randomUUID();
      }

      const response = await apiFetch('/task', {
        method: 'POST',
        body: JSON.stringify({
          id: props.id,
          lane: props.lane,
          title: props.title,
        }),
      });

      if (!response.success) {
        throw new Error('Failed to create task');
      }

      return response.data;
    },

    onMutate: async (newTask) => {
      const queryKey = [`boardDetails:${newTask.board}`];

      await queryClient.cancelQueries({ queryKey });

      const previousBoardData = queryClient.getQueryData<BoardDetails>(queryKey);

      if (!newTask.id) {
        newTask.id = crypto.randomUUID();
      }

      queryClient.setQueryData<BoardDetails | undefined>(queryKey, (old) => {
        if (!old) return old;

        const updatedLanes = old.lanes.map((lane) => {
          if (lane.id === newTask.lane) {
            const currentTasks = lane.tasks || [];
            const optimisticTask: Task = {
              id: newTask.id!,
              title: newTask.title,
              description: '',
              lane: newTask.lane,
              index: currentTasks.length,
            };

            return {
              ...lane,
              tasks: [...currentTasks, optimisticTask],
            };
          }
          return lane;
        });

        return {
          ...old,
          lanes: updatedLanes,
        };
      });

      return { previousBoardData };
    },

    onError: (_err, variables, context) => {
      if (context?.previousBoardData) {
        queryClient.setQueryData([`boardDetails:${variables.board}`], context.previousBoardData);
      }
    },

    onSuccess: (responseData, variables) => {
      queryClient.setQueryData<BoardDetails | undefined>(
        [`boardDetails:${variables.board}`],
        (old) => {
          if (!old) return old;

          const updatedLanes = old.lanes.map((lane) => {
            if (lane.id === variables.lane) {
              return {
                ...lane,
                tasks: lane.tasks.map((task) =>
                  task.id === variables.id ? { ...task, ...responseData } : task
                ),
              };
            }
            return lane;
          });

          return {
            ...old,
            lanes: updatedLanes,
          };
        }
      );
    },

    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`boardDetails:${variables.board}`],
      });
    },
  });
}
