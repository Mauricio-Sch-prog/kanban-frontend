import { useBoards } from '@/hooks/workspace/board/useBoard';
import { useCanvas } from '@/hooks/workspace/useCanvas';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/dom/sortable';
import { useUpdateBoard } from '@/hooks/workspace/board/useUpdateBoard';
import { useMoveLane } from '@/hooks/workspace/lane/useMoveLane';
import { useMoveTask } from '@/hooks/workspace/task/useMoveTask';
import { Board } from '@/types/board';

export default function DraggableBehavior({ children }: React.HTMLAttributes<HTMLDivElement>) {
  const { data: boards = [] } = useBoards();
  const moveBoardMutation = useUpdateBoard(false);
  const moveLaneMutation = useMoveLane();
  const moveTaskMutation = useMoveTask();

  const canvas = useCanvas(boards);

  const handleDragEnd = async (event: DragEndEvent) => {
    if (event.canceled) return;

    const { source, transform } = event.operation;
    const { x, y } = transform;

    const board = boards.find((board: Board) => board.id === source?.id);

    if (!board) {
      console.error('Board not found:', source?.id);
      return;
    }

    const newPositionX = board.positionX + x / canvas.camera.zoom;

    const newPositionY = board.positionY + y / canvas.camera.zoom;

    moveBoardMutation.mutate({
      id: source?.id as string,
      positionX: newPositionX,
      positionY: newPositionY,
    });
  };

  return (
    <DragDropProvider
      onDragStart={() => {
        canvas.setIsDragging(true);
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation;

        if (!isSortable(source)) return;

        if (source.type === 'lane') {
          const sourceBoard = source.data.board;
          const targetBoard = target?.data.board;

          if (!targetBoard) return;

          if (sourceBoard !== targetBoard) {
            event.preventDefault();
          }
        } else if (source.type === 'task') {
          const sourceLane = source.data.lane;
          const targetLane = target?.data.lane;

          if (!targetLane) return;

          if (sourceLane !== targetLane) {
            event.preventDefault();
          }
        }
      }}
      onDragEnd={(event) => {
        canvas.setIsDragging(false);

        const { source, target } = event.operation;

        if (isSortable(source)) {
          const { index: newIndex } = source.sortable;

          if (source.type === 'lane') {
            moveLaneMutation.mutate({
              laneId: source.data.lane,
              previousBoard: source.data.board,
              targetBoard: target?.data.board,
              targetIndex: newIndex,
            });
          }

          if (source.type === 'task') {
            moveTaskMutation.mutate({
              taskId: source.data.task,
              previousBoard: source.data.board,
              targetBoard: target?.data.board,
              targetLane: target?.data.lane,
              targetIndex: newIndex,
            });
          }
        }

        if (source?.type === 'board') {
          handleDragEnd(event);
        }
      }}
    >
      {children}
    </DragDropProvider>
  );
}
