import { useState } from 'react';

export default function useSelect() {
  const [value, setValue] = useState<string | null>(null);

  const selectElement = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;

    const keyElement = target.closest<HTMLElement>('[data-key]');

    if (keyElement?.dataset.key) {
      console.log('Selected Board ID:', keyElement.dataset.key);
      setValue(keyElement.dataset.key);
      return true
    } else {
      setValue(null);
      return false
    }
  };

  return {
    value,
    selectElement,
  };
}
