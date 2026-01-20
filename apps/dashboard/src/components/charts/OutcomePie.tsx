'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { OutcomeData } from '@/lib/edge-api/types';

interface OutcomePieProps {
  data: OutcomeData;
}

const COLORS = {
  pass: '#10b981',
  fail: '#ef4444',
  dispute: '#f59e0b',
};

export function OutcomePie({ data }: OutcomePieProps) {
  const chartData = [
    { name: 'Pass', value: data.pass, color: COLORS.pass },
    { name: 'Fail', value: data.fail, color: COLORS.fail },
    { name: 'Dispute', value: data.dispute, color: COLORS.dispute },
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Verification Outcomes</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
