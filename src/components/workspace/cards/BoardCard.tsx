'use client';

import { useDraggable } from '@dnd-kit/react';

interface BoardProps {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
}
interface BoardCardProps {
  board: BoardProps;
  select: string | null;
}

export default function BoardCard({ board, select }: BoardCardProps) {
  const { ref } = useDraggable({
    id: board.id,
  });

  return (
    <div
      ref={ref}
      // onPointerDown={(e) => {
      //   e.stopPropagation();
      // }}
      data-key={board.id}
      className={`absolute w-64 rounded-lg border p-4 shadow ${
        select === board.id
          ? 'border-blue-500 ring-2 ring-blue-500 bg-zinc-900'
          : 'border-zinc-800 bg-black'
      }`}
      style={{
        position: 'absolute',
        left: board.positionX,
        top: board.positionY,
      }}
    >
      <div>{board.name}</div>
      <div></div>
    </div>
  );
}
