import { useSelectStore } from '@/contexts/SelectContext';
import { useUpdateTask } from '@/hooks/workspace/task/useUpdateTask';
import { useEditableBehavior } from '@/hooks/workspace/useEditableBehavior';
import { useNameEditTimer } from '@/hooks/workspace/useNameEditTimer';
import { Task } from '@/types/task';
import { useSortable } from '@dnd-kit/react/sortable';
import { ComponentPropsWithoutRef, useLayoutEffect, useEffect, useRef } from 'react';
interface TaskCardProps extends ComponentPropsWithoutRef<'div'> {
  task: Task;
  lane: string;
  board: string;
  isOverlay?: boolean;
}

export default function TaskCard({
  task,
  lane,
  board,
  isOverlay = false,
  className = '',
  ...props
}: TaskCardProps) {
  const { ref: sortableRef, isDragging } = useSortable({
    id: task.id,
    index: task.index,
    group: `lane:${lane}`,
    type: 'task',
    accept: 'task',
    data: {
      task: task.id,
      lane: lane,
      board: board,
      cardData: task,
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

  const canEdit =
    selectValue.board === board && selectValue.count > 0 && selectValue.id === task.id;

  useLayoutEffect(() => {
    if (!canEdit || !descInputRef.current) return;

    const textarea = descInputRef.current;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [description, canEdit]);

  return (
    <div
      ref={sortableRef}
      data-key={task.id}
      data-type="task"
      className={`border-text/10 bg-primary text-text/90 hover:border-text/30 flex h-auto min-h-25 w-full min-w-0 flex-col gap-2 rounded-md border p-3 text-sm shadow-sm hover:shadow-md hover:brightness-110 ${
        isDragging && !isOverlay ? 'pointer-events-none opacity-0' : ''
      } ${
        isOverlay ? 'bg-primary/95 border-accent/50 h-fit max-h-[80vh] w-64 shadow-2xl' : 'min-h-0'
      } ${className}`}
      {...props}
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
          wrap="soft"
          className="text-md text-accent w-full resize-none overflow-hidden rounded border-0 bg-transparent px-2 py-1 wrap-break-word whitespace-pre-wrap outline-none"
        />
      ) : (
        <div className="text-md text-accent w-full cursor-grab px-2 py-1 wrap-break-word whitespace-pre-wrap select-none">
          {description}
        </div>
      )}
    </div>
  );
}
