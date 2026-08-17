'use client';

import { useBoardDetails } from '@/hooks/workplace/board/useBoardDetails';
import { Lane } from '@/types/lane';
import { select } from '@/types/select';
import { useDraggable } from '@dnd-kit/react';
import LaneCard from './LaneCard';

interface BoardProps {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
}

interface BoardCardProps {
  board: BoardProps;
  select: select;
}

export default function BoardCard({ board, select }: BoardCardProps) {
  const { ref } = useDraggable({
    id: board.id,
  });

  const { data: details, isLoading, error } = useBoardDetails(board.id);

  const isSelected = select.id === board.id;

  if (isLoading) {
    return (
      <div className="absolute animate-pulse rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400 shadow-xl">
        Loading board...
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute rounded-xl border border-red-900/50 bg-zinc-950 p-4 text-sm text-red-400 shadow-xl">
        Error loading board
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-key={board.id}
      className={`absolute flex flex-col gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md ${
        isSelected
          ? 'border-accent ring-accent/50 bg-zinc-900/90 ring-2 shadow-blue-500/10'
          : 'border-zinc-800/80 bg-zinc-950/90 hover:border-zinc-700'
      }`}
      style={{
        left: board.positionX,
        top: board.positionY,
      }}
    >
      {/* Board Header */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
        <h3 className="truncate text-base font-semibold tracking-wide text-zinc-100">
          {board.name}
        </h3>
        <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs font-medium text-zinc-500">
          {details?.lanes?.length || 0} columns
        </span>
      </div>

      {/* Lanes Container (Horizontal Columns) */}
      <div className="flex max-w-[80vw] items-start gap-3 overflow-x-auto pb-1">
        {details?.lanes?.map((lane: Lane) => (
          <LaneCard key={lane.id} lane={lane} />
        ))}
      </div>
    </div>
  );
}
