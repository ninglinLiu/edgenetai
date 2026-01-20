'use client';

export function DotGridBackground() {
  return (
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0',
      }}
    />
  );
}
