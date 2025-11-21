'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
  const router = useRouter();
  const [taskType, setTaskType] = useState<'LLM_SUMMARY' | 'OCR_IMAGE'>('LLM_SUMMARY');
  const [payload, setPayload] = useState('');
  const [slaTier, setSlaTier] = useState<'BRONZE' | 'SILVER' | 'GOLD'>('SILVER');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Call tRPC endpoint
      const response = await fetch('http://localhost:3001/trpc/task.create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: taskType,
          payload,
          slaTier,
        }),
      });

      const data = await response.json();
      if (data.result?.data?.taskId) {
        router.push(`/tasks/${data.result.data.taskId}`);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Submit Inference Task</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Task Type</label>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as 'LLM_SUMMARY' | 'OCR_IMAGE')}
            className="w-full p-2 border rounded"
          >
            <option value="LLM_SUMMARY">LLM Summary</option>
            <option value="OCR_IMAGE">OCR Image</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">
            {taskType === 'LLM_SUMMARY' ? 'Text' : 'Image (Base64)'}
          </label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder={
              taskType === 'LLM_SUMMARY'
                ? 'Enter text to summarize...'
                : 'Paste base64 encoded image...'
            }
            required
          />
        </div>

        <div>
          <label className="block mb-2">SLA Tier</label>
          <select
            value={slaTier}
            onChange={(e) => setSlaTier(e.target.value as 'BRONZE' | 'SILVER' | 'GOLD')}
            className="w-full p-2 border rounded"
          >
            <option value="BRONZE">Bronze (1 node)</option>
            <option value="SILVER">Silver (2 nodes)</option>
            <option value="GOLD">Gold (3 nodes)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Task'}
        </button>
      </form>
    </div>
  );
}

