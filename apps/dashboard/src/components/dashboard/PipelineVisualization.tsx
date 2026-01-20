'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PipelineStage } from '@/lib/mock/fixtures';

interface PipelineVisualizationProps {
  stages: PipelineStage[];
}

export function PipelineVisualization({ stages }: PipelineVisualizationProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  return (
    <div className="mb-8 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
        Proof-of-Inference Pipeline
      </h2>
      
      <div className="relative">
        {/* Pipeline line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 -translate-y-1/2" />
        
        <div className="relative grid grid-cols-6 gap-4">
          {stages.map((stage, index) => {
            const isExpanded = expandedStage === stage.id;
            const isHealthy = stage.successRate > 95;
            const isWarning = stage.successRate > 90 && stage.successRate <= 95;
            
            return (
              <div key={stage.id} className="relative">
                {/* Stage card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 cursor-pointer hover:border-blue-500/50 transition-all group"
                  onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                >
                  {/* Status indicator */}
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                    isHealthy ? 'bg-green-400' : isWarning ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-white mb-2">{stage.name}</h3>
                    
                    {stage.pending > 0 && (
                      <div className="mb-2">
                        <div className="text-xs text-slate-400">Pending</div>
                        <div className="text-lg font-bold text-blue-400">{stage.pending}</div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{stage.avgDuration}ms</span>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-slate-400">{stage.successRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  {/* Expand indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </motion.div>
                
                {/* Expanded description */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30"
                    >
                      <p className="text-sm text-slate-300">{stage.description}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-slate-500">Pending</div>
                          <div className="text-white font-semibold">{stage.pending}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Avg Duration</div>
                          <div className="text-white font-semibold">{stage.avgDuration}ms</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Success Rate</div>
                          <div className="text-white font-semibold">{stage.successRate.toFixed(1)}%</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
