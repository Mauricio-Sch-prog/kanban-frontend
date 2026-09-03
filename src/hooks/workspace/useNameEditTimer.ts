import { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface UseNameEditTimerProps {
  id: string;
  initialValue: string;
  fieldKey?: 'name' | 'title';
  mutation: UseMutationResult;
}

export const useNameEditTimer = ({
  id,
  initialValue,
  fieldKey = 'name',
  mutation,
}: UseNameEditTimerProps) => {
  const [localName, setLocalName] = useState<string | null>(null);

  useEffect(() => {
    if (localName === null) return;

    const trimmedName = localName.trim();
    if (trimmedName === initialValue) return;

    const handler = setTimeout(() => {
      mutation.mutate({
        id,
        [fieldKey]: trimmedName,
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [localName, id, initialValue, fieldKey, mutation]);

  return {
    setLocalName,
    localName,
  };
};
