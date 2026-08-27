import React, { useState } from 'react';

export type UseSelect = {
  value: {
    id: string;
    type: string;
    board: string;
  };
  selectElement: (e: React.PointerEvent<HTMLDivElement>) => boolean;
  selectFromTarget: (target: EventTarget | null) => boolean;
};

export default function useSelect(): UseSelect {
  const [value, setValue] = useState({
    id: '',
    type: '',
    board: '',
  });

  const selectFromTarget = (target: EventTarget | null) => {
    const element = target as HTMLElement | null;

    if (element?.closest('[data-radix-popper-content-wrapper], [role="menu"]')) {
      return false;
    }

    const keyElement = element?.closest<HTMLElement>('[data-key]');
    const board = element?.closest<HTMLElement>('[data-type="board"]');

    console.log(keyElement?.dataset.type);

    if (keyElement?.dataset.key) {
      setValue({
        id: keyElement.dataset.key,
        type: keyElement.dataset.type || '',
        board: board?.dataset.key || '',
      });
      return true;
    }

    setValue({
      id: '',
      type: '',
      board: '',
    });
    return false;
  };

  const selectElement = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    return selectFromTarget(e.target);
  };

  return {
    value,
    selectElement,
    selectFromTarget,
  };
}
