import { useCanvasStore } from '@/contexts/CanvasContext';
import { useCardDisplayStore } from '@/contexts/CardDisplayContext';
import { Board } from '@/types/board';
import { Lane } from '@/types/lane';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useUpdateBoard } from './board/useUpdateBoard';
import { useSelectStore } from '@/contexts/SelectContext';
import { CardDisplay } from '@/stores/cardDisplayStore';

const DEFAULT_MIN_WIDTH = 280;
const MIN_BOARD_WIDTH = 200;
const MIN_BOARD_HEIGHT = 200;
const LANE_WIDTH = 200;
const TASK_HEIGHT = 110;

export function useCardDisplayData() {
  const cards = useCardDisplayStore((state) => state.cards);
  const setCards = useCardDisplayStore((state) => state.setCards);

  const updateBoard = useCallback(
    (board: Board) => {
      setCards((prevCards) => {
        const index = prevCards.findIndex((card) => card.id === board.id);

        if (index === -1) {
          return [
            ...prevCards,
            { ...(board as CardDisplay), height: (board as CardDisplay).height ?? 0 },
          ];
        }

        return prevCards.map((card, i) =>
          i === index
            ? {
                ...card,
                ...board,
                height: (board as CardDisplay).height ?? card.height ?? 0,
              }
            : card
        );
      });
    },
    [setCards]
  );

  const updateBoardHeight = useCallback(
    (boardId: string, height: number) => {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === boardId
            ? {
                ...card,
                height,
              }
            : card
        )
      );
    },
    [setCards]
  );

  const useBoardDisplay = (
    board: Board,
    boardRef: RefObject<HTMLDivElement | null>,
    isLoading: boolean,
    isOverlay: boolean = false
  ) => {
    const storedBoard = cards.find((card) => card.id === board.id);

    const zoom = useCanvasStore((state) => state.camera.zoom);
    const selectValue = useSelectStore((state) => state.value);
    const isSelected = selectValue.board === board.id;
    const canEdit = isSelected && selectValue.count > 0;

    const updateBoardMutation = useUpdateBoard();

    const [width, setWidth] = useState(board.width ?? DEFAULT_MIN_WIDTH);
    const [boardHeight, setBoardHeight] = useState<number>(0);
    const [isResizing, setIsResizing] = useState(false);

    const resizeState = useRef<{
      startX: number;
      startWidth: number;
      currentWidth: number;
    } | null>(null);

    const cleanupRef = useRef<(() => void) | null>(null);

    const displayBoard: Board = storedBoard
      ? {
          ...storedBoard,
          ...board,
          lanes: storedBoard.lanes ?? board.lanes,
        }
      : board;

    const lanes = displayBoard.lanes ?? [];

    const minWidth = Math.max(lanes.length * LANE_WIDTH, DEFAULT_MIN_WIDTH);

    const highestTaskCount = Math.max(...lanes.map((lane: Lane) => lane.tasks?.length ?? 0), 0);

    const minBoardHeight = Math.max(highestTaskCount * TASK_HEIGHT, MIN_BOARD_HEIGHT);

    const trackedHeight = storedBoard?.height ?? boardHeight;
    const displayHeight = Math.max(trackedHeight, minBoardHeight);

    const getWidth = useCallback(() => {
      return Math.max(width, minWidth);
    }, [width, minWidth]);

    useEffect(() => {
      const element = boardRef.current;
      if (!element || isOverlay) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newHeight = Math.round(
            entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
          );

          updateBoardHeight(board.id, newHeight);
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }, [board.id, boardRef, isLoading, isOverlay]);

    useEffect(() => {
      if (board.width == null) return;

      setWidth(board.width);
    }, [board.id, board.width]);

    useEffect(() => {
      return () => {
        cleanupRef.current?.();
      };
    }, []);

    const handleResizePointerDown = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        cleanupRef.current?.();

        const startWidth = getWidth();

        resizeState.current = {
          startX: event.clientX,
          startWidth,
          currentWidth: startWidth,
        };

        setIsResizing(true);

        const handlePointerMove = (event: PointerEvent) => {
          if (!resizeState.current) return;

          const deltaX = (event.clientX - resizeState.current.startX) / zoom;

          const newWidth = Math.max(
            MIN_BOARD_WIDTH,
            resizeState.current.startWidth + deltaX,
            minWidth
          );

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

          cleanup();
        };

        const cleanup = () => {
          window.removeEventListener('pointermove', handlePointerMove);

          window.removeEventListener('pointerup', handlePointerUp);

          cleanupRef.current = null;
          resizeState.current = null;

          setIsResizing(false);
        };

        cleanupRef.current = cleanup;

        window.addEventListener('pointermove', handlePointerMove);

        window.addEventListener('pointerup', handlePointerUp);
      },
      [board.id, getWidth, minWidth, zoom, updateBoardMutation]
    );

    return {
      board: displayBoard,
      isSelected,
      canEdit,
      width: getWidth(),
      minWidth,
      minBoardHeight,
      isResizing,
      getWidth,
      handleResizePointerDown,
      trackedHeight: boardHeight,
      style: {
        left: displayBoard.positionX,
        top: displayBoard.positionY,
        width: getWidth(),
        height: isOverlay ? displayHeight : 'auto',
      },
    };
  };

  const getCardDisplay = useCallback(
    (id: string): Board | undefined => {
      return cards.find((board) => {
        if (board.id === id) return true;

        return board.lanes?.some((lane) => {
          if (lane.id === id) return true;

          return lane.tasks?.some((task) => task.id === id);
        });
      });
    },
    [cards]
  );

  return {
    cards,
    setCards,
    updateBoard,
    useBoardDisplay,
    getCardDisplay,
  };
}
