'use client';

import { Task } from '@/types';
import TaskCard from './TaskCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  deletingTaskId?: number;
  isLoading?: boolean;
  onCreateNew?: () => void;
}

export default function TaskList({
  tasks,
  onEdit,
  onDelete,
  deletingTaskId,
  isLoading = false,
  onCreateNew,
}: TaskListProps) {
  if (isLoading) {
    return <LoadingSpinner size="md" text="Loading tasks..." className="py-12" />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Get started by creating your first task to stay organized and productive."
        action={
          onCreateNew
            ? {
                label: 'Create New Task',
                onClick: onCreateNew,
              }
            : undefined
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingTaskId === task.id}
        />
      ))}
    </div>
  );
}

