'use client';

import { Shell } from '@/components/layout/Shell';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import { useEffect, useState } from 'react';
import type { Receipt } from '@/lib/edge-api/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/common/CopyButton';

interface ReceiptDetailClientProps {
  receiptId: string;
}

export function ReceiptDetailClient({ receiptId }: ReceiptDetailClientProps) {
  const api = useEdgeApi();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!receiptId) return;

    const loadReceipt = async () => {
      try {
        const data = await api.getReceipt(receiptId);
        setReceipt(data);
      } catch (error) {
        console.error('Failed to load receipt:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReceipt();
  }, [api, receiptId]);

  if (loading) {
    return (
      <Shell>
        <div className="text-center py-12 text-slate-400">Loading receipt...</div>
      </Shell>
    );
  }

  if (!receipt) {
    return (
      <Shell>
        <div className="text-center py-12 text-slate-400">Receipt not found</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Receipt Details</h1>
          <Link href="/explorer/receipts">
            <Button variant="outline">Back to Receipts</Button>
          </Link>
        </div>

        {/* Receipt Info */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Receipt Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Receipt ID:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-blue-400">{receipt.receiptId}</span>
                <CopyButton text={receipt.receiptId} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Job ID:</span>
              <div className="flex items-center gap-2">
                <Link href={`/tasks/${receipt.jobId}`} className="font-mono text-blue-400 hover:underline">
                  {receipt.jobId}
                </Link>
                <CopyButton text={receipt.jobId} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">TX Hash:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-300">{receipt.txHash}</span>
                <CopyButton text={receipt.txHash} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Block Number:</span>
              <span className="text-white">{receipt.blockNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Chain:</span>
              <span className="text-white">{receipt.chain}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Verifier:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-300">{receipt.verifier}</span>
                <CopyButton text={receipt.verifier} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Model Hash:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-300">{receipt.modelHash}</span>
                <CopyButton text={receipt.modelHash} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Latency:</span>
              <span className="text-white">{receipt.latency}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-white">{new Date(receipt.timestamp).toLocaleString()}</span>
            </div>
            {receipt.nodeSet && receipt.nodeSet.length > 0 && (
              <div>
                <span className="text-slate-400">Node Set:</span>
                <div className="mt-2 space-y-1">
                  {receipt.nodeSet.map((nodeId, idx) => (
                    <div key={idx} className="font-mono text-sm text-slate-300">
                      {nodeId}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verification Command */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Verification Command</h2>
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
            <code className="text-sm text-slate-300">
              edgenet verify --receipt {receipt.receiptId}
            </code>
            <CopyButton
              text={`edgenet verify --receipt ${receipt.receiptId}`}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </Shell>
  );
}
