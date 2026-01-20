'use client';

import { useEffect, useState } from 'react';

interface SectionNavProps {
  sections: number;
  currentSection: number;
  onNavigate: (index: number) => void;
}

export function SectionNav({ sections, currentSection, onNavigate }: SectionNavProps) {
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {Array.from({ length: sections }, (_, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSection === i
              ? 'bg-blue-400 scale-125'
              : 'bg-slate-600 hover:bg-slate-500'
          }`}
          aria-label={`Go to section ${i + 1}`}
        />
      ))}
    </div>
  );
}
