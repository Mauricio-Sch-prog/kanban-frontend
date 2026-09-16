import { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

interface UseNameEditTimerProps {
  id: string;
  initialValue: string;
  fieldKey?: 'name' | 'title' | 'description';
  mutation: UseMutationResult;
  maxChar?: number;
  nullable?: boolean;
}

export const useNameEditTimer = ({
  id,
  initialValue,
  fieldKey = 'name',
  mutation,
  maxChar = 300,
  nullable = false,
}: UseNameEditTimerProps) => {
  const [localName, setLocal] = useState<string | null>(null);

  const submittedValueRef = useRef<string | null>(null);

  const setLocalName = (value: string) => {
    if (value.length > maxChar) return;

    setLocal(value);
  };

  useEffect(() => {
    if (localName === null) return;

    const trimmedName = localName.trim();

    if (trimmedName === initialValue) {
      submittedValueRef.current = null;
      return;
    }

    if (trimmedName.length == 0 && !nullable) {
      submittedValueRef.current = null;
      return;
    }

    if (submittedValueRef.current === trimmedName) {
      return;
    }

    const handler = setTimeout(() => {
      submittedValueRef.current = trimmedName;

      mutation.mutate({
        id,
        [fieldKey]: trimmedName,
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [localName, id, initialValue, fieldKey, mutation, nullable]);

  return {
    setLocalName,
    localName,
  };
};
