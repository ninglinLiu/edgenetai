'use client';

import './marketing.css';

interface MarqueePillsProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
}

export function MarqueePills({ items, speed = 20, direction = 'left' }: MarqueePillsProps) {
  const duplicatedItems = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className={`inline-flex gap-4 ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <span
            key={idx}
            className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-slate-300 text-sm font-medium backdrop-blur-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
