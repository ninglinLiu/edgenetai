'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendBadgeProps {
  value: number;
  isPositive: boolean;
}

export function TrendBadge({ value, isPositive }: TrendBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
        isPositive
          ? 'bg-green-500/20 text-green-400'
          : 'bg-red-500/20 text-red-400'
      )}
    >
      {isPositive ? (
        <ArrowUp className="w-3 h-3" />
      ) : (
        <ArrowDown className="w-3 h-3" />
      )}
      <span>{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
}
