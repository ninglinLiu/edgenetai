'use client';

import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch nodes from API
    setNodes([]);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Node Leaderboard</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Node ID</th>
            <th className="border p-2">Region</th>
            <th className="border p-2">Reputation</th>
            <th className="border p-2">Success Rate</th>
            <th className="border p-2">Latency Score</th>
          </tr>
        </thead>
        <tbody>
          {nodes.length === 0 ? (
            <tr>
              <td colSpan={5} className="border p-2 text-center">
                No nodes registered
              </td>
            </tr>
          ) : (
            nodes.map((node) => (
              <tr key={node.id}>
                <td className="border p-2">{node.id}</td>
                <td className="border p-2">{node.region}</td>
                <td className="border p-2">{node.reputation}</td>
                <td className="border p-2">{(node.successRate * 100).toFixed(1)}%</td>
                <td className="border p-2">{(node.latencyScore * 100).toFixed(1)}%</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

