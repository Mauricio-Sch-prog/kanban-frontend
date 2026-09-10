'use client';

import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCreateBoard } from '@/hooks/workspace/board/useCreateBoard';
import { useCardDisplayData } from '@/hooks/workspace/useCardDisplay';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export default function ToolBar(props: DivProps) {
  const createBoard = useCreateBoard();
  const cardsDisplayData = useCardDisplayData()

  return (
    <div
      {...props}
      className={`flex flex-col items-center justify-start gap-3 ${props.className ?? ''}`}
    >
      <Button
        onClick={() => createBoard.mutate({ name: 'New Board', positionX: 100, positionY: 100 })}
        aria-label="Add new board"
        title="Add new board"
        className="group bg-primary/10 text-text hover:bg-primary hover:text-accent focus-visible:ring-primary relative flex size-10 items-center justify-center rounded-xl transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none active:scale-95"
      >
        <Plus className="size-5 transition-transform duration-200 group-hover:rotate-90" />
      </Button>
      <Button
        onClick={() => {
          console.log(cardsDisplayData.cards);
        }}
        aria-label="Add new board"
        title="Add new board"
        className="group bg-primary/10 text-text hover:bg-primary hover:text-accent focus-visible:ring-primary relative flex size-10 items-center justify-center rounded-xl transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none active:scale-95"
      >
        <Search className="size-5 transition-transform duration-200 group-hover:rotate-90" />
      </Button>
    </div>
  );
}
