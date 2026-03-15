'use client';

import { Shell } from '@/components/layout/Shell';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import type { Node } from '@/lib/edge-api/types';
import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const api = useEdgeApi();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNodes = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await api.listNodes();
        const rankedNodes = [...data].sort((a, b) => {
          const reputationDelta = (b.reputation ?? 0) - (a.reputation ?? 0);
          if (reputationDelta !== 0) return reputationDelta;

          const passRateDelta = b.passRate - a.passRate;
          if (passRateDelta !== 0) return passRateDelta;

          return a.avgLatency - b.avgLatency;
        });

        setNodes(rankedNodes);
      } catch (err) {
        console.error('Failed to load leaderboard nodes:', err);
        setError('Unable to load leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadNodes();
  }, [api]);

  if (loading) {
    return (
      <Shell>
        <div className="text-center py-12 text-slate-400">Loading leaderboard...</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Node Leaderboard</h1>
          <p className="text-slate-400">
            Ranked from the current mock node registry exposed through the shared `EdgeApi`
            interface.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900/80">
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Node ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Region</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Reputation</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Pass Rate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Avg Latency</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400">Throughput</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-red-400">
                    {error}
                  </td>
                </tr>
              ) : nodes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-400">
                    No nodes available in the current data source.
                  </td>
                </tr>
              ) : (
                nodes.map((node, index) => (
                  <tr key={node.id} className="border-b border-slate-800/60 last:border-b-0">
                    <td className="px-4 py-3 text-sm text-slate-300">#{index + 1}</td>
                    <td className="px-4 py-3 font-mono text-sm text-blue-400">{node.id}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        node.status === 'online'
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {node.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{node.region ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-white">{(node.reputation ?? 0).toFixed(1)}</td>
                    <td className="px-4 py-3 text-sm text-white">{node.passRate.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-sm text-white">{node.avgLatency.toFixed(0)} ms</td>
                    <td className="px-4 py-3 text-sm text-white">{node.throughput.toFixed(1)}/h</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
