import { Task } from '@/types/task';

type ContainerProps = {
  task: Task;
  className?: string;
};

export default function TaskCard({ task, className = '' }: ContainerProps) {
  return (
    <div
      className={`group flex cursor-grab items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-200 shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-md active:cursor-grabbing ${className}`}
    >
      <span className="truncate font-medium">{task.title}</span>
    </div>
  );
}
