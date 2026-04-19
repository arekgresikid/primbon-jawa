import React from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';

interface FortuneCompassProps {
  luckyDirections: string; // e.g. "Utara atau Timur"
}

export function FortuneCompass({ luckyDirections }: FortuneCompassProps) {
  const directions = [
    { label: 'U', name: 'Utara', angle: 0 },
    { label: 'TL', name: 'Timur Laut', angle: 45 },
    { label: 'T', name: 'Timur', angle: 90 },
    { label: 'TG', name: 'Tenggara', angle: 135 },
    { label: 'S', name: 'Selatan', angle: 180 },
    { label: 'BD', name: 'Barat Daya', angle: 225 },
    { label: 'B', name: 'Barat', angle: 270 },
    { label: 'BL', name: 'Barat Laut', angle: 315 },
  ];

  const isLucky = (name: string) => luckyDirections.toLowerCase().includes(name.toLowerCase());

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-gold-500/5 dark:bg-gold-500/10 animate-pulse" />
      
      {/* Ring */}
      <div className="absolute inset-2 rounded-full border-2 border-stone-200 dark:border-stone-800" />
      
      {/* Central Icon */}
      <div className="z-10 bg-white dark:bg-stone-900 p-2 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm text-gold-600 dark:text-gold-500">
        <Compass size={24} />
      </div>

      {/* Directions */}
      {directions.map((dir) => {
        const active = isLucky(dir.name);
        return (
          <div 
            key={dir.label}
            className="absolute inset-0 flex items-start justify-center"
            style={{ transform: `rotate(${dir.angle}deg)` }}
          >
            <div className="flex flex-col items-center pt-2">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: active ? 1.2 : 1,
                  opacity: active ? 1 : 0.4 
                }}
                className={`text-[10px] font-bold ${active ? 'text-gold-600 dark:text-gold-500' : 'text-stone-400'}`}
                style={{ transform: `rotate(-${dir.angle}deg)` }}
              >
                {dir.label}
              </motion.div>
              {active && (
                <motion.div 
                  layoutId="indicator"
                  className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-1 shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Rotating Ring Decor */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-dashed border-gold-200/50 dark:border-gold-800/30"
      />
    </div>
  );
}
