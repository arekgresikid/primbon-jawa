import React, { useState } from 'react';
import { motion } from 'motion/react';
import { getFirasatLindu, BULAN_JAWA } from '../lib/jawaMath';
import { Sparkles, Moon, Sun, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export function PrimbonLindu({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
  const [selectedBulan, setSelectedBulan] = useState<string>('');
  const [selectedWaktu, setSelectedWaktu] = useState<'siang' | 'malam' | ''>('');

  const hasil = selectedBulan && selectedWaktu ? getFirasatLindu(selectedBulan, selectedWaktu) : null;

  return (
    <div className="w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
      <div className="mb-10 text-center space-y-3">
        <h2 className="text-3xl font-serif font-black text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
          <Sparkles size={28} className="text-gold-500" />
          Firasat Gempa Bumi (Lindu)
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
          "Dalam ajaran Primbon, kejadian alam seperti Lindu membawa pertanda bagi umat manusia berdasarkan waktu terjadinya."
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
               Bulan Jawa Terjadinya Gempa
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BULAN_JAWA.map(bulan => (
                <button
                  key={bulan}
                  onClick={() => setSelectedBulan(bulan)}
                  className={cn(
                    "py-2 px-2 rounded-xl text-xs font-bold transition-all border",
                    selectedBulan === bulan
                      ? "bg-gold-500 border-gold-400 text-white shadow-md"
                      : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-gold-300"
                  )}
                >
                  {bulan}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
               Waktu Kejadian
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedWaktu('siang')}
                className={cn(
                  "flex flex-col items-center justify-center py-4 rounded-xl transition-all border gap-2",
                  selectedWaktu === 'siang'
                    ? "bg-gold-50 border-gold-400 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400 shadow-sm"
                    : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-500 hover:border-gold-300"
                )}
              >
                <Sun size={24} className={selectedWaktu === 'siang' ? "text-gold-500" : "text-stone-400"} />
                <span className="font-semibold text-sm">Siang Hari</span>
              </button>
              <button
                onClick={() => setSelectedWaktu('malam')}
                className={cn(
                  "flex flex-col items-center justify-center py-4 rounded-xl transition-all border gap-2",
                  selectedWaktu === 'malam'
                    ? "bg-indigo-50 border-indigo-400 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm"
                    : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-500 hover:border-indigo-300"
                )}
              >
                <Moon size={24} className={selectedWaktu === 'malam' ? "text-indigo-500" : "text-stone-400"} />
                <span className="font-semibold text-sm">Malam Hari</span>
              </button>
            </div>
          </div>
        </div>

        {hasil && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-stone-900 dark:bg-stone-100 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-gold-500 dark:text-gold-600 font-bold uppercase tracking-widest text-xs">
                <Info size={16} /> Tafsir Gempa Bumi
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
