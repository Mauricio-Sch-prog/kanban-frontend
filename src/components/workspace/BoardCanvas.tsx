'use client';

import { useDroppable } from '@dnd-kit/react';

export default function BoardCanvas({ id, children }) {
  const { ref } = useDroppable({
    id,
  });

  return (
    <div className="flex h-screen items-center justify-center bg-emerald-950" ref={ref}>
      {children}
    </div>
  );
}
