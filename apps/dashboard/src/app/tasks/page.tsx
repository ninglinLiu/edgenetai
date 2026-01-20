'use client';

import { Shell } from '@/components/layout/Shell';
import { TaskTable } from '@/components/tasks/TaskTable';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import { useEffect, useState } from 'react';
import type { Task } from '@/lib/edge-api/types';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterChips } from '@/components/common/FilterChips';
import { safeApiCall } from '@/lib/utils/api-helpers';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function TasksPage() {
  const api = useEdgeApi();
  const fallbackTasks: Task[] = [];
  const [tasks, setTasks] = useState<Task[]>(fallbackTasks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await safeApiCall(() => api.listTasks(filters), fallbackTasks, 800);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tasks');
      setTasks(fallbackTasks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [api, filters]);

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Tasks</h1>
        <div className="flex gap-4 mb-4">
          <SearchBar
            placeholder="Search by Job ID..."
            onSearch={(query) => setFilters({ ...filters, search: query })}
          />
          <FilterChips
            filters={[
              { key: 'status', label: 'Status', options: ['QUEUED', 'ASSIGNED', 'INFERENCE', 'VERIFIED', 'SETTLED'] },
              { key: 'type', label: 'Type', options: ['LLM_SUMMARY', 'OCR_IMAGE'] },
              { key: 'slaTier', label: 'SLA', options: ['BRONZE', 'SILVER', 'GOLD'] },
            ]}
            selected={filters}
            onChange={setFilters}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-2">Error: {error}</p>
          <p className="text-slate-400 text-sm mb-4">Using fallback data.</p>
          <Button onClick={loadTasks} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </Shell>
  );
}
