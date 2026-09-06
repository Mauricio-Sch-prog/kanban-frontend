'use client';

import BoardCard from '@/components/workspace/cards/BoardCard';
import { Board } from '@/types/board';
import { useBoards } from '@/hooks/workspace/board/useBoard';
import Viewport from './Viewport';
import World from './World';
import useSelect from '@/hooks/workspace/useSelect';
import AccessibleContextMenu from './ContextMenu/ContextMenu';
import { useDeleteBoard } from '@/hooks/workspace/board/useDeleteBoard';
import { useDeleteLane } from '@/hooks/workspace/lane/useDeleteLane';
import { useDeleteTask } from '@/hooks/workspace/task/useDeleteTask';
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
  const deleteBoardMutation = useDeleteBoard();
  const deleteLaneMutation = useDeleteLane();
  const deleteTaskMutation = useDeleteTask();

  const { data: boards = [], isLoading, error } = useBoards();

  const sortedBoards = [...boards].sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  );

  const select = useSelect();

  const handleDelete = async () => {
    if (select.value.type === 'board') {
      deleteBoardMutation.mutate(select.value.id);
    }

    if (select.value.type === 'lane') {
      deleteLaneMutation.mutate({
        id: select.value.id,
        board: select.value.board,
      });
    }

    if (select.value.type === 'task') {
      deleteTaskMutation.mutate({
        id: select.value.id,
        board: select.value.board,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading boards</div>;
  }

  return (
    <DraggableBehavior>
      <Viewport>
        <AccessibleContextMenu select={select} onDelete={handleDelete}>
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
