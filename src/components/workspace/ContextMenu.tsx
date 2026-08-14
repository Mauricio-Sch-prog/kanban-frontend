'use client';

import * as ContextMenu from '@radix-ui/react-context-menu';
import { Edit3, Copy, Trash2 } from 'lucide-react';

interface BoardContextMenuProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export default function AccessibleContextMenu({
  children,
  onEdit,
  onDuplicate,
  onDelete,
}: BoardContextMenuProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="border-primary/30 bg-primary/5 text-text/70 hover:bg-primary/10 flex h-full w-full items-center justify-center rounded-2xl border-2 border-dashed transition-colors">
        {children}
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="border-primary/20 bg-bg animate-in fade-in zoom-in-95 z-50 min-w-44 rounded-xl border p-1.5 shadow-2xl backdrop-blur-md duration-100">
          <ContextMenu.Item
            onClick={() => console.log('Edit')}
            className="text-text hover:bg-primary/20 focus:bg-primary/20 flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none"
          >
            <Edit3 className="size-4" />
            Edit
          </ContextMenu.Item>

          <ContextMenu.Item
            onClick={() => console.log('Duplicate')}
            className="text-text hover:bg-primary/20 focus:bg-primary/20 flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none"
          >
            <Copy className="size-4" />
            Duplicate
          </ContextMenu.Item>

          <ContextMenu.Separator className="bg-primary/20 my-1 h-px" />

          <ContextMenu.Item
            onClick={() => console.log('Delete')}
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
