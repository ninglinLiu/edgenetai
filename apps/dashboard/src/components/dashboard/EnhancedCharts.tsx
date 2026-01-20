'use client';

import { useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TimeSeriesPoint } from '@/lib/mock/fixtures';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

function ChartCard({ title, children, delay = 0 }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}

interface EnhancedChartsProps {
  tpsData: TimeSeriesPoint[];
  latencyP50Data: TimeSeriesPoint[];
  latencyP95Data: TimeSeriesPoint[];
  passRateData: TimeSeriesPoint[];
  summary: {
    passRate: number;
    disputeRate: number;
    failedRate: number;
  };
}

export function EnhancedCharts({ tpsData, latencyP50Data, latencyP95Data, passRateData, summary }: EnhancedChartsProps) {
  const tpsChartData = useMemo(() => 
    tpsData.map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      tps: d.value,
    })), [tpsData]
  );

  const latencyChartData = useMemo(() => 
    latencyP50Data.map((d, i) => ({
      time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      p50: d.value,
      p95: latencyP95Data[i]?.value || 0,
    })), [latencyP50Data, latencyP95Data]
  );

  const outcomeData = useMemo(() => [
    { name: 'Pass', value: summary.passRate, color: '#10b981' },
    { name: 'Dispute', value: summary.disputeRate, color: '#f59e0b' },
    { name: 'Fail', value: summary.failedRate, color: '#ef4444' },
  ], [summary]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <ChartCard title="TPS Over Time" delay={0.1}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={tpsChartData}>
            <defs>
              <linearGradient id="tpsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="tps"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#tpsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Latency p50 / p95" delay={0.2}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={latencyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="p50" stroke="#3b82f6" strokeWidth={2} name="p50" />
            <Line type="monotone" dataKey="p95" stroke="#8b5cf6" strokeWidth={2} name="p95" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Pass / Fail / Dispute Distribution" delay={0.3}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={outcomeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              {outcomeData.map((entry, index) => (
                <Bar key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Pass Rate Trend" delay={0.4}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={passRateData.map(d => ({
            time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            rate: d.value,
          }))}>
            <defs>
              <linearGradient id="passRateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#passRateGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
