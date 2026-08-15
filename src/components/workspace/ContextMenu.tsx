'use client';

import { UseSelect } from '@/hooks/workplace/useSelect';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { Edit3, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface BoardContextMenuProps {
  children: React.ReactNode;
  select: UseSelect;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AccessibleContextMenu({
  children,
  select,
  onEdit,
  onDelete,
}: BoardContextMenuProps) {
  const [contextMenuTarget, setContextMenuTarget] = useState('');

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        onContextMenuCapture={(e) => {
          select.selectFromTarget(e.target);

          const element = e.target as HTMLElement;
          const board = element.closest<HTMLElement>('[data-key]');

          setContextMenuTarget(board?.dataset.key ?? '');
        }}
        className="border-primary/30 bg-primary/5 text-text/70 hover:bg-primary/10 flex h-full w-full items-center justify-center rounded-2xl border-2 border-dashed transition-colors"
      >
        {children}
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="border-primary/20 bg-bg animate-in fade-in zoom-in-95 z-50 min-w-44 rounded-xl border p-1.5 shadow-2xl backdrop-blur-md duration-100">
          <ContextMenu.Item
            onClick={() => {
              if (contextMenuTarget) {
                console.log(contextMenuTarget);
                onEdit?.(contextMenuTarget);
              }
            }}
            className="text-text hover:bg-primary/20 focus:bg-primary/20 flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none"
          >
            <Edit3 className="size-4" />
            Edit
          </ContextMenu.Item>

          <ContextMenu.Item
            onClick={() => {
              if (contextMenuTarget) {
                console.log(contextMenuTarget);
                onDelete?.(contextMenuTarget);
              }
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-red-500 outline-none hover:bg-red-500/10 focus:bg-red-500/10"
          >
            <Trash2 className="size-4" />
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
