'use client';

import { useBoardDetails } from '@/hooks/workspace/board/useBoardDetails';
import { Lane } from '@/types/lane';
import LaneCard from './LaneCard';
import { useEffect, useRef, useState } from 'react';
import { useUpdateBoard } from '@/hooks/workspace/board/useUpdateBoard';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import { useNameEditTimer } from '@/hooks/workspace/useNameEditTimer';
import { useEditableBehavior } from '@/hooks/workspace/useEditableBehavior';
import { Board } from '@/types/board';
import { useCanvasStore } from '@/contexts/CanvasContext';
import { useSelectStore } from '@/contexts/SelectContext';

interface BoardCardProps {
  board: Board;
}

export default function BoardCard({ board }: BoardCardProps) {
  const resizeState = useRef<{
    startX: number;
    startWidth: number;
    currentWidth: number;
  } | null>(null);
  const zoom = useCanvasStore((state) => state.camera.zoom);
  const selectValue = useSelectStore((state) => state.value);

  const [width, setWidth] = useState(board.width);
  const [isResizing, setIsResizing] = useState(false);

  const getWidth = () => {
    return width > minWidth ? width : minWidth;
  };

  useEffect(() => {
    if (board.width === width) return;

    const ref = requestAnimationFrame(() => setWidth(width));

    return () => cancelAnimationFrame(ref);
  }, [board.width, width]);

  const handleResizePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsResizing(true);

    resizeState.current = {
      startX: event.clientX,
      startWidth: getWidth(),
      currentWidth: width,
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!resizeState.current) return;

      const deltaX = (event.clientX - resizeState.current.startX) / zoom;

      const newWidth = Math.max(200, resizeState.current.startWidth + deltaX);

      resizeState.current.currentWidth = newWidth;

      setWidth(newWidth);
    };

    const handlePointerUp = () => {
      if (!resizeState.current) return;

      const finalWidth = resizeState.current.currentWidth;

      updateBoardMutation.mutate({
        id: board.id,
        width: finalWidth,
      });

      resizeState.current = null;
      setIsResizing(false);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const { ref: draggableRef } = useDraggable({
    id: board.id,
    type: 'board',
  });

  const { ref: droppableRef } = useDroppable({
    id: `board-drop:${board.id}`,
    type: 'lane',
    accept: 'lane',
    data: {
      board: board.id,
    },
  });

  const { data: details, isLoading, error } = useBoardDetails(board.id);
  const isSelected = selectValue.board === board.id;

  const updateBoardMutation = useUpdateBoard();

  const updateTime = useNameEditTimer({
    id: board.id,
    initialValue: board.name,
    mutation: updateBoardMutation as Parameters<typeof useNameEditTimer>[0]['mutation'],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const editableBehavior = useEditableBehavior(inputRef);

  const name = updateTime.localName ?? details?.name ?? board.name;
  const canEdit = isSelected && editableBehavior.isEditing;

  if (isLoading) {
    return (
      <div
        ref={draggableRef}
        className="border-text/10 bg-primary text-text/70 absolute rounded-xl border p-4 text-sm shadow-xl"
        style={{
          left: board.positionX,
          top: board.positionY,
          width: width,
          height: board.height,
        }}
      >
        Loading board...
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={draggableRef}
        className="bg-primary absolute rounded-xl border border-red-900/50 p-4 text-sm text-red-400 shadow-xl"
        style={{
          left: board.positionX,
          top: board.positionY,
          width: width,
          height: board.height,
        }}
      >
        Error loading board
      </div>
    );
  }

  const lanes = details?.lanes ?? [];
  const sortedLanes = [...lanes].sort((a, b) => a.index - b.index);
  const laneAmount = lanes.length;
  const minWidth = laneAmount * 200;

  const highestTaskCount = Math.max(...lanes.map((lane: Lane) => lane.tasks?.length || 0), 0);
  const heightForTasks = highestTaskCount * 100;
  const height = heightForTasks < 100 ? 100 : heightForTasks;

  return (
    <div
      ref={!isResizing ? draggableRef : undefined}
      data-key={board.id}
      data-type="board"
      className={`absolute flex flex-col overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur-md ${
        isSelected
          ? 'border-accent ring-accent/50 bg-primary/90 shadow-accent/10 ring-2'
          : 'border-text/10 bg-primary/90 hover:border-text/30'
      }`}
      style={{
        left: board.positionX,
        top: board.positionY,
        width: getWidth(),
      }}
    >
      <div className="border-text/10 flex min-w-0 shrink-0 items-center justify-between gap-2 border-b pb-2">
        <input
          type="text"
          ref={inputRef}
          value={name}
          onChange={(e) => updateTime.setLocalName(e.target.value)}
          onMouseDown={editableBehavior.mouseDown}
          readOnly={!canEdit}
          className={`text-md text-accent rounded border-0 bg-transparent px-2 py-1 outline-none ${
            isSelected && !canEdit ? 'cursor-text' : ''
          }`}
        />
      </div>

      <div
        className="mt-3 grid min-h-0 flex-1 gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.max(lanes.length, 1)}, minmax(0, 1fr))`,
          minHeight: height,
        }}
        ref={droppableRef}
      >
        {sortedLanes.map((lane: Lane) => (
          <LaneCard key={lane.id} lane={lane} board={board.id} />
        ))}
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
