'use client';

import BoardCard from '@/components/workspace/cards/BoardCard';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { Board } from '@/types/board';
import { useBoards } from '@/hooks/workspace/board/useBoard';
import { useUpdateBoard } from '@/hooks/workspace/board/useUpdateBoard';
import Viewport from './Viewport';
import World from './World';
import { useCanvas } from '@/hooks/workspace/useCanvas';
import { useDisableBrowserZoom } from '@/hooks/workspace/useDisableBrowserZoom';
import useSelect from '@/hooks/workspace/useSelect';
import AccessibleContextMenu from './ContextMenu/ContextMenu';
import { useDeleteBoard } from '@/hooks/workspace/board/useDeleteBoard';
import { isSortable } from '@dnd-kit/dom/sortable';
import { useMoveLane } from '@/hooks/workspace/lane/useMoveLane';

export default function Workspace() {
  const updateBoardMutation = useUpdateBoard(true);
  const deleteBoardMutation = useDeleteBoard();
  const moveLaneMutation = useMoveLane();

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
  const select = useSelect();

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

      onDragOver={(event) => {
        const { source, target } = event.operation;

        if (!isSortable(source)) return;
        if (source.type !== 'lane') return;

        const sourceBoard = source.data.board;
        const targetBoard = target?.data.board;

        if (!targetBoard) return;

        if (sourceBoard !== targetBoard) {
          event.preventDefault();
        }
      }}

      onDragEnd={(event) => {
        canvas.setIsDragging(false);

        const { source, target } = event.operation;

        if (isSortable(source)) {
          const { initialIndex, index: newIndex } = source.sortable;

          console.log(`moving from ${initialIndex} to ${newIndex}`);

          if (source.type === 'lane') {
            moveLaneMutation.mutate({
              laneId: source.data.lane,
              previousBoard: source.data.board,
              targetBoard: target?.data.board,
              targetIndex: newIndex,
            });
          }
          if (source.type === 'task') {
            const directTargetId = target?.data.lane;
          }
        }

        if (source?.type === 'board') handleDragEnd(event);
      }}
    >
      <Viewport
        onPointerDown={(e) => {
          const isSelectable = select.selectElement(e);
          if (!isSelectable) canvas.startPan(e);
        }}
        onContextMenuCapture={(e) => {
          select.selectFromTarget(e.target);
        }}
        onPointerMove={canvas.pan}
        onPointerUp={canvas.stopPan}
        onPointerCancel={canvas.stopPan}
        onWheel={canvas.zoomAt}
      >
        <AccessibleContextMenu
          select={select}
          onDelete={(id) => {
            deleteBoardMutation.mutate(id);
          }}
        >
          <World camera={canvas.camera}>
            {boards.map((board: Board) => (
              <BoardCard key={board.id} board={board} useSelect={select} />
            ))}
          </World>
        </AccessibleContextMenu>
      </Viewport>
    </DragDropProvider>
  );
}
