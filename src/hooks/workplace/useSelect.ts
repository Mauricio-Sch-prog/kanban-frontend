import { Board } from '@/types/board';
import React, { useState } from 'react';

export type UseSelect = {
  value: {
    id: string;
    type: string;
    isEditable: boolean;
  };
  selectElement: (e: React.PointerEvent<HTMLDivElement>) => boolean;
  selectFromTarget: (target: EventTarget | null) => boolean;
  toggleEdit: () => void;
};

export default function useSelect(boards: Board[]): UseSelect {
  const [value, setValue] = useState({
    id: '',
    type: '',
    isEditable: false,
  });

  const selectFromTarget = (target: EventTarget | null) => {
    const element = target as HTMLElement | null;

    // Stop execution if the click originated from inside ContextMenu.Content
    if (element?.closest('[data-radix-popper-content-wrapper], [role="menu"]')) {
      return false;
    }

    const keyElement = element?.closest<HTMLElement>('[data-key]');
    const result = boards.find((board: Board) => board.id === keyElement?.dataset.key);

    if (keyElement?.dataset.key) {
      setValue({
        id: keyElement.dataset.key,
        type: keyElement.dataset.type || '',
        isEditable: false,
      });
      return true;
    }

    setValue({
      id: '',
      type: '',
      isEditable: false,
    });
    return false;
  };

  const selectElement = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    return selectFromTarget(e.target);
  };

  const toggleEdit = () => {
    setValue((prev) => ({ ...prev, isEditable: !prev.isEditable }));
  };

  return {
    value,
    selectElement,
    selectFromTarget,
    toggleEdit,
  };
}
