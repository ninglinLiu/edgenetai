'use client';

import type { Task, TaskResult } from '@/lib/edge-api/types';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskResultCardProps {
  task: Task;
  result: TaskResult;
}

export function TaskResultCard({ task, result }: TaskResultCardProps) {
  const getResultIcon = () => {
    switch (result.verificationResult) {
      case 'PASS':
        return <CheckCircle2 className="w-6 h-6 text-green-400" />;
      case 'FAIL':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'DISPUTE':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
    }
  };

  const getResultColor = () => {
    switch (result.verificationResult) {
      case 'PASS':
        return 'border-green-500/30 bg-green-500/10';
      case 'FAIL':
        return 'border-red-500/30 bg-red-500/10';
      case 'DISPUTE':
        return 'border-yellow-500/30 bg-yellow-500/10';
    }
  };

  return (
    <div className={cn('border rounded-xl p-6', getResultColor())}>
      <div className="flex items-center gap-3 mb-4">
        {getResultIcon()}
        <h3 className="text-lg font-semibold text-white">
          Verification Result: {result.verificationResult}
        </h3>
      </div>

      {task.type === 'LLM_SUMMARY' && result.summary && (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400 mb-2">Summary:</p>
            <p className="text-slate-200 bg-slate-900/50 rounded-lg p-4">{result.summary}</p>
          </div>
          {result.similarityScore !== undefined && (
            <div>
              <p className="text-sm text-slate-400">Similarity Score:</p>
              <p className="text-lg font-semibold text-white">
                {(result.similarityScore * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      )}

      {task.type === 'OCR_IMAGE' && result.ocrText && (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400 mb-2">OCR Text:</p>
            <p className="text-slate-200 bg-slate-900/50 rounded-lg p-4 font-mono text-sm">
              {result.ocrText}
            </p>
          </div>
          {result.editDistance !== undefined && (
            <div>
              <p className="text-sm text-slate-400">Edit Distance:</p>
              <p className="text-lg font-semibold text-white">{result.editDistance}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
