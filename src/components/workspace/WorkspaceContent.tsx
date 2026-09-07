'use client';

import BoardCard from '@/components/workspace/cards/BoardCard';
import { Board } from '@/types/board';
import Viewport from './Viewport';
import World from './World';
import AccessibleContextMenu from './ContextMenu/ContextMenu';
import DraggableBehavior from './DraggableBehavior';
import { useBoardContext } from '@/contexts/BoardContext';

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
