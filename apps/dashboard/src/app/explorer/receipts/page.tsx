'use client';

import { Shell } from '@/components/layout/Shell';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import { useEffect, useState } from 'react';
import type { Receipt } from '@/lib/edge-api/types';
import Link from 'next/link';
import { SearchBar } from '@/components/common/SearchBar';
import { CopyButton } from '@/components/common/CopyButton';

export default function ReceiptsPage() {
  const api = useEdgeApi();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadReceipts = async () => {
      setLoading(true);
      try {
        const filters: any = {};
        if (searchQuery) {
          if (searchQuery.startsWith('0x')) {
            filters.txHash = searchQuery;
          } else {
            filters.jobId = searchQuery;
          }
        }
        const data = await api.listReceipts(filters);
        setReceipts(data);
      } catch (error) {
        console.error('Failed to load receipts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReceipts();
  }, [api, searchQuery]);

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">On-Chain Receipts</h1>
        <div className="mb-4">
          <SearchBar
            placeholder="Search by Job ID or TX Hash..."
            onSearch={setSearchQuery}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading receipts...</div>
      ) : (
        <div className="space-y-4">
          {receipts.map((receipt) => (
            <Link key={receipt.receiptId} href={`/explorer/receipts/${receipt.receiptId}`}>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-mono text-sm text-blue-400">{receipt.receiptId}</div>
                  <div className="text-sm text-slate-400">{receipt.chain}</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Job ID</div>
                    <div className="font-mono text-xs text-slate-300">{receipt.jobId}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">TX Hash</div>
                    <div className="font-mono text-xs text-slate-300">{receipt.txHash.slice(0, 16)}...</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Block</div>
                    <div className="text-white">{receipt.blockNumber}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Latency</div>
                    <div className="text-white">{receipt.latency}ms</div>
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
