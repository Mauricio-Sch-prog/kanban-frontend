'use client';

import { useBoardDetails } from '@/hooks/workspace/board/useBoardDetails';
import { Lane } from '@/types/lane';
import LaneCard from './LaneCard';
import { useEffect, useRef, CSSProperties, ComponentPropsWithoutRef } from 'react';
import { useUpdateBoard } from '@/hooks/workspace/board/useUpdateBoard';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import { useNameEditTimer } from '@/hooks/workspace/useNameEditTimer';
import { useEditableBehavior } from '@/hooks/workspace/useEditableBehavior';
import { Board } from '@/types/board';
import { useCardDisplayData } from '@/hooks/workspace/useCardDisplay';

interface BoardCardProps extends ComponentPropsWithoutRef<'div'> {
  board: Board;
  isOverlay?: boolean;
}

export default function BoardCard({ board, isOverlay = false }: BoardCardProps) {
  const { data: details, isLoading, error } = useBoardDetails(board.id);

  const { updateBoard, useBoardDisplay } = useCardDisplayData();

  const boardRef = useRef<HTMLDivElement | null>(null);

  const setBoardElementRef = (node: HTMLDivElement | null) => {
    boardRef.current = node;

    if (!isOverlay) {
      draggableRef(node);
    }
  };

  useEffect(() => {
    if (!isLoading && details) {
      updateBoard(details);
    }
  }, [details, isLoading, updateBoard]);

  const { width, isSelected, canEdit, isResizing, handleResizePointerDown, style } =
    useBoardDisplay(board, boardRef, isLoading, isOverlay);

  const { ref: draggableRef, isDragging } = useDraggable({
    id: board.id,
    type: 'board',
    data: {
      board: board.id,
    },
  });

  const { ref: droppableRef } = useDroppable({
    id: `board-drop:${board.id}`,
    type: 'lane',
    accept: 'lane',
    data: {
      board: board.id,
    },
  });

  const finalStyle = {
    ...style,
    ...(isOverlay
      ? {
          left: 0,
          top: 0,
          transform: 'none',
          margin: 0,
        }
      : {}),
    ...(isDragging && !isOverlay
      ? {
          opacity: 0,
          pointerEvents: 'none',
        }
      : {}),
  };

  const updateBoardMutation = useUpdateBoard();

  const updateTime = useNameEditTimer({
    id: board.id,
    initialValue: board.name,
    mutation: updateBoardMutation as Parameters<typeof useNameEditTimer>[0]['mutation'],
    maxChar: 50,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const editableBehavior = useEditableBehavior(inputRef);

  const name = updateTime.localName ?? details?.name ?? board.name;

  if (isLoading) {
    return (
      <div
        ref={!isResizing && !isOverlay ? draggableRef : undefined}
        className="border-text/10 bg-primary text-text/70 absolute rounded-xl border p-4 text-sm shadow-xl"
        style={{
          left: isOverlay ? 0 : board.positionX,
          top: isOverlay ? 0 : board.positionY,
          width,
          ...(isDragging && !isOverlay ? { opacity: 0 } : {}),
        }}
      >
        Loading board...
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={!isResizing && !isOverlay ? draggableRef : undefined}
        className="bg-primary absolute rounded-xl border border-red-900/50 p-4 text-sm text-red-400 shadow-xl"
        style={{
          left: isOverlay ? 0 : board.positionX,
          top: isOverlay ? 0 : board.positionY,
          width,
          ...(isDragging && !isOverlay ? { opacity: 0 } : {}),
        }}
      >
        Error loading board
      </div>
    );
  }

  const lanes = details?.lanes ?? [];

  const sortedLanes = [...lanes].sort((a, b) => a.index - b.index);

  return (
    <div
      ref={!isResizing ? setBoardElementRef : undefined}
      data-key={board.id}
      data-type="board"
      className={`${isOverlay ? 'relative' : 'absolute'} flex flex-col rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-colors ${
        isSelected
          ? 'border-accent ring-accent/50 bg-primary/90 shadow-accent/10 ring-2'
          : 'border-text/10 bg-primary/90 hover:border-text/30 select-none'
      }`}
      style={finalStyle as CSSProperties}
    >
      <div className="border-text/10 flex min-w-0 shrink-0 items-center justify-center gap-2 border-b pb-2 select-none">
        {canEdit ? (
          <input
            type="text"
            ref={inputRef}
            value={name}
            onChange={(e) => updateTime.setLocalName(e.target.value)}
            onMouseDown={editableBehavior.mouseDown}
            readOnly={!canEdit}
            className="text-accent field-sizing-content max-w-full rounded border-0 bg-transparent px-2 py-1 text-center text-lg outline-none"
          />
        ) : (
          <div className="text-accent cursor-grab truncate px-2 py-1 text-center text-lg select-none">
            {name}
          </div>
        )}
      </div>

      <div
        className="mt-3 grid w-full min-w-0 items-stretch gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.max(lanes.length, 1)}, minmax(0, 1fr))`,
        }}
        ref={droppableRef}
      >
        {sortedLanes.map((lane: Lane) => (
          <LaneCard key={lane.id} lane={lane} board={board.id} />
        ))}

        {lanes.length === 0 && (
          <div className="border-text/20 text-text/40 flex h-full min-h-30 w-full items-center justify-center rounded-lg border-2 border-dashed text-xs select-none">
            Drop lane here
          </div>
        )}
      </div>

      <div
        onPointerDown={handleResizePointerDown}
        className="absolute right-0 bottom-0 h-5 w-5 cursor-se-resize opacity-0 transition-opacity hover:opacity-100"
      >
        <div className="border-text/50 absolute right-1 bottom-1 h-2 w-2 rounded-sm border-r-2 border-b-2" />
      </div>
    </div>
  );
}
