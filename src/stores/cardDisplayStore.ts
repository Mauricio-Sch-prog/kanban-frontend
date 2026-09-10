import { Board } from '@/types/board';
import { createStore } from 'zustand';

export interface CardDisplay extends Board {
  width: number;
  height: number;
}

type CardsUpdater = CardDisplay[] | ((prev: CardDisplay[]) => CardDisplay[]);

export interface CardDisplayState {
  cards: CardDisplay[];

  setCards: (cards: CardsUpdater) => void;
}

export function createCardDisplayStore() {
  return createStore<CardDisplayState>((set) => ({
    cards: [],

    setCards: (cards) => {
      set((state) => ({
        cards: typeof cards === 'function' ? cards(state.cards) : cards,
      }));
    },
  }));
}
