'use client';

import { Shell } from '@/components/layout/Shell';
import { useDemoData } from '@/hooks/useDemoData';
import { NetworkHealthKpi, QueueDepthKpi, DisputeFailedKpi } from '@/components/dashboard/NetworkHealthKpi';
import { PipelineVisualization } from '@/components/dashboard/PipelineVisualization';
import { EnhancedCharts } from '@/components/dashboard/EnhancedCharts';
import { RecentTasksTable } from '@/components/dashboard/RecentTasksTable';
import { NodeDirectory } from '@/components/dashboard/NodeDirectory';
import { ReceiptsList } from '@/components/dashboard/ReceiptsList';
import { EnhancedActivityFeed } from '@/components/dashboard/EnhancedActivityFeed';
import { SystemStatusPanel } from '@/components/dashboard/SystemStatusPanel';
import { DemoControls } from '@/components/dashboard/DemoControls';
import { ArchitectureMiniMap } from '@/components/dashboard/ArchitectureMiniMap';
import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardPage() {
  // 使用 useDemoData hook，立即返回数据（50-300ms）
  // Hooks 必须在组件顶层调用
  const {
    summary,
    pipelineStages,
    tpsData,
    latencyP50Data,
    latencyP95Data,
    passRateData,
    nodes,
    tasks,
    receipts,
    events,
    services,
    queues,
    scenario,
    setScenario,
  } = useDemoData('busy');

  // 调试信息
  useEffect(() => {
    console.log('[Dashboard] Component mounted');
    console.log('[Dashboard] Data loaded:', {
      hasSummary: !!summary,
      pipelineStagesCount: pipelineStages?.length,
      tpsDataCount: tpsData?.length,
      nodesCount: nodes?.length,
      tasksCount: tasks?.length,
      summary,
    });
  }, [summary, pipelineStages, tpsData, nodes, tasks]);

  // 永远渲染完整框架，不等待 loading
  // 如果数据不存在，显示加载状态（但这种情况不应该发生，因为 useMemo 会立即返回数据）
  if (!summary || !pipelineStages || !tpsData || !nodes || !tasks) {
    console.warn('[Dashboard] Missing data:', {
      summary: !!summary,
      pipelineStages: !!pipelineStages,
      tpsData: !!tpsData,
      nodes: !!nodes,
      tasks: !!tasks,
    });
    return (
      <Shell>
        <div className="p-6">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h2 className="text-yellow-400 font-semibold mb-2">Loading Dashboard Data...</h2>
            <p className="text-slate-400 text-sm">Initializing mock data...</p>
            <pre className="mt-4 text-xs text-slate-500 overflow-auto">
              {JSON.stringify({ summary: !!summary, pipelineStages: !!pipelineStages, tpsData: !!tpsData, nodes: !!nodes, tasks: !!tasks }, null, 2)}
            </pre>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Network Operations Console</h1>
            <p className="text-slate-400">Proof-of-Inference DePIN Network Monitoring</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Activity className="w-4 h-4" />
            <span>Live</span>
          </div>
        </div>
      </motion.div>

      {/* Demo Controls (Mock Mode Only) */}
      {(typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_EDGE_API_MODE || 'mock') : 'mock') === 'mock' && (
        <DemoControls scenario={scenario} setScenario={setScenario} />
      )}

      {/* Network Health KPI Cards */}
      <NetworkHealthKpi
        summary={summary}
        tpsData={tpsData}
        latencyP50Data={latencyP50Data}
        latencyP95Data={latencyP95Data}
        passRateData={passRateData}
      />

      {/* Queue Depth & Dispute/Failed Rates */}
      <QueueDepthKpi summary={summary} />
      <DisputeFailedKpi summary={summary} />

      {/* Proof-of-Inference Pipeline */}
      <PipelineVisualization stages={pipelineStages} />

      {/* Enhanced Charts */}
      <EnhancedCharts
        tpsData={tpsData}
        latencyP50Data={latencyP50Data}
        latencyP95Data={latencyP95Data}
        passRateData={passRateData}
        summary={{
          passRate: summary.passRate,
          disputeRate: summary.disputeRate,
          failedRate: summary.failedRate,
        }}
      />

      {/* Recent Tasks Table */}
      <RecentTasksTable tasks={tasks} />

      {/* Two Column Layout: Nodes & Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <NodeDirectory nodes={nodes} />
        <ReceiptsList receipts={receipts} />
      </div>

      {/* System Status & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SystemStatusPanel services={services} />
        </div>
        <EnhancedActivityFeed events={events} />
      </div>

      {/* Architecture Mini Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Additional space for future content */}
        </div>
        <ArchitectureMiniMap />
      </div>
    </Shell>
  );
}
