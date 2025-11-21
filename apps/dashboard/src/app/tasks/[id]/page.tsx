'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/trpc/task.status?input=${encodeURIComponent(JSON.stringify({ id: taskId }))}`
        );
        const data = await response.json();
        setTask(data.result?.data);
      } catch (error) {
        console.error('Failed to fetch task:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
    const interval = setInterval(fetchTask, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, [taskId]);

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (!task) {
    return <div className="container mx-auto p-8">Task not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Task Details</h1>
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {task.task.status}
        </div>
        <div>
          <strong>Type:</strong> {task.task.type}
        </div>
        {task.receipt && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <h2 className="font-bold">On-Chain Receipt</h2>
            <div>TX Hash: {task.receipt.txHash}</div>
            <div>Block: {task.receipt.blockNumber}</div>
          </div>
        )}
        {task.executions && task.executions.length > 0 && (
          <div className="mt-4">
            <h2 className="font-bold">Executions</h2>
            {task.executions.map((exec: any) => (
              <div key={exec.id} className="p-2 border rounded mt-2">
                Node: {exec.nodeId} | Latency: {exec.latencyMs}ms
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

