'use client';

import { motion } from 'framer-motion';
import { Receipt, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import type { Receipt as ReceiptType } from '@/lib/mock/fixtures';
import { CopyButton } from '@/components/common/CopyButton';

interface ReceiptsListProps {
  receipts: ReceiptType[];
}

export function ReceiptsList({ receipts }: ReceiptsListProps) {
  const getVerdictIcon = (verdict: ReceiptType['verdict']) => {
    switch (verdict) {
      case 'PASS':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'FAIL':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'DISPUTE':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getVerdictColor = (verdict: ReceiptType['verdict']) => {
    switch (verdict) {
      case 'PASS':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'FAIL':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'DISPUTE':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-purple-400" />
        On-chain Receipts
      </h3>

      <div className="space-y-3">
        {receipts.slice(0, 10).map((receipt, idx) => (
          <motion.div
            key={receipt.receiptId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getVerdictIcon(receipt.verdict)}
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getVerdictColor(receipt.verdict)}`}>
                  {receipt.verdict}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Block #{receipt.blockNumber}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">TX Hash</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-white font-mono bg-slate-900 px-2 py-1 rounded flex-1 truncate">
                    {receipt.txHash.slice(0, 20)}...
                  </code>
                  <CopyButton value={receipt.txHash} />
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Task ID</div>
                <code className="text-xs text-blue-400 font-mono">{receipt.taskId}</code>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div>Gas Used: {receipt.gasUsed.toLocaleString()}</div>
              <div>{new Date(receipt.timestamp).toLocaleString()}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
