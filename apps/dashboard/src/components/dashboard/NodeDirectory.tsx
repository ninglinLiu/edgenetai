'use client';

import { motion } from 'framer-motion';
import { Server, MapPin, Activity, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { Node } from '@/lib/mock/fixtures';

interface NodeDirectoryProps {
  nodes: Node[];
}

export function NodeDirectory({ nodes }: NodeDirectoryProps) {
  const getHealthBadge = (health: Node['health']) => {
    const badges = {
      healthy: { icon: CheckCircle2, color: 'text-green-400 bg-green-500/10 border-green-500/30', label: 'Healthy' },
      degraded: { icon: AlertCircle, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', label: 'Degraded' },
      offline: { icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/30', label: 'Offline' },
    };
    const badge = badges[health];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Server className="w-5 h-5 text-blue-400" />
        Node Directory
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Node ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Region</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Health</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Uptime</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Models</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Latency</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Success Rate</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Reputation</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node, idx) => (
              <motion.tr
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <code className="text-xs text-blue-400 font-mono">{node.id}</code>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-sm text-slate-300">
                    <MapPin className="w-3 h-3" />
                    {node.region}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {getHealthBadge(node.health)}
                </td>
                <td className="py-3 px-4 text-sm text-slate-400">
                  {node.uptime.toFixed(1)}%
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {node.modelSupport.map((model) => (
                      <span
                        key={model}
                        className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-slate-400">
                  {node.latency > 0 ? `${node.latency.toFixed(0)}ms` : '-'}
                </td>
                <td className="py-3 px-4 text-sm text-slate-400">
                  {node.successRate > 0 ? `${node.successRate.toFixed(1)}%` : '-'}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-semibold text-white">
                    {node.reputation.toFixed(0)}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
