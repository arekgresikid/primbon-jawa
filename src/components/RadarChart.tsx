import React from 'react';
import { motion } from 'motion/react';

interface RadarData {
  label: string;
  value: number; // 0-100
}

interface RadarChartProps {
  data: RadarData[];
  size?: number;
}

export function RadarChart({ data, size = 300 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / data.length;

  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * (d.value / 100) * Math.cos(angle);
    const y = center + radius * (d.value / 100) * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Grids */}
        {gridLevels.map(level => {
          const gridPoints = data.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * level * Math.cos(angle);
            const y = center + radius * level * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon 
              key={level} 
              points={gridPoints} 
              fill="none" 
              stroke="currentColor" 
              className="text-stone-200 dark:text-stone-800" 
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line 
              key={i} 
              x1={center} y1={center} x2={x} y2={y} 
              stroke="currentColor" 
              className="text-stone-200 dark:text-stone-800" 
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          points={points}
          fill="currentColor"
          className="text-gold-500/30 dark:text-gold-500/20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Labels */}
        {data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + (radius + 25) * Math.cos(angle);
          const y = center + (radius + 15) * Math.sin(angle);
          return (
            <text 
              key={i} 
              x={x} y={y} 
              textAnchor="middle" 
              className="text-[10px] font-bold fill-stone-500 dark:fill-stone-400 uppercase tracking-tighter"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
