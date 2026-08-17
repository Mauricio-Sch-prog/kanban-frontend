import { Lane } from '@/types/lane';
import TaskCard from './TaskCard';
import { Task } from '@/types/task';

type ContainerProps = {
  lane: Lane;
  className?: string;
};

export default function LaneCard({ lane, className = '' }: ContainerProps) {
  return (
    <div
      className={`flex max-h-[70vh] w-64 min-w-[16rem] flex-col rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3 shadow-inner ${className}`}
    >
      {/* Lane Header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
          {lane.name}
        </span>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-500">
          {lane.tasks?.length || 0}
        </span>
      </div>

      {/* Task Rows Stack */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
        {lane.tasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
