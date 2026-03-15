'use client';

import { useEffect, useRef, useState } from 'react';
import './marketing.css';

interface AnimatedGeometryProps {
  className?: string;
  variant?: 1 | 2 | 3 | 4; // Four distinct visual variants
}

export function AnimatedGeometry({ className = '', variant = 1 }: AnimatedGeometryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [parallaxPos, setParallaxPos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const animationFrameRef = useRef<number>();

  // Smooth lerp for parallax
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setParallaxPos((prev) => ({
        x: lerp(prev.x, mousePos.x, 0.05),
        y: lerp(prev.y, mousePos.y, 0.05),
      }));
      setTime((prev) => prev + 0.02);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setMousePos({
      x: (e.clientX - rect.left - centerX) * 0.1,
      y: (e.clientY - rect.top - centerY) * 0.1,
    });
  };

  // Variant 1: layered cube network with rotating shapes
  const renderVariant1 = () => (
    <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="grad1-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="grad1-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="grad1-3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Multiple rotating cubes */}
      {[0, 1, 2].map((i) => {
        const angle = time * (20 + i * 10) + i * 120;
        const x = 200 + i * 200 + parallaxPos.x * (0.5 + i * 0.2);
        const y = 200 + Math.sin(time + i) * 50 + parallaxPos.y * (0.5 + i * 0.2);
        return (
          <g key={i} transform={`translate(${x}, ${y}) rotate(${angle})`}>
            <path
              d="M -60 -60 L 60 -60 L 60 60 L -60 60 Z M -60 -60 L -30 -90 L 30 -90 L 60 -60 M 60 -60 L 90 -30 L 90 30 L 60 60 M 60 60 L 30 90 L -30 90 L -60 60"
              fill="none"
              stroke={`url(#grad1-${(i % 3) + 1})`}
              strokeWidth="2"
              strokeDasharray="12 6"
              className="dash-animate"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          </g>
        );
      })}

      {/* Connecting line network */}
      <g stroke="url(#grad1-1)" strokeWidth="1.5" opacity="0.4">
        {[0, 1, 2].map((i) => (
          <line
            key={i}
            x1={200 + i * 200 + parallaxPos.x * 0.3}
            y1={200 + parallaxPos.y * 0.3}
            x2={200 + ((i + 1) % 3) * 200 + parallaxPos.x * 0.3}
            y2={200 + parallaxPos.y * 0.3}
            strokeDasharray="8 4"
            className="dash-animate"
          />
        ))}
      </g>

      {/* Rotating octagon */}
      <g transform={`translate(${600 + parallaxPos.x * 0.7}, ${400 + parallaxPos.y * 0.7}) rotate(${time * 30})`}>
        <path
          d="M 0 -70 L 49 -49 L 70 0 L 49 49 L 0 70 L -49 49 L -70 0 L -49 -49 Z"
          fill="none"
          stroke="url(#grad1-2)"
          strokeWidth="2.5"
          strokeDasharray="10 5"
          className="dash-animate"
        />
      </g>

      {/* Extra rotating stars */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = time * (30 + i * 5) + i * 72;
        const radius = 120;
        const x = 400 + Math.cos(angle * (Math.PI / 180)) * radius + parallaxPos.x * 0.4;
        const y = 300 + Math.sin(angle * (Math.PI / 180)) * radius + parallaxPos.y * 0.4;
        return (
          <g key={`star-${i}`} transform={`translate(${x}, ${y}) rotate(${time * 20 + i * 30})`}>
            <path
              d="M 0 -20 L 6 -6 L 20 -6 L 9 2 L 12 16 L 0 8 L -12 16 L -9 2 L -20 -6 L -6 -6 Z"
              fill="none"
              stroke="url(#grad1-1)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="dash-animate"
              opacity="0.6"
            />
          </g>
        );
      })}

      {/* Gradient glows */}
      <circle cx={400 + parallaxPos.x * 0.3} cy={300 + parallaxPos.y * 0.3} r={140 + Math.sin(time * 2) * 20} fill="url(#grad1-1)" className="blur-3xl opacity-25" />
      <circle cx={600 + parallaxPos.x * 0.4} cy={200 + parallaxPos.y * 0.4} r={100 + Math.cos(time * 2.5) * 15} fill="url(#grad1-2)" className="blur-3xl opacity-20" />
      <circle cx={200 + parallaxPos.x * 0.5} cy={450 + parallaxPos.y * 0.5} r={90 + Math.sin(time * 3) * 10} fill="url(#grad1-3)" className="blur-3xl opacity-15" />
    </svg>
  );

  // Variant 2: hexagonal lattice with particle effects
  const renderVariant2 = () => (
    <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="grad2-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="grad2-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Honeycomb lattice */}
      {[0, 1, 2, 3, 4].map((row) => {
        return [0, 1, 2, 3].map((col) => {
          const x = 150 + col * 180 + (row % 2) * 90 + parallaxPos.x * (0.3 + row * 0.1);
          const y = 100 + row * 100 + parallaxPos.y * (0.3 + col * 0.1);
          const size = 40 + Math.sin(time + row + col) * 5;
          return (
            <g key={`${row}-${col}`} transform={`translate(${x}, ${y}) rotate(${time * (5 + row + col)})`}>
              <path
                d={`M 0 -${size} L ${size * 0.866} -${size * 0.5} L ${size * 0.866} ${size * 0.5} L 0 ${size} L -${size * 0.866} ${size * 0.5} L -${size * 0.866} -${size * 0.5} Z`}
                fill="none"
                stroke={row % 2 === 0 ? "url(#grad2-1)" : "url(#grad2-2)"}
                strokeWidth="2"
                strokeDasharray="8 4"
                className="dash-animate"
                style={{ animationDelay: `${(row + col) * 0.2}s` }}
              />
            </g>
          );
        });
      })}

      {/* Connection lines */}
      <g stroke="url(#grad2-1)" strokeWidth="1" opacity="0.3">
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={150 + i * 180 + parallaxPos.x * 0.3}
            y1={200 + parallaxPos.y * 0.3}
            x2={150 + ((i + 1) % 4) * 180 + parallaxPos.x * 0.3}
            y2={200 + parallaxPos.y * 0.3}
            strokeDasharray="6 3"
            className="dash-animate"
          />
        ))}
      </g>

      {/* Particle nodes */}
      {Array.from({ length: 15 }, (_, i) => {
        const angle = (time * 50 + i * 24) * (Math.PI / 180);
        const radius = 150 + Math.sin(time * 2 + i) * 30;
        const x = 400 + Math.cos(angle) * radius + parallaxPos.x * 0.4;
        const y = 300 + Math.sin(angle) * radius + parallaxPos.y * 0.4;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="url(#grad2-1)"
            opacity={0.6 + Math.sin(time + i) * 0.3}
          />
        );
      })}

      {/* Extra rotating triangles */}
      {[0, 1, 2, 3].map((i) => {
        const angle = time * (25 + i * 10) + i * 90;
        const radius = 180;
        const x = 400 + Math.cos(angle * (Math.PI / 180)) * radius + parallaxPos.x * 0.5;
        const y = 300 + Math.sin(angle * (Math.PI / 180)) * radius + parallaxPos.y * 0.5;
        return (
          <g key={`tri-${i}`} transform={`translate(${x}, ${y}) rotate(${time * 15 + i * 45})`}>
            <path
              d="M 0 -30 L 26 15 L -26 15 Z"
              fill="none"
              stroke="url(#grad2-2)"
              strokeWidth="2"
              strokeDasharray="6 3"
              className="dash-animate"
              opacity="0.5"
            />
          </g>
        );
      })}

      {/* Gradient glows */}
      <circle cx={400 + parallaxPos.x * 0.3} cy={300 + parallaxPos.y * 0.3} r={160 + Math.sin(time * 2.5) * 25} fill="url(#grad2-1)" className="blur-3xl opacity-30" />
      <circle cx={600 + parallaxPos.x * 0.5} cy={150 + parallaxPos.y * 0.5} r={110 + Math.cos(time * 3) * 18} fill="url(#grad2-2)" className="blur-3xl opacity-25" />
      <circle cx={200 + parallaxPos.x * 0.4} cy={450 + parallaxPos.y * 0.4} r={90 + Math.sin(time * 2) * 12} fill="url(#grad2-1)" className="blur-3xl opacity-20" />
    </svg>
  );

  // Variant 3: linked nodes with pulse effects
  const renderVariant3 = () => (
    <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="grad3-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="grad3-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Linked nodes */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 150 + i * 150 + parallaxPos.x * (0.4 + i * 0.1);
        const y = 200 + Math.sin(time * 2 + i) * 40 + parallaxPos.y * (0.4 + i * 0.1);
        const pulse = 1 + Math.sin(time * 3 + i) * 0.3;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={30 * pulse}
              fill="none"
              stroke="url(#grad3-1)"
              strokeWidth="2.5"
              strokeDasharray="10 5"
              className="dash-animate"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
            <circle
              cx={x}
              cy={y}
              r={15 * pulse}
              fill="url(#grad3-1)"
              opacity={0.3}
            />
            {i < 4 && (
              <line
                x1={x + 30 * pulse}
                y1={y}
                x2={x + 150 - 30 * pulse}
                y2={y + Math.sin(time * 2 + i + 1) * 40 - Math.sin(time * 2 + i) * 40}
                stroke="url(#grad3-2)"
                strokeWidth="2"
                strokeDasharray="12 6"
                className="dash-animate"
              />
            )}
          </g>
        );
      })}

      {/* Rotating star */}
      <g transform={`translate(${600 + parallaxPos.x * 0.6}, ${400 + parallaxPos.y * 0.6}) rotate(${time * 40})`}>
        <path
          d="M 0 -60 L 18 -18 L 60 -18 L 28 6 L 36 48 L 0 24 L -36 48 L -28 6 L -60 -18 L -18 -18 Z"
          fill="none"
          stroke="url(#grad3-1)"
          strokeWidth="2.5"
          strokeDasharray="8 4"
          className="dash-animate"
        />
        <path
          d="M 0 -40 L 12 -12 L 40 -12 L 18 4 L 24 32 L 0 16 L -24 32 L -18 4 L -40 -12 L -12 -12 Z"
          fill="none"
          stroke="url(#grad3-2)"
          strokeWidth="2"
          strokeDasharray="6 3"
          className="dash-animate"
          style={{ animationDelay: '0.5s' }}
        />
      </g>

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => {
        const x = 200 + i * 200 + parallaxPos.x * 0.3;
        const y = 450 + parallaxPos.y * 0.3;
        const pulse = 1 + Math.sin(time * 2 + i * 2) * 0.5;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={50 * pulse}
            fill="none"
            stroke="url(#grad3-2)"
            strokeWidth="2"
            opacity={0.4 / pulse}
            className="dash-animate"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        );
      })}

      {/* Extra connector nodes */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (time * 10 + i * 45) * (Math.PI / 180);
        const radius = 150;
        const x = 400 + Math.cos(angle) * radius + parallaxPos.x * 0.5;
        const y = 300 + Math.sin(angle) * radius + parallaxPos.y * 0.5;
        const pulse = 1 + Math.sin(time * 2 + i) * 0.3;
        return (
          <circle
            key={`node-${i}`}
            cx={x}
            cy={y}
            r={4 * pulse}
            fill="url(#grad3-1)"
            opacity={0.6 + Math.sin(time + i) * 0.3}
          />
        );
      })}

      {/* Gradient glows */}
      <circle cx={400 + parallaxPos.x * 0.3} cy={300 + parallaxPos.y * 0.3} r={150 + Math.sin(time * 2) * 20} fill="url(#grad3-1)" className="blur-3xl opacity-28" />
      <circle cx={650 + parallaxPos.x * 0.4} cy={180 + parallaxPos.y * 0.4} r={100 + Math.cos(time * 2.5) * 15} fill="url(#grad3-2)" className="blur-3xl opacity-22" />
      <circle cx={200 + parallaxPos.x * 0.5} cy={350 + parallaxPos.y * 0.5} r={80 + Math.sin(time * 3) * 10} fill="url(#grad3-1)" className="blur-3xl opacity-18" />
    </svg>
  );

  // Variant 4: circuit-board styling with data flow effects
  const renderVariant4 = () => (
    <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="grad4-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="grad4-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="grad4-3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Circuit grid */}
      <g stroke="url(#grad4-1)" strokeWidth="1" opacity="0.2">
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1="100"
            y1={100 + i * 60}
            x2="700"
            y2={100 + i * 60}
            strokeDasharray="4 4"
            className="dash-animate"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={100 + i * 60}
            y1="100"
            x2={100 + i * 60}
            y2="500"
            strokeDasharray="4 4"
            className="dash-animate"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </g>

      {/* Circuit nodes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = 200 + col * 200 + parallaxPos.x * (0.4 + i * 0.1);
        const y = 200 + row * 150 + parallaxPos.y * (0.4 + i * 0.1);
        const pulse = 1 + Math.sin(time * 2.5 + i) * 0.2;
        
        return (
          <g key={i}>
            <rect
              x={x - 25 * pulse}
              y={y - 25 * pulse}
              width={50 * pulse}
              height={50 * pulse}
              fill="none"
              stroke="url(#grad4-1)"
              strokeWidth="2"
              strokeDasharray="6 3"
              className="dash-animate"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
            <circle
              cx={x}
              cy={y}
              r={8 * pulse}
              fill="url(#grad4-1)"
              opacity={0.5}
            />
            {/* Connection lines */}
            {col < 2 && (
              <line
                x1={x + 25 * pulse}
                y1={y}
                x2={x + 200 - 25 * pulse}
                y2={y}
                stroke="url(#grad4-2)"
                strokeWidth="2"
                strokeDasharray="8 4"
                className="dash-animate"
                opacity="0.6"
              />
            )}
            {row < 1 && (
              <line
                x1={x}
                y1={y + 25 * pulse}
                x2={x}
                y2={y + 150 - 25 * pulse}
                stroke="url(#grad4-2)"
                strokeWidth="2"
                strokeDasharray="8 4"
                className="dash-animate"
                opacity="0.6"
              />
            )}
          </g>
        );
      })}

      {/* Data flow arrows */}
      {[0, 1, 2, 3].map((i) => {
        const progress = (time * 20 + i * 25) % 400;
        const x = 150 + progress + parallaxPos.x * 0.3;
        const y = 350 + i * 40 + parallaxPos.y * 0.3;
        
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <path
              d="M 0 0 L 15 -8 L 15 -3 L 30 -3 L 30 3 L 15 3 L 15 8 Z"
              fill="url(#grad4-1)"
              opacity={0.7}
            />
            <line
              x1="0"
              y1="0"
              x2="30"
              y2="0"
              stroke="url(#grad4-1)"
              strokeWidth="2"
              strokeDasharray="4 2"
              className="dash-animate"
            />
          </g>
        );
      })}

      {/* Rotating gear */}
      <g transform={`translate(${600 + parallaxPos.x * 0.6}, ${300 + parallaxPos.y * 0.6}) rotate(${time * 25})`}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * 45) * (Math.PI / 180);
          const x1 = Math.cos(angle) * 50;
          const y1 = Math.sin(angle) * 50;
          const x2 = Math.cos(angle) * 60;
          const y2 = Math.sin(angle) * 60;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#grad4-1)"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              className="dash-animate"
            />
          );
        })}
        <circle
          cx="0"
          cy="0"
          r="40"
          fill="none"
          stroke="url(#grad4-2)"
          strokeWidth="2.5"
          strokeDasharray="8 4"
          className="dash-animate"
        />
        <circle
          cx="0"
          cy="0"
          r="20"
          fill="url(#grad4-1)"
          opacity="0.3"
        />
      </g>

      {/* Extra data particles */}
      {Array.from({ length: 20 }, (_, i) => {
        const progress = (time * 30 + i * 20) % 600;
        const x = 100 + progress + parallaxPos.x * 0.3;
        const y = 100 + (i % 8) * 60 + parallaxPos.y * 0.3;
        const size = 2 + Math.sin(time + i) * 1;
        return (
          <circle
            key={`particle-${i}`}
            cx={x}
            cy={y}
            r={size}
            fill="url(#grad4-1)"
            opacity={0.5 + Math.sin(time * 2 + i) * 0.3}
          />
        );
      })}

      {/* Extra rotating diamonds */}
      {[0, 1, 2].map((i) => {
        const angle = time * (20 + i * 5) + i * 120;
        const radius = 100;
        const x = 400 + Math.cos(angle * (Math.PI / 180)) * radius + parallaxPos.x * 0.4;
        const y = 300 + Math.sin(angle * (Math.PI / 180)) * radius + parallaxPos.y * 0.4;
        return (
          <g key={`diamond-${i}`} transform={`translate(${x}, ${y}) rotate(${time * 25 + i * 60})`}>
            <path
              d="M 0 -25 L 25 0 L 0 25 L -25 0 Z"
              fill="none"
              stroke="url(#grad4-2)"
              strokeWidth="2"
              strokeDasharray="5 3"
              className="dash-animate"
              opacity="0.6"
            />
          </g>
        );
      })}

      {/* Gradient glows */}
      <circle cx={400 + parallaxPos.x * 0.3} cy={300 + parallaxPos.y * 0.3} r={180 + Math.sin(time * 2) * 25} fill="url(#grad4-1)" className="blur-3xl opacity-30" />
      <circle cx={600 + parallaxPos.x * 0.4} cy={200 + parallaxPos.y * 0.4} r={120 + Math.cos(time * 2.5) * 18} fill="url(#grad4-2)" className="blur-3xl opacity-25" />
      <circle cx={200 + parallaxPos.x * 0.5} cy={450 + parallaxPos.y * 0.5} r={100 + Math.sin(time * 3) * 15} fill="url(#grad4-3)" className="blur-3xl opacity-20" />
    </svg>
  );

  // Select the renderer for the requested variant.
  const renderContent = () => {
    switch (variant) {
      case 1:
        return renderVariant1();
      case 2:
        return renderVariant2();
      case 3:
        return renderVariant3();
      case 4:
        return renderVariant4();
      default:
        return renderVariant1();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onMouseMove={handleMouseMove}
    >
      {renderContent()}
    </div>
  );
}