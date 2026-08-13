'use client';

import { apiFetch } from '@/services/api';
import { Button } from '../ui/Button';
import { useCreateBoard } from '@/hooks/board/useCreateBoard';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export default function ToolBar(props: DivProps) {
  const createBoard = useCreateBoard();

  return (
    <div {...props}>
      <Button onClick={() => createBoard.mutate('New Board')}>Add</Button>
    </div>
  );
}
