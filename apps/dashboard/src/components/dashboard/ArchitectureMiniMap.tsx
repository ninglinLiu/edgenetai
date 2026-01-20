'use client';

import { motion } from 'framer-motion';
import { Server, Database, Activity, FileCode, ArrowRight } from 'lucide-react';

export function ArchitectureMiniMap() {
  const components = [
    {
      name: 'Router API',
      description: 'Fastify + tRPC, dispatches tasks',
      icon: Server,
      color: 'blue',
    },
    {
      name: 'BullMQ',
      description: 'Queue management',
      icon: Activity,
      color: 'purple',
    },
    {
      name: 'Node Agents',
      description: 'Python FastAPI + Ollama/PaddleOCR',
      icon: Server,
      color: 'green',
    },
    {
      name: 'Verifier',
      description: 'N-of-M consistency verification',
      icon: Activity,
      color: 'yellow',
    },
    {
      name: 'Contracts',
      description: 'Solidity Foundry, on-chain receipts',
      icon: FileCode,
      color: 'pink',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Architecture Overview</h3>
      
      <div className="space-y-3">
        {components.map((comp, idx) => {
          const Icon = comp.icon;
          const colorClasses = {
            blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
            purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
            green: 'bg-green-500/10 border-green-500/30 text-green-400',
            yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
            pink: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
          };
          
          return (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
            >
              <div className={`p-2 rounded-lg border ${colorClasses[comp.color as keyof typeof colorClasses]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{comp.name}</div>
                <div className="text-xs text-slate-400">{comp.description}</div>
              </div>
              {idx < components.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-500" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
