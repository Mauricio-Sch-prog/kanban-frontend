import { RefObject, useState } from 'react';

export const useEditableBehavior = (ref: RefObject<HTMLInputElement | null>) => {
  const [isEditing, setIsEditing] = useState(false);
  const mouseDown = () => {
    if (isEditing) return;
    setIsEditing(true);
    requestAnimationFrame(() => {
      ref.current?.select();
    });
  };

  return {
    mouseDown,
    isEditing,
  };
};
