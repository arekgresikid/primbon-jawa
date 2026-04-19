import React, { useState, useEffect } from 'react';
import { Compass, Info, MapPin, Sparkles, TrendingUp, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { getWeton, getLuckyColorByPasaran } from '../lib/jawaMath';

export function FortuneCompass() {
  const [rotation, setRotation] = useState(0);
  const [directionInfo, setDirectionInfo] = useState({ name: 'Utara', rejeki: 'Wetan', desc: 'Arah keberuntungan hari ini.' });
  const [luckyColor, setLuckyColor] = useState('');
  const [javaneseDate, setJavaneseDate] = useState<any>(null);

  useEffect(() => {
    try {
      const today = new Date();
      const jd = getWeton(today);
      if (jd) {
        setJavaneseDate(jd);
        setLuckyColor(getLuckyColorByPasaran(jd.pasaran));
        
        // Nagadina logic (Arah Rejeki)
        const neptu = jd.neptu;
        let targetRotation = 0;
        let rejeki = 'Utara (Lor)';
        let meaning = 'Kebijaksanaan membawa keberuntungan spiritual.';

        if ([7, 12, 17].includes(neptu)) {
          targetRotation = 90;
          rejeki = 'Timur (Wetan)';
          meaning = 'Energi matahari terbit membawa kelimpahan materi.';
        } else if ([8, 13, 18].includes(neptu)) {
          targetRotation = 180;
          rejeki = 'Selatan (Kidul)';
          meaning = 'Ketenangan jiwa membawa keberuntungan dalam relasi.';
        } else if ([9, 14].includes(neptu)) {
          targetRotation = 270;
          rejeki = 'Barat (Kulon)';
          meaning = 'Kemantapan langkah membawa hasil yang pasti.';
        }

        setRotation(targetRotation);
        setDirectionInfo({ name: rejeki, rejeki, desc: meaning });
      }
    } catch (e) {
      console.error('Compass calculation error:', e);
    }
  }, []);

  if (!javaneseDate) return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-20 bg-stone-50 dark:bg-stone-950 rounded-3xl gap-4">
      <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      <span className="text-stone-400 text-xs font-medium animate-pulse tracking-widest">Menghitung Arah Barokah...</span>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center bg-stone-50 dark:bg-stone-950 p-6 rounded-3xl gap-8 shadow-inner overflow-hidden">
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-stone-900 dark:text-stone-100">
          <Compass className="text-gold-500" />
          Kompas Keberuntungan
        </h2>
        <p className="text-sm text-stone-500 mt-1 italic">Arah Rejeki & Langkah Hari Ini</p>
      </div>

      {/* The Visual Compass */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        {/* Background Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-stone-200 dark:border-stone-800 shadow-xl flex items-center justify-center bg-white dark:bg-stone-900">
          {/* Compass Marks */}
          <div className="absolute top-4 font-bold text-stone-400">U</div>
          <div className="absolute bottom-4 font-bold text-stone-400">S</div>
          <div className="absolute left-4 font-bold text-stone-400">B</div>
          <div className="absolute right-4 font-bold text-stone-400">T</div>
          
          <div className="w-full h-full p-8 opacity-10">
            <Compass size="100%" />
          </div>
        </div>

        {/* The Needle */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <div className="relative flex flex-col items-center">
            {/* North Point (Gold) */}
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[60px] border-b-gold-500 -mb-px shadow-lg" />
            {/* South Point (Stone) */}
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[60px] border-t-stone-300 dark:border-t-stone-700 shadow-sm" />
            {/* Center Pivot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-stone-800 dark:bg-stone-200 rounded-full border-2 border-gold-500 z-10" />
          </div>
        </motion.div>

        {/* Sparkle effects on target */}
        <motion.div 
           className="absolute w-12 h-12 flex items-center justify-center top-0"
           animate={{ 
             top: rotation === 0 ? 0 : rotation === 90 ? '45%' : rotation === 180 ? '90%' : '45%',
             left: rotation === 0 ? '45%' : rotation === 90 ? '90%' : rotation === 180 ? '45%' : '0%',
             opacity: [0.4, 1, 0.4] 
           }}
           transition={{ duration: 2, repeat: Infinity }}
        >
           <Sparkles className="text-gold-400" size={32} />
        </motion.div>
      </div>

      {/* Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gold-100 dark:bg-gold-900/30 rounded-xl">
            <MapPin className="text-gold-600 dark:text-gold-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest mb-1">Arah Paling Rahayu</div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-1">{directionInfo.name}</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{directionInfo.desc}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 gap-6">
          <div className="flex items-center gap-4 bg-stone-50 dark:bg-stone-950/50 p-4 rounded-xl border border-stone-100 dark:border-stone-800">
            <div className="p-2 bg-white dark:bg-stone-800 rounded-lg shadow-sm">
              <Palette className="text-gold-600 dark:text-gold-400" size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Warna Keberuntungan</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={cn(
                  "w-3 h-3 rounded-full border border-stone-200 dark:border-stone-700 shadow-sm",
                  luckyColor.includes('Putih') && "bg-white",
                  luckyColor.includes('Merah') && "bg-red-500",
                  luckyColor.includes('Kuning') && "bg-yellow-400",
                  luckyColor.includes('Hitam') && "bg-stone-900",
                  luckyColor.includes('Abu-abu') && "bg-stone-500",
                )} />
                <div className="text-sm font-bold text-stone-700 dark:text-stone-300">{luckyColor}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-tighter">Weton Hari Ini</span>
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{javaneseDate ? `${javaneseDate.dina} ${javaneseDate.pasaran}` : '---'}</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-tighter text-right">Neptu</span>
              <span className="text-sm font-medium text-gold-600 dark:text-gold-400">{javaneseDate ? javaneseDate.neptu : '--'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-100 dark:bg-stone-900/50 px-4 py-2 rounded-full">
        <Info size={14} />
        <span>Gunakan kompas ini saat berangkat atau memulai aktivitas.</span>
      </div>
    </div>
  );
}
