import { useState } from 'react'; // <-- Add this
import { useCanvas } from '@/hooks/workspace/useCanvas';
import { DragDropProvider, DragEndEvent, DragOverlay } from '@dnd-kit/react'; // <-- Import DragOverlay
import { isSortable } from '@dnd-kit/dom/sortable';
import { useUpdateBoard } from '@/hooks/workspace/board/useUpdateBoard';
import { useMoveLane } from '@/hooks/workspace/lane/useMoveLane';
import { useMoveTask } from '@/hooks/workspace/task/useMoveTask';
import { Board } from '@/types/board';
import { useBoardContext } from '@/contexts/BoardContext';
import BoardCard from '@/components/workspace/cards/BoardCard'; // <-- Import your BoardCard

export default function DraggableBehavior({ children }: React.HTMLAttributes<HTMLDivElement>) {
  const { boards = [] as Board[] } = useBoardContext();
  const moveBoardMutation = useUpdateBoard();
  const moveLaneMutation = useMoveLane();
  const moveTaskMutation = useMoveTask();

  const canvas = useCanvas(boards);

  type ActiveItem = {
    id: string;
    type: string;
    data?: unknown;
  };

  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);

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
      onDragStart={(event) => {
        canvas.setIsDragging(true);

        const { source } = event.operation;

        if (!source) {
          return;
        }

        setActiveItem({
          id: source.id as string,
          type: source.type as string,
          data: source.data,
        });
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation;

        if (!source || !isSortable(source)) return;

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
        setActiveItem(null);

        const { source, target } = event.operation;

        if (isSortable(source)) {
          let { index: newIndex } = source.sortable;
          if (source.data.board !== target?.data.board) {
            newIndex = 0;
          }
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

      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div
            style={{
              transform: `scale(${canvas.camera.zoom})`,
              transformOrigin: '0 0',
              width: `${100 / canvas.camera.zoom}%`,
              height: `${100 / canvas.camera.zoom}%`,
              opacity: 0.9,
              boxShadow: '0px 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            {activeItem.type === 'board' && (
              <BoardCard
                board={boards.find((b: Board) => b.id === activeItem.id)!}
                isOverlay={true} // <-- Add this!
              />
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DragDropProvider>
  );
}
