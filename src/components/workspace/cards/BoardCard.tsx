'use client';

import { useBoardDetails } from '@/hooks/workspace/board/useBoardDetails';
import { Lane } from '@/types/lane';
import LaneCard from './LaneCard';
import { useEffect, useState } from 'react';
import { UseSelect } from '@/hooks/workspace/useSelect';
import { useUpdateBoard } from '@/hooks/workspace/board/useUpdateBoard';
import { useDraggable, useDroppable } from '@dnd-kit/react';
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
  });

  const { data: details, isLoading, error } = useBoardDetails(board.id);

  const updateBoardMutation = useUpdateBoard(true);

  const isSelected = useSelect.value.id === board.id;
  const [localName, setLocalName] = useState<string | null>(null);
  const name = localName ?? details?.name ?? board.name;

  useEffect(() => {
    if (localName === null) return;

    const currentName = details?.name ?? board.name;
    if (localName.trim() === currentName) return;

    const handler = setTimeout(() => {
      updateBoardMutation.mutate({
        id: board.id,
        name: localName.trim(),
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [localName, board.id, details?.name, board.name, updateBoardMutation]);

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
          value={name}
          onChange={(e) => setLocalName(e.target.value)}
          className="text-md text-accent rounded border-0 bg-transparent px-2 py-1"
          disabled={!isSelected}
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
