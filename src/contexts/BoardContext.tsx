'use client';

import React, { createContext, useContext } from 'react';
import { useBoards } from '@/hooks/workspace/board/useBoard';
import { Board } from '@/types/board';

interface BoardContextType {
  boards: Board[];
  isLoading: boolean;
  error: unknown;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const { data: boards = [], isLoading, error } = useBoards();

  return (
    <BoardContext.Provider value={{ boards, isLoading, error }}>{children}</BoardContext.Provider>
  );
}

export function useBoardContext() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
}
