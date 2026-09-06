'use client';

import useSelect from '@/hooks/workspace/useSelect';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ContextMenuItem from './ContextMenuItem';
import { useCreateLane } from '@/hooks/workspace/lane/useCreateLane';
import { useCreateBoard } from '@/hooks/workspace/board/useCreateBoard';
import { useCreateTask } from '@/hooks/workspace/task/useCreateTask';
import { useDeleteBoard } from '@/hooks/workspace/board/useDeleteBoard';
import { useDeleteLane } from '@/hooks/workspace/lane/useDeleteLane';
import { useDeleteTask } from '@/hooks/workspace/task/useDeleteTask';
import { useCanvas } from '@/hooks/workspace/useCanvas';
import { useBoards } from '@/hooks/workspace/board/useBoard';

interface BoardContextMenuProps {
  children: React.ReactNode;
}

export default function AccessibleContextMenu({ children }: BoardContextMenuProps) {
  const deleteBoardMutation = useDeleteBoard();
  const deleteLaneMutation = useDeleteLane();
  const deleteTaskMutation = useDeleteTask();

  const [contextMenuTarget, setContextMenuTarget] = useState('');
  const createBoardMutation = useCreateBoard();
  const createLaneMutation = useCreateLane();
  const createTaskMutation = useCreateTask();

  const { data: boards = [] } = useBoards();
  const select = useSelect();
  const canvas = useCanvas(boards);
  const elementType = select.value.type;

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

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        onContextMenuCapture={(e) => {
          select.selectFromTarget(e.target);

          const element = e.target as HTMLElement;
          const board = element.closest<HTMLElement>('[data-key]');

          setContextMenuTarget(board?.dataset.key ?? '');
        }}
        className="border-primary/30 bg-primary/0 text-text/70 flex h-full w-full items-center justify-center rounded-2xl border-2 border-dashed transition-colors"
      >
        {children}
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="border-text/15 bg-primary animate-in fade-in zoom-in-95 z-50 min-w-44 rounded border p-1.5 shadow-2xl duration-100">
          {elementType === 'board' ? (
            <ContextMenuItem
              onClickCallback={() => {
                if (contextMenuTarget) {
                  createLaneMutation.mutate?.({ board: contextMenuTarget, name: 'New Lane' });
                }
              }}
            >
              <Plus className="size-5 transition-transform duration-200 group-hover:rotate-90" />
              Create Lane
            </ContextMenuItem>
          ) : elementType === 'lane' ? (
            <ContextMenuItem
              onClickCallback={() => {
                if (contextMenuTarget) {
                  createTaskMutation.mutate?.({
                    board: select.value.board,
                    lane: contextMenuTarget,
                    title: 'New Task',
                  });
                }
              }}
            >
              <Plus className="size-5 transition-transform duration-200 group-hover:rotate-90" />
              Create Task
            </ContextMenuItem>
          ) : elementType !== 'task' ? (
            <ContextMenuItem
              onClickCallback={() => {
                createBoardMutation.mutate({
                  name: 'New board',
                  positionX: canvas.mouseWorld.x,
                  positionY: canvas.mouseWorld.y,
                });
              }}
            >
              <Plus className="size-5 transition-transform duration-200 group-hover:rotate-90" />
              Create Board
            </ContextMenuItem>
          ) : (
            <></>
          )}

          {select.value.id ? (
            <ContextMenu.Item
              onClick={() => {
                if (contextMenuTarget) {
                  handleDelete?.();
                }
              }}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-red-500 outline-none hover:bg-red-500/10 focus:bg-red-500/10"
            >
              <Trash2 className="size-4" />
              Delete
            </ContextMenu.Item>
          ) : null}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
