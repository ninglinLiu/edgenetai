'use client';

import type { TaskTimelineStep } from '@/lib/edge-api/types';
import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskTimelineProps {
  steps: TaskTimelineStep[];
  currentStatus: string;
}

export function TaskTimeline({ steps, currentStatus }: TaskTimelineProps) {
  const statusOrder = ['QUEUED', 'ASSIGNED', 'INFERENCE', 'PROOF', 'VERIFIED', 'SETTLED'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Task Timeline</h3>
      <div className="space-y-4">
        {statusOrder.map((status, index) => {
          const step = steps.find((s) => s.status === status);
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={status} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                {isCompleted ? (
                  <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center animate-pulse">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                    <Circle className="w-5 h-5 text-slate-600" />
                  </div>
                )}
                {index < statusOrder.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-12 mt-2',
                      isCompleted ? 'bg-green-500/30' : 'bg-slate-800'
                    )}
                  />
                )}
              </div>
              <div className="flex-1 pt-2">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'font-medium',
                      isCompleted ? 'text-green-400' : isCurrent ? 'text-blue-400' : 'text-slate-500'
                    )}
                  >
                    {status}
                  </span>
                  {step && (
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(step.timestamp), { addSuffix: true })}
                      {step.duration && ` • ${step.duration}ms`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
