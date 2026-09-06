'use client';

import BoardCard from '@/components/workspace/cards/BoardCard';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { Board } from '@/types/board';
import { useBoards } from '@/hooks/workspace/board/useBoard';
import { useUpdateBoard } from '@/hooks/workspace/board/useUpdateBoard';
import Viewport from './Viewport';
import World from './World';
import { useCanvas } from '@/hooks/workspace/useCanvas';
import useSelect from '@/hooks/workspace/useSelect';
import AccessibleContextMenu from './ContextMenu/ContextMenu';
import { useDeleteBoard } from '@/hooks/workspace/board/useDeleteBoard';
import { isSortable } from '@dnd-kit/dom/sortable';
import { useMoveLane } from '@/hooks/workspace/lane/useMoveLane';
import { useMoveTask } from '@/hooks/workspace/task/useMoveTask';
import { useDeleteLane } from '@/hooks/workspace/lane/useDeleteLane';
import { useDeleteTask } from '@/hooks/workspace/task/useDeleteTask';
import { CanvasProvider } from '@/contexts/CanvasContext';

export default function Workspace() {
  return (
    <CanvasProvider>
      <WorkspaceContent />
    </CanvasProvider>
  );
}

function WorkspaceContent() {
  const moveBoardMutation = useUpdateBoard(false);

  const deleteBoardMutation = useDeleteBoard();
  const deleteLaneMutation = useDeleteLane();
  const deleteTaskMutation = useDeleteTask();

  const moveLaneMutation = useMoveLane();
  const moveTaskMutation = useMoveTask();

  const { data: boards = [], isLoading, error } = useBoards();

  const sortedBoards = [...boards].sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  );

  const canvas = useCanvas(sortedBoards);
  const select = useSelect();

  const handleDragEnd = async (event: DragEndEvent) => {
    if (event.canceled) return;

    const { source, transform } = event.operation;
    const { x, y } = transform;

    const board = sortedBoards.find((board: Board) => board.id === source?.id);

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

  const handleDelete = async () => {
    if (select.value.type === 'board') {
      deleteBoardMutation.mutate(select.value.id);
    }

    if (select.value.type === 'lane') {
      deleteLaneMutation.mutate({
        id: select.value.id,
        board: select.value.board,
      });
    }

    if (select.value.type === 'task') {
      deleteTaskMutation.mutate({
        id: select.value.id,
        board: select.value.board,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading boards</div>;
  }

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
      <Viewport>
        <AccessibleContextMenu select={select} onDelete={handleDelete}>
          <World>
            {sortedBoards.map((board: Board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </World>
        </AccessibleContextMenu>
      </Viewport>
    </DragDropProvider>
  );
}
