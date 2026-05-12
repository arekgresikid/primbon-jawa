import React, { useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const ARAH_DATA: Record<string, string> = {
  'Senin': 'Selatan',
  'Selasa': 'Utara',
  'Rabu': 'Utara',
  'Kamis': 'Timur',
  'Jumat': 'Barat',
  'Sabtu': 'Selatan',
  'Minggu': 'Timur',
};

export function ArahRejeki() {
  const [hari, setHari] = useState('Senin');
  const arah = ARAH_DATA[hari];

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Compass size={32} className="text-gold-600 dark:text-gold-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-2">
          Arah Keberuntungan
        </h2>
        <p className="text-stone-500 text-sm">Cari tahu arah terbaik untuk memulai langkah hari ini.</p>
      </div>

      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Pilih Hari:</label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {Object.keys(ARAH_DATA).map((h) => (
              <button
                key={h}
                onClick={() => setHari(h)}
                className={`py-3 px-1 rounded-xl text-[10px] font-bold transition-all border ${
                  hari === h 
                    ? "bg-gold-500 text-white border-gold-500 shadow-lg shadow-gold-500/20" 
                    : "bg-stone-50 dark:bg-stone-950 text-stone-500 border-stone-200 dark:border-stone-800 hover:border-gold-300"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          key={hari}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-8 bg-stone-50 dark:bg-stone-950/50 rounded-[2rem] border border-stone-100 dark:border-stone-800 relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gold-500/10 blur-[60px] pointer-events-none" />
          
          <span className="relative z-10 text-[10px] font-black text-gold-600 dark:text-gold-500 uppercase tracking-[0.3em] mb-6">Arah Rejeki Hari {hari}</span>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-gold-500/20 rounded-full" 
            />
            <div className="relative z-10 text-4xl font-black text-stone-800 dark:text-gold-500 tracking-tighter flex flex-col items-center gap-2">
              <Sparkles size={24} className="text-gold-400 animate-pulse" />
              {arah}
            </div>
          </div>
          
          <p className="relative z-10 mt-8 text-center text-xs text-stone-500 dark:text-stone-400 leading-relaxed italic max-w-xs mx-auto">
            "Melangkah menuju <span className="text-gold-600 dark:text-gold-400 font-bold">{arah}</span> di hari <span className="text-stone-800 dark:text-stone-200 font-bold">{hari}</span> dipercaya membawa keberkahan dan kelancaran rejeki menurut ajaran leluhur."
          </p>
        </motion.div>
      </div>

      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
          <strong>Catatan Sesepuh:</strong> Arah rejeki ini adalah salah satu bentuk ikhtiar batin. Hasil akhir tetap ada di tangan Sang Pencipta, namun melangkah dengan keyakinan akan membuka pintu-pintu yang tertutup.
        </p>
      </div>
    </div>
  );
}
