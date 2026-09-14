
import { Lane } from '@/types/lane';
import TaskCard from './TaskCard';
import { Task } from '@/types/task';

import { useSortable } from '@dnd-kit/react/sortable';
import { useDroppable } from '@dnd-kit/react';
import { useUpdateLane } from '@/hooks/workspace/lane/useUpdateLane';
import { useNameEditTimer } from '@/hooks/workspace/useNameEditTimer';
import { useEditableBehavior } from '@/hooks/workspace/useEditableBehavior';
import { ComponentPropsWithoutRef, useRef } from 'react';
import { useSelectStore } from '@/contexts/SelectContext';

interface LaneCardProps extends ComponentPropsWithoutRef<'div'> {
  lane: Lane;
  board: string;
  isOverlay?: boolean;
}

export default function LaneCard({
  lane,
  board,
  isOverlay = false,
  className = '',
  ...props
}: LaneCardProps) {
  const { ref: sortableRef, isDragging } = useSortable({
    id: lane.id,
    index: lane.index,
    group: `board:${board}`,
    type: 'lane',
    accept: 'lane',
    data: {
      lane: lane.id,
      board: board,
      cardData: lane,
    },
  });

  const { ref: droppableRef } = useDroppable({
    id: `lane-drop:${lane.id}`,
    type: 'task',
    accept: 'task',
    disabled: isOverlay,
    data: {
      lane: lane.id,
      board: board,
    },
  });

  const selectValue = useSelectStore((state) => state.value);

  const updateLaneMutation = useUpdateLane(board);
  const updateTime = useNameEditTimer({
    id: lane.id,
    initialValue: lane.name,
    mutation: updateLaneMutation as Parameters<typeof useNameEditTimer>[0]['mutation'],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const editableBehavior = useEditableBehavior(inputRef);

  const name = updateTime.localName ?? lane.name;
  const canEdit = selectValue.board === board && selectValue.count > 0 && !isOverlay;

  const sortedTasks = [...lane.tasks].sort((a, b) => a.index - b.index);

  return (
    <div
      data-key={lane.id}
      data-type="lane"
      ref={!isOverlay ? sortableRef : undefined}
      className={`border-text/10 bg-text/5 flex min-w-0 flex-col space-y-2 rounded-lg border p-3 pr-1 shadow-inner ${
        isDragging && !isOverlay ? 'pointer-events-none opacity-0' : ''
      } ${
        isOverlay ? 'bg-primary/95 border-accent/50 h-fit max-h-[80vh] w-64 shadow-2xl' : 'min-h-0'
      } ${className}`}
      {...props}
    >
      {canEdit ? (
        <input
          type="text"
          ref={inputRef}
          value={name}
          onChange={(e) => updateTime.setLocalName(e.target.value)}
          onMouseDown={editableBehavior.mouseDown}
          readOnly={!canEdit}
          className="text-md text-accent w-full rounded border-0 bg-transparent px-2 py-1 outline-none"
        />
      ) : (
        <div className="text-md text-accent w-full cursor-grab px-2 py-1 select-none">{name}</div>
      )}

      <div
        ref={!isOverlay ? droppableRef : undefined}
        className={`flex flex-col space-y-2 overflow-y-auto pr-1 ${
          isOverlay ? 'max-h-[60vh]' : 'min-h-0 flex-1'
        }`}
      >
        {sortedTasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} lane={lane.id} board={board} />
        ))}
      </div>
    </div>
  );
}
