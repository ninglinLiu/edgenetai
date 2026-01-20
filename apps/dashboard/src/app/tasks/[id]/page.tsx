'use client';

import { Shell } from '@/components/layout/Shell';
import { useParams } from 'next/navigation';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import { useEffect, useState } from 'react';
import type { Task, TaskTimelineStep } from '@/lib/edge-api/types';
import { TaskTimeline } from '@/components/tasks/TaskTimeline';
import { TaskResultCard } from '@/components/tasks/TaskResultCard';
import { CopyButton } from '@/components/common/CopyButton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const api = useEdgeApi();
  const [task, setTask] = useState<Task | null>(null);
  const [timeline, setTimeline] = useState<TaskTimelineStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;

    const loadTask = async () => {
      try {
        const [taskData, timelineData] = await Promise.all([
          api.getTask(taskId),
          api.getTaskTimeline(taskId),
        ]);
        setTask(taskData);
        setTimeline(timelineData);
      } catch (error) {
        console.error('Failed to load task:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
    const interval = setInterval(loadTask, 2000);
    return () => clearInterval(interval);
  }, [api, taskId]);

  if (loading) {
    return (
      <Shell>
        <div className="text-center py-12 text-slate-400">Loading task...</div>
      </Shell>
    );
  }

  if (!task) {
    return (
      <Shell>
        <div className="text-center py-12 text-slate-400">Task not found</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Task Details</h1>
          <Link href="/tasks">
            <Button variant="outline">Back to Tasks</Button>
          </Link>
        </div>

        {/* Task Summary Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Task Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-400">Job ID</div>
              <div className="font-mono text-sm text-blue-400">{task.id}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Type</div>
              <div className="text-white">{task.type}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">SLA Tier</div>
              <div className="text-white">{task.slaTier}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Created</div>
              <div className="text-white">{new Date(task.createdAt).toLocaleString()}</div>
            </div>
            {task.selectedNodes && (
              <div>
                <div className="text-sm text-slate-400">Selected Nodes</div>
                <div className="text-white">{task.selectedNodes.length}</div>
              </div>
            )}
            {task.modelHash && (
              <div>
                <div className="text-sm text-slate-400">Model Hash</div>
                <div className="font-mono text-xs text-slate-300">{task.modelHash.slice(0, 16)}...</div>
              </div>
            )}
            {task.latency && (
              <div>
                <div className="text-sm text-slate-400">Latency</div>
                <div className="text-white">{task.latency}ms</div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <TaskTimeline steps={timeline} currentStatus={task.status} />

        {/* Result */}
        {task.result && <TaskResultCard task={task} result={task.result} />}

        {/* Receipt */}
        {task.receiptId && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">On-Chain Receipt</h2>
              <div className="flex gap-2">
                <CopyButton text={task.receiptId} />
                <Link href={`/explorer/receipts/${task.receiptId}`}>
                  <Button variant="outline" size="sm">
                    View in Explorer <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt ID:</span>
                <span className="font-mono text-blue-400">{task.receiptId}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
