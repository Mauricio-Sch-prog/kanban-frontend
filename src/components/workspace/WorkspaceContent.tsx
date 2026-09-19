'use client';

import BoardCard from '@/components/workspace/cards/BoardCard';
import { Board } from '@/types/board';
import Viewport from './content/Viewport';
import World from './content/World';
import AccessibleContextMenu from './ContextMenu/ContextMenu';
import { useBoardContext } from '@/contexts/BoardContext';
import Grid from './content/Grid';
import DraggableBehavior from './content/DraggableBehavior';

export default function WorkspaceContent() {
  const { boards = [] as Board[], isLoading, error } = useBoardContext();

  const sortedBoards = [...boards].sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading boards</div>;
  }

  return (
    <DraggableBehavior>
      <Viewport>
        <Grid />
        <AccessibleContextMenu>
          <World>
            {sortedBoards.map((board: Board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </World>
        </AccessibleContextMenu>
      </Viewport>
    </DraggableBehavior>
  );
}
