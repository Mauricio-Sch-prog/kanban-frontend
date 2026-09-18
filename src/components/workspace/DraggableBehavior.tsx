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
import LaneCard from './cards/LaneCard';
import { Lane } from '@/types/lane';
import { Task } from '@/types/task';
import TaskCard from './cards/TaskCard';
import { useCardDisplayStore } from '@/contexts/CardDisplayContext';

export default function DraggableBehavior({ children }: React.HTMLAttributes<HTMLDivElement>) {
  const { boards = [] as Board[] } = useBoardContext();
  const moveBoardMutation = useUpdateBoard();
  const moveLaneMutation = useMoveLane();
  const moveTaskMutation = useMoveTask();

  const cards = useCardDisplayStore((state) => state.cards);

  const canvas = useCanvas(cards);

  type ActiveItem = {
    id: string;
    type: string;
    dimensions?: { width: number; height: number };
    data?: {
      board?: string;
      lane?: string;
      task?: string;
      cardData?: Lane | Task;
      [key: string]: unknown;
    };
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

        const element = document.querySelector(`[data-key="${source.id}"]`) as HTMLElement | null;
        const dimensions = element
          ? { width: element.offsetWidth, height: element.offsetHeight }
          : undefined;

        setActiveItem({
          id: source.id as string,
          type: source.type as string,
          data: source.data,
          dimensions,
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
              opacity: 0.95,
            }}
          >
            {activeItem.type === 'board' && (
              <BoardCard
                board={boards.find((b: Board) => b.id === activeItem.id)!}
                isOverlay={true}
              />
            )}

            {activeItem.type === 'lane' &&
              (() => {
                const laneData = activeItem.data?.cardData as Lane | undefined;
                const boardId = activeItem.data?.board as string | undefined;

                if (!laneData || !boardId) return null;

                return (
                  <LaneCard
                    lane={laneData}
                    board={boardId}
                    isOverlay={true}
                    style={{
                      width: activeItem.dimensions?.width,
                      height: activeItem.dimensions?.height,
                    }}
                  />
                );
              })()}

            {activeItem.type === 'task' &&
              (() => {
                const taskData = activeItem.data?.cardData as Task | undefined;
                const boardId = activeItem.data?.board as string | undefined;

                if (!taskData || !boardId) return null;

                return (
                  <TaskCard
                    task={taskData}
                    lane={taskData.lane}
                    board={boardId}
                    isOverlay={true}
                    style={{
                      width: activeItem.dimensions?.width,
                      height: activeItem.dimensions?.height,
                    }}
                  />
                );
              })()}
          </div>
        ) : null}
      </DragOverlay>
    </DragDropProvider>
  );
}
