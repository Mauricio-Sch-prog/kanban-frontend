'use client';

import BoardCard from '@/components/workspace/cards/BoardCard';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { Board } from '@/types/board';
import { useBoards } from '@/hooks/workplace/board/useBoard';
import { useUpdateBoard } from '@/hooks/workplace/board/useUpdateBoard';
import Viewport from './Viewport';
import World from './World';
import { useCanvas } from '@/hooks/workplace/useCanvas';
import { useDisableBrowserZoom } from '@/hooks/workplace/useDisableBrowserZoom';

export default function Workspace() {
  const updateBoardMutation = useUpdateBoard();

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
    updateBoardMutation.mutate({
      id: source?.id as string,
      positionX: newPositionX,
      positionY: newPositionY,
    });
  };

  const { data: boards = [], isLoading, error } = useBoards();

  const canvas = useCanvas(boards);

  useDisableBrowserZoom();

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
      onDragEnd={(event) => {
        canvas.setIsDragging(false);

        handleDragEnd(event);
      }}
      onDragCancel={() => {
        canvas.setIsDragging(false);
      }}
    >
      <Viewport
        onPointerDown={canvas.startPan}
        onPointerMove={canvas.pan}
        onPointerUp={canvas.stopPan}
        onPointerCancel={canvas.stopPan}
        onWheel={canvas.zoomAt}
      >
        <World camera={canvas.camera}>
          {boards.map((board: Board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </World>
      </Viewport>
    </DragDropProvider>
  );
}
