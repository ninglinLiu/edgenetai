'use client';

import { useEffect, useState } from 'react';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import type { ActivityItem } from '@/lib/edge-api/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Receipt, Server, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const activityIcons = {
  task_created: Send,
  task_verified: CheckCircle2,
  receipt_mined: Receipt,
  node_online: Server,
  node_offline: Server,
};

const activityColors = {
  task_created: 'text-blue-400',
  task_verified: 'text-green-400',
  receipt_mined: 'text-purple-400',
  node_online: 'text-green-400',
  node_offline: 'text-red-400',
};

export function ActivityFeed({ limit = 10 }: { limit?: number }) {
  const api = useEdgeApi();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const unsubscribe = api.subscribeActivity((activity) => {
      setActivities((prev) => [activity, ...prev].slice(0, limit));
    });

    return unsubscribe;
  }, [api, limit]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Live Activity</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <Icon className={`w-5 h-5 ${colorClass} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">
                    {activity.type === 'task_created' && (
                      <>Task <span className="font-mono text-blue-400">{activity.data.taskId?.slice(0, 8)}</span> created</>
                    )}
                    {activity.type === 'task_verified' && (
                      <>Task <span className="font-mono text-blue-400">{activity.data.taskId?.slice(0, 8)}</span> verified: <span className="font-semibold">{activity.data.status}</span></>
                    )}
                    {activity.type === 'receipt_mined' && (
                      <>Receipt <span className="font-mono text-purple-400">{activity.data.receiptId?.slice(0, 8)}</span> mined</>
                    )}
                    {activity.type === 'node_online' && (
                      <>Node <span className="font-mono text-green-400">{activity.data.nodeId?.slice(0, 8)}</span> came online</>
                    )}
                    {activity.type === 'node_offline' && (
                      <>Node <span className="font-mono text-red-400">{activity.data.nodeId?.slice(0, 8)}</span> went offline</>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {activities.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}
