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
}

export default function BoardCard({ board }: BoardCardProps) {
  const { ref } = useDraggable({
    id: board.id,
  });

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      className="absolute w-64 rounded-lg border bg-black p-4 shadow"
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
