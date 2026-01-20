'use client';

import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Database, Zap } from 'lucide-react';

export default function SettingsPage() {
  const apiMode = process.env.NEXT_PUBLIC_EDGE_API_MODE || 'mock';

  return (
    <Shell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-slate-400">Configure your EdgeNet.AI dashboard preferences</p>
        </div>

        {/* API Mode */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold">Data Source</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <div className="font-medium text-white mb-1">Current Mode</div>
                <div className="text-sm text-slate-400">
                  {apiMode === 'mock' ? 'Using mock data for development' : 'Using tRPC API'}
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${
                apiMode === 'mock'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {apiMode.toUpperCase()}
              </div>
            </div>
            <div className="text-sm text-slate-500">
              To switch modes, set the <code className="px-2 py-1 bg-slate-900 rounded text-slate-300">NEXT_PUBLIC_EDGE_API_MODE</code> environment variable to <code className="px-2 py-1 bg-slate-900 rounded text-slate-300">mock</code> or <code className="px-2 py-1 bg-slate-900 rounded text-slate-300">trpc</code>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold">Network Configuration</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="font-medium text-white mb-2">RPC Endpoint</div>
              <div className="text-sm text-slate-400 font-mono">
                {process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'}
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="font-medium text-white mb-2">Chain</div>
              <div className="text-sm text-slate-400">Anvil (Local Development)</div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <div className="space-y-2 text-sm text-slate-400">
            <p>EdgeNet.AI Dashboard v0.1.0</p>
            <p>Proof-of-Inference DePIN Network</p>
            <p className="pt-4 text-xs text-slate-500">
              This dashboard provides a comprehensive view of the EdgeNet.AI network, allowing you to submit tasks, monitor network status, and explore on-chain receipts.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
