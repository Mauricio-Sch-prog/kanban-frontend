import { Lane } from '@/types/lane';
import TaskCard from './TaskCard';
import { Task } from '@/types/task';

type LaneCardProps = {
  lane: Lane;
  className?: string;
};

export default function LaneCard({ lane, className = '' }: LaneCardProps) {
  return (
    <div
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3 shadow-inner ${className}`}
    >
      {/* Lane Header */}
      <div className="mb-3 flex min-w-0 shrink-0 items-center justify-between gap-2 px-1">
        <span className="min-w-0 truncate text-xs font-bold tracking-wider text-zinc-400 uppercase">
          {lane.name}
        </span>

        <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-500">
          {lane.tasks?.length || 0}
        </span>
      </div>

      {/* Tasks */}
      <div className="min-h-0 min-w-0 flex-1 space-y-2 overflow-x-hidden overflow-y-auto pr-1">
        {lane.tasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
