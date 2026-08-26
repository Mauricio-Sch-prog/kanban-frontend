import * as ContextMenu from '@radix-ui/react-context-menu';
import { ReactNode } from 'react';

interface ContextMenuItemProp {
  children: ReactNode;
  className?: string | undefined;
  onClickCallback: () => void;
}

export default function ContextMenuItem({
  children,
  className,
  onClickCallback,
}: ContextMenuItemProp) {
  return (
    <ContextMenu.Item
      onClick={onClickCallback}

      className={`text-text hover:bg-primary/20 focus:bg-primary/20 flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none ${className}`}
    >
      {children}
    </ContextMenu.Item>
  );
}
