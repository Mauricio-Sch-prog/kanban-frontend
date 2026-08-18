import { Task } from '@/types/task';

type TaskCardProps = {
  task: Task;
  className?: string;
};

export default function TaskCard({
  task,
  className = '',
}: TaskCardProps) {
  return (
    <div
      className={`min-w-0 w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-200 shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-md ${className}`}
    >
      <div className="min-w-0 break-words font-medium">
        {task.title}
      </div>

      {task.description && (
        <div className="mt-1 min-w-0 break-words text-xs text-zinc-500">
          {task.description}
        </div>
      )}
    </div>
  );
}