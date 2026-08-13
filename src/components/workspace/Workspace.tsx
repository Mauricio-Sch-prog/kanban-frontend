'use client';

import BoardCard from '@/components/workspace/BoardCard';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { Board } from '@/types/board';
import { useBoards } from '@/hooks/workplace/board/useBoard';
import { useUpdateBoard } from '@/hooks/workplace/board/useUpdateBoard';
import Viewport from './Viewport';
import World from './World';
import { useCanvas } from '@/hooks/workplace/useCanvas';

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

  // const { data: boards = [], isLoading, error } = useBoards();

  const boards = [
    {
      id: 'numba 1',
      name: 'numb',
      positionX: 100,
      positionY: 100,
      height: 300,
      width: 300,
    },
    {
      id: 'numba 2',
      name: 'numb',
      positionX: 200,
      positionY: 200,
      height: 300,
      width: 300,
    },
  ];

  const canvas = useCanvas(boards);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error loading boards</div>;
  // }

  return (
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
  );
}

// <DragDropProvider onDragEnd={handleDragEnd}>
//   <BoardCanvas
//     id="canvas"
//     style={{
//       width: '5000px',
//       height: '5000px',
//       transform: `translate(${camera.x}px, ${camera.y}px)`,
//     }}
//     className="relative"
//     onMouseDown={handleMouseDown}
//     onMouseMove={handleMouseMove}
//     onMouseUp={handleMouseUp}
//   >
//
//   </BoardCanvas>
// </DragDropProvider>
