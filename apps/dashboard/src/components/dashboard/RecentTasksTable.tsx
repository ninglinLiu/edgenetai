'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ExternalLink, Copy, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { Task } from '@/lib/mock/fixtures';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/common/CopyButton';

interface RecentTasksTableProps {
  tasks: Task[];
}

export function RecentTasksTable({ tasks }: RecentTasksTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [slaFilter, setSlaFilter] = useState<string>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    const matchesSla = slaFilter === 'all' || task.slaTier === slaFilter;
    return matchesSearch && matchesStatus && matchesType && matchesSla;
  });

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      QUEUED: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      ASSIGNED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      INFERENCE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      VERIFIED: 'bg-green-500/20 text-green-400 border-green-500/30',
      SETTLED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors.QUEUED;
  };

  const getTypeColor = (type: Task['type']) => {
    return type === 'LLM_SUMMARY' 
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      : 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  const getSlaColor = (sla: Task['slaTier']) => {
    const colors = {
      BRONZE: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      SILVER: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      GOLD: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return colors[sla];
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Tasks</h3>
          <div className="text-sm text-slate-400">{filteredTasks.length} tasks</div>
        </div>

        {/* Filters */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by Task ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700/50"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white"
            >
              <option value="all">All Status</option>
              <option value="QUEUED">Queued</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="INFERENCE">Inference</option>
              <option value="VERIFIED">Verified</option>
              <option value="SETTLED">Settled</option>
              <option value="FAILED">Failed</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white"
            >
              <option value="all">All Types</option>
              <option value="LLM_SUMMARY">LLM Summary</option>
              <option value="OCR_IMAGE">OCR Image</option>
            </select>
            
            <select
              value={slaFilter}
              onChange={(e) => setSlaFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-white"
            >
              <option value="all">All SLA</option>
              <option value="BRONZE">Bronze</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Task ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">SLA</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Latency</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Created</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.slice(0, 10).map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedTask(task)}
                >
                  <td className="py-3 px-4">
                    <code className="text-xs text-blue-400 font-mono">{task.id.slice(0, 12)}...</code>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getTypeColor(task.type)}`}>
                      {task.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getSlaColor(task.slaTier)}`}>
                      {task.slaTier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400">
                    {task.latency ? `${task.latency}ms` : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400">
                    {new Date(task.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Task Detail Sidebar */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelectedTask(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Task Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTask(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Task ID</h3>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-white font-mono bg-slate-800 px-3 py-2 rounded">{selectedTask.id}</code>
                      <CopyButton text={selectedTask.id} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Type</h3>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded text-sm font-medium border ${getTypeColor(selectedTask.type)}`}>
                        {selectedTask.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Status</h3>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded text-sm font-medium border ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status}
                      </span>
                    </div>
                  </div>

                  {selectedTask.nodes && selectedTask.nodes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">N-of-M Nodes</h3>
                      <div className="space-y-2">
                        {selectedTask.nodes.map((nodeId, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <code className="text-xs text-slate-300 font-mono bg-slate-800 px-2 py-1 rounded">{nodeId}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTask.similarityScore !== undefined && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Similarity Score</h3>
                      <div className="text-lg font-semibold text-white">
                        {(selectedTask.similarityScore * 100).toFixed(2)}%
                      </div>
                    </div>
                  )}

                  {selectedTask.verdict && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Verdict</h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${
                        selectedTask.verdict === 'PASS' ? 'bg-green-500/20 text-green-400' :
                        selectedTask.verdict === 'FAIL' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {selectedTask.verdict === 'PASS' && <CheckCircle2 className="w-4 h-4" />}
                        {selectedTask.verdict === 'FAIL' && <XCircle className="w-4 h-4" />}
                        {selectedTask.verdict === 'DISPUTE' && <AlertTriangle className="w-4 h-4" />}
                        {selectedTask.verdict}
                      </div>
                    </div>
                  )}

                  {selectedTask.receiptTxHash && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 mb-2">Receipt TX Hash</h3>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-white font-mono bg-slate-800 px-3 py-2 rounded flex-1">{selectedTask.receiptTxHash}</code>
                        <CopyButton text={selectedTask.receiptTxHash} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
