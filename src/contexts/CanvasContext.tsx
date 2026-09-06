'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import { useStore } from 'zustand';
import { CanvasState, createCanvasStore } from '@/stores/canvasStore';

type CanvasStore = ReturnType<typeof createCanvasStore>;

const CanvasContext = createContext<CanvasStore | null>(null);

interface CanvasProviderProps {
  children: ReactNode;
}

export function CanvasProvider({ children }: CanvasProviderProps) {
  const [store] = useState<CanvasStore>(() => createCanvasStore());

  return <CanvasContext.Provider value={store}>{children}</CanvasContext.Provider>;
}

export function useCanvasStore<T>(selector: (state: CanvasState) => T): T {
  const store = useContext(CanvasContext);

  if (!store) {
    throw new Error('useCanvasStore must be used inside CanvasProvider');
  }

  return useStore(store, selector);
}
