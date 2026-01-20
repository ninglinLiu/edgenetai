'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Receipt, Server, Send, AlertTriangle, Activity } from 'lucide-react';
import type { Event } from '@/lib/mock/fixtures';
import { formatDistanceToNow } from 'date-fns';

interface EnhancedActivityFeedProps {
  events: Event[];
  limit?: number;
}

export function EnhancedActivityFeed({ events, limit = 15 }: EnhancedActivityFeedProps) {
  const activityIcons = {
    task_created: Send,
    task_verified: CheckCircle2,
    receipt_mined: Receipt,
    node_joined: Server,
    node_offline: Server,
    dispute: AlertTriangle,
    queue_backlog: Activity,
    contract_event: Receipt,
  };

  const activityColors = {
    task_created: 'text-blue-400',
    task_verified: 'text-green-400',
    receipt_mined: 'text-purple-400',
    node_joined: 'text-green-400',
    node_offline: 'text-red-400',
    dispute: 'text-yellow-400',
    queue_backlog: 'text-orange-400',
    contract_event: 'text-pink-400',
  };

  const severityColors = {
    info: 'bg-blue-500/10 border-blue-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    error: 'bg-red-500/10 border-red-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-400" />
        Event Feed
      </h3>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {events.slice(0, limit).map((event, idx) => {
          const Icon = activityIcons[event.type] || Activity;
          const colorClass = activityColors[event.type] || 'text-slate-400';
          const severityClass = severityColors[event.severity];
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`p-3 rounded-lg border ${severityClass} hover:opacity-80 transition-opacity`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-4 h-4 ${colorClass} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">{event.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
