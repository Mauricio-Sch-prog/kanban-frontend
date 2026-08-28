import { Task } from '@/types/task';
import { useSortable } from '@dnd-kit/react/sortable';

type TaskCardProps = {
  task: Task;
  lane: string;
  className?: string;
};

export default function TaskCard({ task, lane, className = '' }: TaskCardProps) {
  const { ref: sortableRef } = useSortable({
    id: task.id,
    index: task.index,
    type: 'task',
    group: `lane:${lane}`,
    accept: 'task',
    data: {
      task: task.id,
      lane: lane,
    }
  });

  return (
    <div
      ref={sortableRef}
      className={`w-full min-w-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-200 shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-md ${className}`}
    >
      <div className="min-w-0 font-medium wrap-break-word">{task.title}</div>

      {task.description && (
        <div className="mt-1 min-w-0 text-xs wrap-break-word text-zinc-500">{task.description}</div>
      )}
    </div>
  );
}
