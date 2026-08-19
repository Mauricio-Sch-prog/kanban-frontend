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

export default function useSelect(): UseSelect {
  const [value, setValue] = useState({
    id: '',
    type: '',
    isEditable: false,
  });

  const selectFromTarget = (target: EventTarget | null) => {
    const element = target as HTMLElement | null;

    const keyElement = element?.closest<HTMLElement>('[data-key]');

    if (keyElement?.dataset.key) {
      setValue({
        id: keyElement.dataset.key,
        type: 'board',
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
