'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import { useStore } from 'zustand';
import { CardDisplayState, createCardDisplayStore } from '@/stores/cardDisplayStore';

type CardDisplayStore = ReturnType<typeof createCardDisplayStore>;

const CardDisplayContext = createContext<CardDisplayStore | null>(null);

interface CardDisplayProviderProps {
  children: ReactNode;
}

export function CardDisplayProvider({ children }: CardDisplayProviderProps) {
  const [store] = useState<CardDisplayStore>(() => createCardDisplayStore());

  return <CardDisplayContext.Provider value={store}>{children}</CardDisplayContext.Provider>;
}

export function useCardDisplayStore<T>(selector: (state: CardDisplayState) => T): T {
  const store = useContext(CardDisplayContext);

  if (!store) {
    throw new Error('useCardDisplayStore must be used inside CardDisplayProvider');
  }

  return useStore(store, selector);
}
