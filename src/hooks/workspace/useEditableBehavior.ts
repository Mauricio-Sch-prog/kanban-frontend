import { RefObject, useRef, useState } from 'react';

interface editableBehaviorProps {
  isSelected: boolean;
}

export const useEditableBehavior = (isSelected: boolean, ref: RefObject<HTMLInputElement | null>) => {
  const [isEditing, setIsEditing] = useState(false);
  const mouseDown = () => {
    if (!isSelected || isEditing) return;
    setIsEditing(true);
    requestAnimationFrame(() => {
      ref.current?.select();
    });
  };

  return {
    mouseDown,
    isEditing,
    ref,
  };
};
