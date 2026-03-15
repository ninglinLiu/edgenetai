import { TaskDetailClient } from './TaskDetailClient';
import { getTasks } from '@/lib/mock/fixtures';

export function generateStaticParams() {
  const tasks = getTasks('busy');
  return tasks.slice(0, 20).map((task) => ({
    id: task.id,
  }));
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return <TaskDetailClient taskId={params.id} />;
}
