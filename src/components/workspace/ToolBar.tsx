'use client';

import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCreateBoard } from '@/hooks/workspace/board/useCreateBoard';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export default function ToolBar(props: DivProps) {
  const createBoard = useCreateBoard();

  return (
    <div
      {...props}
      className={`flex flex-col items-center justify-start gap-3 ${props.className ?? ''}`}
    >
      <Button
        onClick={() => createBoard.mutate('New Board')}
        aria-label="Add new board"
        title="Add new board"
        className="group bg-primary/10 text-text hover:bg-primary hover:text-accent focus-visible:ring-primary relative flex size-10 items-center justify-center rounded-xl transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none active:scale-95"
      >
        <Plus className="size-5 transition-transform duration-200 group-hover:rotate-90" />
      </Button>
    </div>
  );
}
