'use client';

import { useBoardDetails } from '@/hooks/workspace/board/useBoardDetails';
import { Lane } from '@/types/lane';
import LaneCard from './LaneCard';
import { useEffect, useRef, useState } from 'react';
import { UseSelect } from '@/hooks/workspace/useSelect';
import { useUpdateBoard } from '@/hooks/workspace/board/useUpdateBoard';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import { useNameEditTimer } from '@/hooks/workspace/useNameEditTimer';
import { useEditableBehavior } from '@/hooks/workspace/useEditableBehavior';
interface BoardProps {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}

interface BoardCardProps {
  board: BoardProps;
  useSelect: UseSelect;
}

export default function BoardCard({ board, useSelect }: BoardCardProps) {
  const { ref } = useDraggable({
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
  const isSelected = useSelect.value.board === board.id;

  const updateBoardMutation = useUpdateBoard(true);
  const updateTime = useNameEditTimer({
    targetData: {
      id: board.id,
      name: board.name,
    },
    mutation: updateBoardMutation as Parameters<typeof useNameEditTimer>[0]['mutation'],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const editableBehavior = useEditableBehavior(inputRef);

  const name = updateTime.localName ?? details?.name ?? board.name;
  const canEdit = isSelected && editableBehavior.isEditing;

  if (isLoading) {
    return (
      <div
        ref={ref}
        className="absolute rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400 shadow-xl"
        style={{
          left: board.positionX,
          top: board.positionY,
          width: board.width,
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
        ref={ref}
        className="absolute rounded-xl border border-red-900/50 bg-zinc-950 p-4 text-sm text-red-400 shadow-xl"
        style={{
          left: board.positionX,
          top: board.positionY,
          width: board.width,
          height: board.height,
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
      ref={ref}
      data-key={board.id}
      data-type="board"
      className={`absolute flex flex-col overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur-md ${
        isSelected
          ? 'border-accent ring-accent/50 bg-zinc-900/90 ring-2 shadow-blue-500/10'
          : 'border-zinc-800/80 bg-zinc-950/90 hover:border-zinc-700'
      }`}
      style={{
        left: board.positionX,
        top: board.positionY,
        width: board.width,
        height: board.height,
      }}
    >
      <div className="flex min-w-0 shrink-0 items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
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
        }}
        ref={droppableRef}
      >
        {sortedLanes.map((lane: Lane) => (
          <LaneCard key={lane.id} lane={lane} board={board.id} />
        ))}
      </div>
    </div>
  );
}
