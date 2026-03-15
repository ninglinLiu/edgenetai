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
import { Activity } from 'lucide-react';

export default function DashboardPage() {
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
    scenario,
    setScenario,
  } = useDemoData('busy');

  // Render a fallback only if fixture generation fails unexpectedly.
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

      {(typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_EDGE_API_MODE || 'mock') : 'mock') === 'mock' && (
        <DemoControls scenario={scenario} setScenario={setScenario} />
      )}

      <NetworkHealthKpi
        summary={summary}
        tpsData={tpsData}
        latencyP50Data={latencyP50Data}
        latencyP95Data={latencyP95Data}
        passRateData={passRateData}
      />

      <QueueDepthKpi summary={summary} />
      <DisputeFailedKpi summary={summary} />

      <PipelineVisualization stages={pipelineStages} />

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

      <RecentTasksTable tasks={tasks} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <NodeDirectory nodes={nodes} />
        <ReceiptsList receipts={receipts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SystemStatusPanel services={services} />
        </div>
        <EnhancedActivityFeed events={events} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
        </div>
        <ArchitectureMiniMap />
      </div>
    </Shell>
  );
}
