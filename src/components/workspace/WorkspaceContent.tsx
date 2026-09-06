'use client';

import BoardCard from '@/components/workspace/cards/BoardCard';
import { Board } from '@/types/board';
import { useBoards } from '@/hooks/workspace/board/useBoard';
import Viewport from './Viewport';
import World from './World';
import AccessibleContextMenu from './ContextMenu/ContextMenu';
import { CanvasProvider } from '@/contexts/CanvasContext';
import DraggableBehavior from './DraggableBehavior';

export default function Workspace() {
  return (
    <CanvasProvider>
      <WorkspaceContent />
    </CanvasProvider>
  );
}

function WorkspaceContent() {
  const { data: boards = [], isLoading, error } = useBoards();

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
