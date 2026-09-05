import { useUpdateTask } from '@/hooks/workspace/task/useUpdateTask';
import { useEditableBehavior } from '@/hooks/workspace/useEditableBehavior';
import { useNameEditTimer } from '@/hooks/workspace/useNameEditTimer';
import { Task } from '@/types/task';
import { useSortable } from '@dnd-kit/react/sortable';
import { useRef } from 'react';

type TaskCardProps = {
  task: Task;
  lane: string;
  board: string;
  className?: string;
};

export default function TaskCard({ task, lane, board, className = '' }: TaskCardProps) {
  const { ref: sortableRef } = useSortable({
    id: task.id,
    index: task.index,
    group: `lane:${lane}`,
    type: 'task',
    accept: 'task',
    data: {
      task: task.id,
      lane: lane,
      board: board,
    },
  });

  const updateTaskMutation = useUpdateTask(board);

  const updateTime = useNameEditTimer({
    id: task.id,
    initialValue: task.title,
    fieldKey: 'title',
    mutation: updateTaskMutation as Parameters<typeof useNameEditTimer>[0]['mutation'],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const editableBehavior = useEditableBehavior(inputRef);

  const name = updateTime.localName ?? task.title;
  const canEdit = editableBehavior.isEditing;

  return (
    <div
      ref={sortableRef}
      data-key={task.id}
      data-type="task"
      style={{ height: 100 }}
      className={`border-text/10 bg-primary text-text/90 hover:border-text/30 w-full min-w-0 overflow-hidden rounded-md border p-3 text-sm shadow-sm transition-all hover:shadow-md hover:brightness-110 ${className}`}
    >
      <input
        type="text"
        ref={inputRef}
        value={name}
        onChange={(e) => updateTime.setLocalName(e.target.value)}
        onMouseDown={editableBehavior.mouseDown}
        readOnly={!canEdit}
        className={`text-md text-accent rounded border-0 bg-transparent px-2 py-1 outline-none ${
          !canEdit ? 'cursor-text' : ''
        }`}
      />

      {task.description && (
        <div className="text-text/50 mt-1 min-w-0 text-xs wrap-break-word">{task.description}</div>
      )}
    </div>
  );
}
