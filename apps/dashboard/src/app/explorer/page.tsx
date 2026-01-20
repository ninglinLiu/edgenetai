'use client';

import { Shell } from '@/components/layout/Shell';
import { KpiCard } from '@/components/kpi/KpiCard';
import { ThroughputChart } from '@/components/charts/ThroughputChart';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Server, Receipt, ListTodo, Activity, RefreshCw } from 'lucide-react';
import { safeApiCall } from '@/lib/utils/api-helpers';
import type { NetworkStats, ThroughputDataPoint } from '@/lib/edge-api/types';

export default function ExplorerPage() {
  const api = useEdgeApi();
  const fallbackStats: NetworkStats = {
    onlineNodes: 8,
    totalNodes: 10,
    tasks24h: 150,
    avgLatency: 250,
    passRate: 92.5,
    settlement24h: 12.5,
    tps: 2.5,
    disputeRate: 5.2,
  };
  const fallbackThroughput: ThroughputDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: 1.5 + Math.random() * 2,
  }));

  const [stats, setStats] = useState<NetworkStats>(fallbackStats);
  const [throughputData, setThroughputData] = useState<ThroughputDataPoint[]>(fallbackThroughput);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [statsResult, throughputResult] = await Promise.all([
        safeApiCall(() => api.getNetworkStats(), fallbackStats, 800),
        safeApiCall(() => api.getThroughputData(24), fallbackThroughput, 800),
      ]);
      setStats(statsResult);
      setThroughputData(throughputResult);
    } catch (err) {
      console.error('[Explorer] Failed to load data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setStats(fallbackStats);
      setThroughputData(fallbackThroughput);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Network Explorer</h1>
        <p className="text-slate-400">Explore the EdgeNet.AI network status and activity</p>
        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm">Warning: {error}</p>
              <p className="text-slate-500 text-xs mt-1">Using fallback data</p>
            </div>
            <Button onClick={loadData} size="sm" variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Online Nodes"
          value={`${stats?.onlineNodes || 0}/${stats?.totalNodes || 0}`}
          icon={Server}
        />
        <KpiCard
          title="Tasks (24h)"
          value={stats?.tasks24h || 0}
          icon={Activity}
        />
        <KpiCard
          title="TPS"
          value={stats?.tps?.toFixed(2) || '0.00'}
          icon={Activity}
        />
        <KpiCard
          title="Pass Rate"
          value={`${stats?.passRate?.toFixed(1) || 0}%`}
          icon={Activity}
        />
      </div>

      {/* Chart */}
      <div className="mb-8">
        <ThroughputChart data={throughputData} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/explorer/nodes">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all cursor-pointer">
            <Server className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nodes</h3>
            <p className="text-slate-400 text-sm">View all network nodes and their status</p>
          </div>
        </Link>
        <Link href="/explorer/receipts">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all cursor-pointer">
            <Receipt className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Receipts</h3>
            <p className="text-slate-400 text-sm">Browse on-chain inference receipts</p>
          </div>
        </Link>
        <Link href="/tasks">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all cursor-pointer">
            <ListTodo className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tasks</h3>
            <p className="text-slate-400 text-sm">View all inference tasks</p>
          </div>
        </Link>
      </div>
    </Shell>
  );
}
