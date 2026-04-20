import React from 'react';
import { motion } from 'motion/react';
import { getPalSrigati } from '../lib/jawaMath';
import { cn } from '../lib/utils';
import { TrendingUp, Info } from 'lucide-react';

interface PalSrigatiProps {
  neptu: number;
}

export function PalSrigati({ neptu }: PalSrigatiProps) {
  const data = getPalSrigati(neptu);
  
  // Chart dimensions
  const width = 600;
  const height = 150;
  const padding = 20;
  
  const xScale = (width - padding * 2) / (data.length - 1);
  const yScale = (height - padding * 2) / 8; // Scale 1-9

  const points = data.map((d, i) => {
    const x = padding + i * xScale;
    const y = height - padding - (d.value - 1) * yScale;
    return { x, y };
  });

  const pathD = `M ${points[0].x} ${points[0].y} ` + 
    points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-gold-500" /> Siklus Rejeki Pal Srigati
            </h4>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase font-medium">Fluktuasi Rejeki per 6 Tahun (Neptu {neptu})</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center border border-gold-100 dark:border-gold-500/20 text-gold-600 dark:text-gold-500 font-bold">
            {neptu}
          </div>
        </div>
        
        <div className="p-6 relative">
          {/* Chart SVG */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto min-w-[600px]">
              {/* Grid Lines */}
              {[...Array(9)].map((_, i) => (
                <line 
                  key={i}
                  x1={padding} y1={height - padding - i * yScale}
                  x2={width - padding} y2={height - padding - i * yScale}
                  stroke="currentColor"
                  className="text-stone-100 dark:text-stone-800/50"
                  strokeWidth="1"
                />
              ))}
              
              {/* Area */}
              <motion.path 
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={areaD} 
                fill="url(#goldGradient)" 
                className="opacity-20"
              />
              
              {/* Path */}
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d={pathD} 
                fill="none" 
                stroke="currentColor" 
                className="text-gold-500" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Points */}
              {points.map((p, i) => (
                <g key={i}>
                  <motion.circle 
                    initial={{ r: 0 }}
                    animate={{ r: 4 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    cx={p.x} cy={p.y} 
                    fill="white"
                    stroke="currentColor"
                    className="text-gold-500"
                    strokeWidth="2"
                  />
                  <text 
                    x={p.x} y={height - 5} 
                    textAnchor="middle" 
                    className="text-[8px] font-bold fill-stone-400 dark:fill-stone-500 uppercase tracking-tighter"
                  >
                    {data[i].age}th
                  </text>
                  <text 
                    x={p.x} y={p.y - 8} 
                    textAnchor="middle" 
                    className="text-[10px] font-black fill-stone-900 dark:fill-stone-100"
                  >
                    {data[i].value}
                  </text>
                </g>
              ))}

              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Masa Keemasan</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-500">
                Usia {data.reduce((prev, curr) => curr.value > prev.value ? curr : prev).age} Tahun
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Titik Prihatin</p>
              <p className="text-sm font-bold text-red-500 dark:text-red-400">
                Usia {data.reduce((prev, curr) => curr.value < prev.value ? curr : prev).age} Tahun
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Status Saat Ini</p>
              <p className="text-sm font-bold text-gold-600 dark:text-gold-500">Fluctuating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gold-50/50 dark:bg-gold-500/5 border border-gold-100 dark:border-gold-500/20 p-4 rounded-xl flex gap-3">
        <Info className="text-gold-600 shrink-0" size={18} />
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed italic">
          "Angka rejeki dalam Pal Srigati melambangkan skala (1-9) kemudahan jalannya rejeki. Semakin tinggi angka, semakin terbuka lebar pintu keberuntungan di masa tersebut."
        </p>
      </div>
    </div>
  );
}
