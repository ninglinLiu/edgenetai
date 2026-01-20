'use client';

import { Shell } from '@/components/layout/Shell';
import { useParams } from 'next/navigation';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import { useEffect, useState } from 'react';
import type { Node, Task } from '@/lib/edge-api/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThroughputChart } from '@/components/charts/ThroughputChart';

export default function NodeDetailPage() {
  const params = useParams();
  const nodeId = params.id as string;
  const api = useEdgeApi();
  const [node, setNode] = useState<Node | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nodeId) return;

    const loadNode = async () => {
      try {
        const [nodeData, tasksData, chartData] = await Promise.all([
          api.getNode(nodeId),
          api.getNodeTasks(nodeId, 10),
          api.getNodeChartData(nodeId, 24),
        ]);
        setNode(nodeData);
        setTasks(tasksData);
        setChartData(chartData);
      } catch (error) {
        console.error('Failed to load node:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNode();
    const interval = setInterval(loadNode, 5000);
    return () => clearInterval(interval);
  }, [api, nodeId]);

  if (loading) {
    return (
      <Shell>
        <div className="text-center py-12 text-slate-400">Loading node...</div>
      </Shell>
    );
  }

  if (!node) {
    return (
      <Shell>
        <div className="text-center py-12 text-slate-400">Node not found</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Node Details</h1>
          <Link href="/explorer/nodes">
            <Button variant="outline">Back to Nodes</Button>
          </Link>
        </div>

        {/* Node Profile */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Node Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-400">Node ID</div>
              <div className="font-mono text-sm text-blue-400">{node.id}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Address</div>
              <div className="font-mono text-xs text-slate-300">{node.address.slice(0, 16)}...</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Status</div>
              <div className={`inline-block px-2 py-1 rounded text-xs ${node.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {node.status}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Region</div>
              <div className="text-white">{node.region || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Stake</div>
              <div className="text-white">{node.stake} ETH</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Uptime</div>
              <div className="text-white">{node.uptime.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Throughput</div>
              <div className="text-white">{node.throughput.toFixed(1)} tasks/h</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Avg Latency</div>
              <div className="text-white">{node.avgLatency.toFixed(0)}ms</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Pass Rate</div>
              <div className="text-white">{node.passRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Slashing Events</div>
              <div className="text-white">{node.slashingEvents}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Reputation</div>
              <div className="text-white">{node.reputation?.toFixed(1) || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData && (
          <div>
            <ThroughputChart data={chartData.tasks} />
          </div>
        )}

        {/* Recent Tasks */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No tasks found</div>
            ) : (
              tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="block p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm text-blue-400">{task.id}</div>
                    <div className="text-sm text-slate-400">{task.type}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
