'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ServiceStatus } from '@/lib/mock/fixtures';
import { Button } from '@/components/ui/button';

interface SystemStatusPanelProps {
  services: ServiceStatus[];
  onSimulateIncident?: (serviceName: string) => void;
}

export function SystemStatusPanel({ services, onSimulateIncident }: SystemStatusPanelProps) {
  const [simulatedService, setSimulatedService] = useState<string | null>(null);

  const handleSimulateIncident = (serviceName: string) => {
    setSimulatedService(serviceName);
    onSimulateIncident?.(serviceName);
  };

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return 'text-green-400';
    if (status === 'degraded') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBg = (status: string) => {
    if (status === 'healthy') return 'bg-green-500/10 border-green-500/30';
    if (status === 'degraded') return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          System Status
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSimulatedService(null)}
          className="text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {services.map((service) => {
          const isSimulated = simulatedService === service.name;
          const displayStatus = isSimulated ? 'degraded' : service.status;
          
          return (
            <div
              key={service.name}
              className={`p-3 rounded-lg border ${getStatusBg(displayStatus)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{service.name}</span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(displayStatus).replace('text-', 'bg-')}`} />
              </div>
              <div className="text-xs text-slate-400">
                Status: <span className={getStatusColor(displayStatus)}>{displayStatus}</span>
              </div>
              {service.latency && (
                <div className="text-xs text-slate-500 mt-1">
                  Latency: {service.latency}ms
                </div>
              )}
              {isSimulated && (
                <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Simulated incident
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const randomService = services[Math.floor(Math.random() * services.length)];
            handleSimulateIncident(randomService.name);
          }}
          className="w-full"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Simulate Incident
        </Button>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Randomly degrade one service to demonstrate alerting
        </p>
      </div>
    </motion.div>
  );
}
