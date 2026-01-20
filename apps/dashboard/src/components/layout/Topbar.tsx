'use client';

import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import { useNetworkStats } from '@/hooks/useNetworkStats';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { Activity, Zap, Clock, CheckCircle2 } from 'lucide-react';

export function Topbar() {
  console.log('[Topbar] Component rendering...');
  let statsResult;
  try {
    statsResult = useNetworkStats();
    console.log('[Topbar] useNetworkStats succeeded:', statsResult);
  } catch (err) {
    console.error('[Topbar] useNetworkStats failed:', err);
    statsResult = { stats: null, loading: false };
  }
  const { stats } = statsResult;

  return (
    <div className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-slate-400">Nodes:</span>
            <span className="text-white font-medium">
              {stats?.onlineNodes || 0}/{stats?.totalNodes || 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-400">TPS:</span>
            <span className="text-white font-medium">{stats?.tps?.toFixed(2) || '0.00'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400">Latency:</span>
            <span className="text-white font-medium">{stats?.avgLatency?.toFixed(0) || '0'}ms</span>
          </div>

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-slate-400">Pass Rate:</span>
            <span className="text-white font-medium">{stats?.passRate?.toFixed(1) || '0.0'}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <WalletConnect />
      </div>
    </div>
  );
}
