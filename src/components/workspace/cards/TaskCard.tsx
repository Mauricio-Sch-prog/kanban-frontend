import { Task } from '@/types/task';

type TaskCardProps = {
  task: Task;
  className?: string;
};

export default function TaskCard({ task, className = '' }: TaskCardProps) {
  return (
    <div
      className={`w-full min-w-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-200 shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-md ${className}`}
    >
      <div className="min-w-0 font-medium break-words">{task.title}</div>

      {task.description && (
        <div className="mt-1 min-w-0 text-xs break-words text-zinc-500">{task.description}</div>
      )}
    </div>
  );
}
