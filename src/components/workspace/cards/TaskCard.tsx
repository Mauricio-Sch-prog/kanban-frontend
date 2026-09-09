import { useSelectStore } from '@/contexts/SelectContext';
import { useUpdateTask } from '@/hooks/workspace/task/useUpdateTask';
import { useEditableBehavior } from '@/hooks/workspace/useEditableBehavior';
import { useNameEditTimer } from '@/hooks/workspace/useNameEditTimer';
import { Task } from '@/types/task';
import { useSortable } from '@dnd-kit/react/sortable';
import { useEffect, useRef } from 'react';

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

  const titleTimer = useNameEditTimer({
    id: task.id,
    initialValue: task.title,
    fieldKey: 'title',
    mutation: updateTaskMutation as Parameters<typeof useNameEditTimer>[0]['mutation'],
  });

  const descriptionTimer = useNameEditTimer({
    id: task.id,
    initialValue: task.description ?? '',
    fieldKey: 'description',
    mutation: updateTaskMutation as Parameters<typeof useNameEditTimer>[0]['mutation'],
  });

  const selectValue = useSelectStore((state) => state.value);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const titleEditable = useEditableBehavior(titleInputRef);

  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const descEditable = useEditableBehavior(descInputRef);

  const title = titleTimer.localName ?? task.title;
  const description = descriptionTimer.localName ?? task.description ?? '';

  const isEditingTitle = titleEditable.isEditing;
  const isEditingDesc = descEditable.isEditing;

  const canEdit = selectValue.board === board && selectValue.count > 0;

  useEffect(() => {
    if (descInputRef.current) {
      descInputRef.current.style.height = 'auto';
      descInputRef.current.style.height = `${descInputRef.current.scrollHeight}px`;
    }
  }, [description]);

  return (
    <div
      ref={sortableRef}
      data-key={task.id}
      data-type="task"
      className={`border-text/10 bg-primary text-text/90 hover:border-text/30 flex h-auto min-h-[100px] w-full min-w-0 flex-col gap-2 rounded-md border p-3 text-sm shadow-sm hover:shadow-md hover:brightness-110 ${className}`}
    >
      {canEdit ? (
        <input
          type="text"
          ref={titleInputRef}
          value={title}
          onChange={(e) => titleTimer.setLocalName(e.target.value)}
          onMouseDown={titleEditable.mouseDown}
          readOnly={!canEdit}
          className="text-md text-accent w-full rounded border-0 bg-transparent px-2 py-1 outline-none"
        />
      ) : (
        <div className="text-md text-accent w-full cursor-grab px-2 py-1 select-none">{title}</div>
      )}
      {canEdit ? (
        <textarea
          ref={descInputRef}
          value={description}
          onChange={(e) => descriptionTimer.setLocalName(e.target.value)}
          onMouseDown={descEditable.mouseDown}
          readOnly={!canEdit}
          className="text-md text-accent w-full rounded border-0 bg-transparent px-2 py-1 outline-none"
        />
      ) : (
        <div className="text-md text-accent w-full cursor-grab px-2 py-1 select-none">
          {description}
        </div>
      )}

      {/* <textarea
        ref={descInputRef}
        value={description}
        onChange={(e) => descriptionTimer.setLocalName(e.target.value)}
        onMouseDown={descEditable.mouseDown}
        readOnly={!isEditingDesc}
        placeholder="Add a description..."
        className={`text-text/70 w-full resize-none overflow-hidden rounded border-0 bg-transparent px-2 py-1 text-xs wrap-break-word transition-colors outline-none ${
          !isEditingDesc ? 'cursor-text' : 'bg-black/10 dark:bg-white/10'
        }`}
      /> */}
    </div>
  );
}
