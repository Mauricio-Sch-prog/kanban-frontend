'use client';

import BoardCanvas from '@/components/workspace/BoardCanvas';
import BoardCard from '@/components/workspace/BoardCard';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { Board } from '@/types/board';
import { useBoards } from '@/hooks/board/useBoard';
import { useUpdateBoard } from '@/hooks/board/useUpdateBoard';

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
    const newPositionX = board.positionX + x;
    const newPositionY = board.positionY + y;
    updateBoardMutation.mutate({
      id: source?.id as string,
      positionX: newPositionX,
      positionY: newPositionY,
    });
  };

  const { data: boards = [], isLoading, error } = useBoards();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading boards</div>;
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <BoardCanvas id="a">
        {boards.map((board: Board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </BoardCanvas>
    </DragDropProvider>
  );
}
