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
  width: number;
  height: number;
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

  return (
    <div
      ref={ref}
      data-key={board.id}
      className={`absolute flex flex-col overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur-md ${
        isSelected
          ? 'border-accent bg-zinc-900/90 ring-2 ring-accent/50 shadow-blue-500/10'
          : 'border-zinc-800/80 bg-zinc-950/90 hover:border-zinc-700'
      }`}
      style={{
        left: board.positionX,
        top: board.positionY,
        width: board.width,
        height: board.height,
      }}
    >
      {/* Board Header */}
      <div className="flex min-w-0 shrink-0 items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
        <h3 className="min-w-0 truncate text-base font-semibold tracking-wide text-zinc-100">
          {board.name}
        </h3>

        <span className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs font-medium text-zinc-500">
          {lanes.length} columns
        </span>
      </div>

      {/* Lanes */}
      <div
        className="mt-3 grid min-h-0 flex-1 gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.max(lanes.length, 1)}, minmax(0, 1fr))`,
        }}
      >
        {lanes.map((lane: Lane) => (
          <LaneCard key={lane.id} lane={lane} />
        ))}
      </div>
    </div>
  );
}