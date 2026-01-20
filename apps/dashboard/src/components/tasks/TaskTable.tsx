'use client';

import Link from 'next/link';
import type { Task } from '@/lib/edge-api/types';
import { TaskStatusPill } from './TaskStatusPill';
import { formatDistanceToNow } from 'date-fns';

interface TaskTableProps {
  tasks: Task[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Job ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">SLA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Latency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-sm font-mono text-blue-400 hover:text-blue-300"
                  >
                    {task.id.slice(0, 8)}...
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {task.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  <span className="px-2 py-1 rounded bg-slate-800 text-xs">
                    {task.slaTier}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TaskStatusPill status={task.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {task.latency ? `${task.latency}ms` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {task.result ? (
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.result.verificationResult === 'PASS' ? 'bg-green-500/20 text-green-400' :
                      task.result.verificationResult === 'FAIL' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {task.result.verificationResult}
                    </span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
