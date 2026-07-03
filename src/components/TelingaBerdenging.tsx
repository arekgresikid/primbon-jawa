import React, { useState } from 'react';
import { motion } from 'motion/react';
import { getFirasatTelinga } from '../lib/jawaMath';
import { Volume2, Info, Ear } from 'lucide-react';
import { cn } from '../lib/utils';

export function TelingaBerdenging({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
  const [bagian, setBagian] = useState<'kiri' | 'kanan'>('kiri');
  const [jam, setJam] = useState<number | ''>('');

  const hasil = typeof jam === 'number' ? getFirasatTelinga(bagian, jam) : null;

  return (
    <div className="w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
      <div className="mb-10 text-center space-y-3">
        <h2 className="text-3xl font-serif font-black text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
          <Ear size={28} className="text-gold-500" />
          Firasat Telinga Berdenging
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
          "Menurut kitab Primbon, telinga berdenging tanpa sebab yang jelas merupakan sebuah firasat tentang suatu kejadian."
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
               Telinga Bagian Mana?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBagian('kiri')}
                className={cn(
                  "flex flex-col items-center justify-center py-4 rounded-xl transition-all border gap-2",
                  bagian === 'kiri'
                    ? "bg-gold-50 border-gold-400 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400 shadow-sm"
                    : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-500 hover:border-gold-300"
                )}
              >
                <span className="font-semibold text-sm">Telinga Kiri</span>
              </button>
              <button
                onClick={() => setBagian('kanan')}
                className={cn(
                  "flex flex-col items-center justify-center py-4 rounded-xl transition-all border gap-2",
                  bagian === 'kanan'
                    ? "bg-indigo-50 border-indigo-400 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm"
                    : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-500 hover:border-indigo-300"
                )}
              >
                <span className="font-semibold text-sm">Telinga Kanan</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
               Jam Berapa Kejadiannya? (0-23)
            </label>
            <input
              type="number"
              min="0"
              max="23"
              value={jam === '' ? '' : jam}
              onChange={(e) => {
                const val = e.target.value;
                setJam(val === '' ? '' : parseInt(val, 10));
              }}
              placeholder="Misal: 14"
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-4 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {hasil && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-stone-900 dark:bg-stone-100 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Volume2 size={100} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-gold-500 dark:text-gold-600 font-bold uppercase tracking-widest text-xs">
                <Info size={16} /> Firasat Telinga
              </div>
              <p className="text-xl font-serif text-stone-100 dark:text-stone-900 leading-relaxed">
                {hasil}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
