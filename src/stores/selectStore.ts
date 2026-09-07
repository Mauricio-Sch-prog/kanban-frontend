import { createStore } from 'zustand';

export interface Value {
  id: string;
  type: string;
  board: string;
  count: number;
}

type ValueUpdater = Value | ((prev: Value) => Value);

export interface SelectState {
  value: Value;

  setValue: (value: ValueUpdater) => void;
}

export function createSelectStore() {
  return createStore<SelectState>((set) => ({
    value: {
      id: '',
      type: '',
      board: '',
      count: 0,
    },

    setValue: (value) => {
      set((state) => ({
        value: typeof value === 'function' ? value(state.value) : value,
      }));
    },
  }));
}
