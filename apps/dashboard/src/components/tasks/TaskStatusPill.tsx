'use client';

import { cn } from '@/lib/utils';
import type { TaskStatus } from '@/lib/edge-api/types';

interface TaskStatusPillProps {
  status: TaskStatus;
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  QUEUED: { label: 'Queued', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  ASSIGNED: { label: 'Assigned', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  INFERENCE: { label: 'Inference', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  PROOF: { label: 'Proof', className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  VERIFIED: { label: 'Verified', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  SETTLED: { label: 'Settled', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  FAILED: { label: 'Failed', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export function TaskStatusPill({ status }: TaskStatusPillProps) {
  const config = statusConfig[status] || statusConfig.QUEUED;

  return (
    <span className={cn('px-2 py-1 rounded text-xs font-medium border', config.className)}>
      {config.label}
    </span>
  );
}
