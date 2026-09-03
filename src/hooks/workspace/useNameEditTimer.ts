import { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface nameEditTimerProps {
  targetData: {
    id: string;
    name: string;
  };
  mutation: UseMutationResult;
}

export const useNameEditTimer = ({ targetData, mutation }: nameEditTimerProps) => {
  const [localName, setLocalName] = useState<string | null>(null);

  useEffect(() => {
    if (localName === null) return;

    const currentName = targetData.name;
    if (localName.trim() === currentName) return;

    const handler = setTimeout(() => {
      mutation.mutate({
        id: targetData.id,
        name: localName.trim(),
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [localName, targetData.id, targetData.name, mutation]);

  return {
    setLocalName,
    localName,
  };
};
