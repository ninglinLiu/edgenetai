'use client';

import { cn } from '@/lib/utils';

interface FilterOption {
  key: string;
  label: string;
  options: string[];
}

interface FilterChipsProps {
  filters: FilterOption[];
  selected: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
}

export function FilterChips({ filters, selected, onChange }: FilterChipsProps) {
  const handleToggle = (key: string, value: string) => {
    const newFilters = { ...selected };
    if (newFilters[key] === value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <span className="text-sm text-slate-400">{filter.label}:</span>
          {filter.options.map((option) => (
            <button
              key={option}
              onClick={() => handleToggle(filter.key, option)}
              className={cn(
                'px-3 py-1 rounded-lg text-sm transition-all',
                selected[filter.key] === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
