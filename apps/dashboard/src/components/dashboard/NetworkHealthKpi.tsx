'use client';

import { motion } from 'framer-motion';
import { Server, Zap, Clock, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import type { DashboardSummary, TimeSeriesPoint } from '@/lib/mock/fixtures';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  sparkline?: TimeSeriesPoint[];
  subtitle?: string;
  delay?: number;
}

function Sparkline({ data }: { data: TimeSeriesPoint[] }) {
  if (!data || data.length === 0) return null;
  
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 80;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="2"
        className="opacity-60"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function KpiCard({ title, value, icon: Icon, trend, sparkline, subtitle, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group relative overflow-hidden rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-6 hover:border-blue-500/30 transition-all duration-300"
    >
      {/* Glass morphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
            </div>
          )}
        </div>
        
        <div className="mb-2">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-slate-400">{title}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        
        {sparkline && (
          <div className="mt-4 -mx-6 -mb-6">
            <Sparkline data={sparkline} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface NetworkHealthKpiProps {
  summary: DashboardSummary;
  tpsData: TimeSeriesPoint[];
  latencyP50Data: TimeSeriesPoint[];
  latencyP95Data: TimeSeriesPoint[];
  passRateData: TimeSeriesPoint[];
}

export function NetworkHealthKpi({ summary, tpsData, latencyP50Data, latencyP95Data, passRateData }: NetworkHealthKpiProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard
        title="Active Nodes"
        value={`${summary.activeNodes}/${summary.registeredNodes}`}
        icon={Server}
        trend={{ value: 2.5, isPositive: true }}
        delay={0.1}
      />
      <KpiCard
        title="TPS"
        value={summary.tps.toFixed(2)}
        icon={Zap}
        sparkline={tpsData}
        delay={0.2}
      />
      <KpiCard
        title="Latency"
        value={`${summary.latencyP50}ms / ${summary.latencyP95}ms`}
        subtitle="p50 / p95"
        icon={Clock}
        sparkline={latencyP50Data}
        delay={0.3}
      />
      <KpiCard
        title="Pass Rate"
        value={`${summary.passRate.toFixed(1)}%`}
        icon={CheckCircle2}
        sparkline={passRateData}
        delay={0.4}
      />
    </div>
  );
}

export function QueueDepthKpi({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <KpiCard
        title="Router Queue"
        value={summary.queueDepth.router}
        icon={Activity}
        subtitle="Pending tasks"
        delay={0.5}
      />
      <KpiCard
        title="Verify Queue"
        value={summary.queueDepth.verify}
        icon={CheckCircle2}
        subtitle="Pending verifications"
        delay={0.6}
      />
      <KpiCard
        title="Settlement Queue"
        value={summary.queueDepth.settlement}
        icon={Activity}
        subtitle="Pending settlements"
        delay={0.7}
      />
    </div>
  );
}

export function DisputeFailedKpi({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <KpiCard
        title="Dispute Rate"
        value={`${summary.disputeRate.toFixed(1)}%`}
        icon={AlertTriangle}
        trend={{ value: summary.disputeRate, isPositive: false }}
        delay={0.8}
      />
      <KpiCard
        title="Failed Rate"
        value={`${summary.failedRate.toFixed(1)}%`}
        icon={AlertTriangle}
        trend={{ value: summary.failedRate, isPositive: false }}
        delay={0.9}
      />
    </div>
  );
}
