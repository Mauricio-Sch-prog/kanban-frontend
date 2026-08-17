import { Board } from '@/types/board';

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function getContentBounds(boards: Board[]): Bounds {
  if (boards.length === 0) {
    return {
      minX: -1000,
      minY: -1000,
      maxX: 1000,
      maxY: 1000,
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const board of boards) {
    minX = Math.min(minX, board.positionX);
    minY = Math.min(minY, board.positionY);

    maxX = Math.max(maxX, board.positionX + board.width);

    maxY = Math.max(maxY, board.positionY + board.height);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}
