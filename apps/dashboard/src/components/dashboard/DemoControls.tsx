'use client';

import { motion } from 'framer-motion';
import { Settings, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import type { DemoScenario } from '@/lib/mock/fixtures';
import { Button } from '@/components/ui/button';

interface DemoControlsProps {
  scenario: DemoScenario;
  setScenario: (scenario: DemoScenario) => void;
}

export function DemoControls({ scenario, setScenario }: DemoControlsProps) {
  const scenarios: { id: DemoScenario; label: string; description: string; color: string }[] = [
    { id: 'quiet', label: 'Quiet', description: 'Low load, optimal performance', color: 'green' },
    { id: 'busy', label: 'Busy', description: 'Normal operational load', color: 'blue' },
    { id: 'congested', label: 'Congested', description: 'High load, degraded performance', color: 'red' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-semibold text-white">Demo Controls</h3>
        </div>
        <div className="text-xs text-slate-500">Mock Mode Only</div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {scenarios.map((s) => {
          const isActive = scenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className={`relative p-3 rounded-lg border transition-all ${
                isActive
                  ? s.color === 'green' 
                    ? 'border-green-500/50 bg-green-600/10'
                    : s.color === 'blue'
                    ? 'border-blue-500/50 bg-blue-600/10'
                    : 'border-red-500/50 bg-red-600/10'
                  : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {s.label}
                </span>
                {isActive && (
                  <div className={`w-2 h-2 rounded-full ${
                    s.color === 'green' ? 'bg-green-400' : s.color === 'blue' ? 'bg-blue-400' : 'bg-red-400'
                  }`} />
                )}
              </div>
              <p className="text-xs text-slate-500 text-left">{s.description}</p>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-400">
            Switching scenarios updates all mock data: TPS, latency, queue depth, pass rate, and dispute rate.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
