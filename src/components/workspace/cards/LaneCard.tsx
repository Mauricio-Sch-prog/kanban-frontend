import { Lane } from '@/types/lane';
import TaskCard from './TaskCard';
import { Task } from '@/types/task';

import { useSortable } from '@dnd-kit/react/sortable';
import { useDroppable } from '@dnd-kit/react';
import { useUpdateLane } from '@/hooks/workspace/lane/useUpdateLane';
import { useNameEditTimer } from '@/hooks/workspace/useNameEditTimer';
import { useEditableBehavior } from '@/hooks/workspace/useEditableBehavior';
import { useRef } from 'react';

type LaneCardProps = {
  lane: Lane;
  board: string;
  className?: string;
};

export default function LaneCard({ lane, board, className = '' }: LaneCardProps) {
  const { ref: sortableRef } = useSortable({
    id: lane.id,
    index: lane.index,
    group: `board:${board}`,
    type: 'lane',
    accept: 'lane',
    data: {
      lane: lane.id,
      board: board,
    },
  });

  const { ref: droppableRef } = useDroppable({
    id: `lane-drop:${lane.id}`,
    type: 'task',
    accept: 'task',
    data: {
      lane: lane.id,
    },
  });

  const updateLaneMutation = useUpdateLane(board);
  const updateTime = useNameEditTimer({
    targetData: {
      id: lane.id,
      name: lane.name,
    },
    mutation: updateLaneMutation as Parameters<typeof useNameEditTimer>[0]['mutation'],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const editableBehavior = useEditableBehavior(inputRef);

  const name = updateTime.localName ?? lane.name;
  const canEdit = editableBehavior.isEditing;

  const sortedTasks = [...lane.tasks].sort((a, b) => a.index - b.index);

  return (
    <div
      data-key={lane.id}
      data-type="lane"
      ref={sortableRef}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3 shadow-inner ${className}`}
    >
      <div className="mb-3 flex min-w-0 shrink-0 items-center justify-between gap-2 px-1">
        {/* <span className="min-w-0 truncate text-xs font-bold tracking-wider text-zinc-400 uppercase">
          {lane.name}
        </span> */}
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
      </div>

      <div
        ref={droppableRef}
        className="min-h-0 min-w-0 flex-1 space-y-2 overflow-x-hidden overflow-y-auto pr-1"
      >
        {sortedTasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} lane={lane.id} board={board} />
        ))}
      </div>
    </div>
  );
}
