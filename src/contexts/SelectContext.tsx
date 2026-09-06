'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import { useStore } from 'zustand';
import { createSelectStore, SelectState } from '@/stores/selectStore';

type SelectStore = ReturnType<typeof createSelectStore>;

const SelectContext = createContext<SelectStore | null>(null);

interface SelectProviderProps {
  children: ReactNode;
}

export function SelectProvider({ children }: SelectProviderProps) {
  const [store] = useState<SelectStore>(() => createSelectStore());

  return <SelectContext.Provider value={store}>{children}</SelectContext.Provider>;
}

export function useSelectStore<T>(selector: (state: SelectState) => T): T {
  const store = useContext(SelectContext);

  if (!store) {
    throw new Error('useSelectStore must be used inside SelectProvider');
  }

  return useStore(store, selector);
}
