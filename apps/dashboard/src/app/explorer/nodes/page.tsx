'use client';

import { Shell } from '@/components/layout/Shell';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import { useEffect, useState } from 'react';
import type { Node } from '@/lib/edge-api/types';
import type { NodeFilters } from '@/lib/edge-api/EdgeApi';
import Link from 'next/link';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterChips } from '@/components/common/FilterChips';

export default function NodesPage() {
  const api = useEdgeApi();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<NodeFilters>({});

  useEffect(() => {
    const loadNodes = async () => {
      setLoading(true);
      try {
        const data = await api.listNodes(filters);
        setNodes(data);
      } catch (error) {
        console.error('Failed to load nodes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNodes();
  }, [api, filters]);

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Network Nodes</h1>
        <div className="flex gap-4 mb-4">
          <SearchBar
            placeholder="Search by Node ID or Address..."
            onSearch={(query) => setFilters({ ...filters, search: query })}
          />
          <FilterChips
            filters={[
              { key: 'status', label: 'Status', options: ['online', 'offline'] },
            ]}
            selected={filters}
            onChange={setFilters}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading nodes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node) => (
            <Link key={node.id} href={`/explorer/nodes/${node.id}`}>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-mono text-sm text-blue-400">{node.id}</div>
                  <div className={`w-3 h-3 rounded-full ${node.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stake:</span>
                    <span className="text-white">{node.stake} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uptime:</span>
                    <span className="text-white">{node.uptime.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Throughput:</span>
                    <span className="text-white">{node.throughput.toFixed(1)}/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Latency:</span>
                    <span className="text-white">{node.avgLatency.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pass Rate:</span>
                    <span className="text-white">{node.passRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Shell>
  );
}
