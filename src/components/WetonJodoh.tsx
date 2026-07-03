import React, { useState, useEffect } from 'react';
import { getWeton, getJodoh } from '../lib/jawaMath';
import { cn } from '../lib/utils';
import { Heart, CalendarDays, Info, Sparkles, ChevronRight, Zap, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function WetonJodoh() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [result, setResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  const calculateMatch = () => {
    if (!date1 || !date2) return;
    
    setCalculating(true);
    // Simulate spiritual calculation
    setTimeout(() => {
      const w1 = getWeton(new Date(date1));
      const w2 = getWeton(new Date(date2));
      const jodoh = getJodoh(w1.neptu, w2.neptu);
      setResult({ w1, w2, jodoh });
      setCalculating(false);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 1500);
  };

  const getScoreColor = (category: string) => {
    const good = ['Jodoh', 'Ratu', 'Tinari', 'Pesthi', 'Wasesa Segara', 'Tunggak Semi', 'Satria Wibawa', 'Sumur Sinaba', 'Sri', 'Lungguh', 'Gedhong'];
    const bad = ['Pegat', 'Sujanan', 'Satria Wirang', 'Pati', 'Loro'];
    const warning = ['Topo', 'Padu', 'Lebu Katiup Angin', 'Bumi Kapetak'];

    if (good.some(g => category.includes(g))) return 'text-green-600 dark:text-green-500';
    if (bad.some(b => category.includes(b))) return 'text-red-600 dark:text-red-500';
    if (warning.some(w => category.includes(w))) return 'text-amber-600 dark:text-amber-500';
    return 'text-stone-600 dark:text-stone-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
      <div className="mb-10 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-2">
          <Heart size={32} className="text-red-500 fill-red-500/20 animate-pulse" />
        </div>
        <h2 className="text-3xl font-serif font-black text-stone-900 dark:text-stone-100 tracking-tight">
          Cek Jodoh <span className="text-gold-500">Primbon</span>
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
          Menganalisis keselarasan energi antara dua insan berdasarkan hitungan Neptu, Pancasuda, dan Sisa 8.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Person 1 */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={60} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Pihak Pertama</h3>
          <div className="space-y-4">
            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500" size={20} />
              <input 
                type="date" 
                value={date1} 
                onChange={(e) => setDate1(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 pl-12 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
              />
            </div>
            {date1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-gold-600 dark:text-gold-500 px-2">
                {getWeton(new Date(date1)).dina} {getWeton(new Date(date1)).pasaran} (Neptu {getWeton(new Date(date1)).neptu})
              </motion.div>
            )}
          </div>
        </div>

        {/* Person 2 */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={60} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Pihak Kedua</h3>
          <div className="space-y-4">
            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500" size={20} />
              <input 
                type="date" 
                value={date2} 
                onChange={(e) => setDate2(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 pl-12 text-stone-900 dark:text-stone-100 outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
              />
            </div>
            {date2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-gold-600 dark:text-gold-500 px-2">
                {getWeton(new Date(date2)).dina} {getWeton(new Date(date2)).pasaran} (Neptu {getWeton(new Date(date2)).neptu})
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={calculateMatch}
        disabled={!date1 || !date2 || calculating}
        className={cn(
          "w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl flex items-center justify-center gap-3",
          !date1 || !date2 
            ? "bg-stone-200 text-stone-400 cursor-not-allowed" 
            : "bg-stone-900 dark:bg-gold-600 text-white hover:scale-[1.02] active:scale-95 shadow-gold-500/20"
        )}
      >
        {calculating ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Menghitung Energi...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Analisis Kecocokan
          </>
        )}
      </button>

      <AnimatePresence>
        {result && !calculating && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-8"
          >
            {/* Header Result */}
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Hasil Penyatuan Neptu</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-black text-stone-900 dark:text-stone-100">{result.w1.neptu}</span>
                <span className="text-2xl text-gold-500">+</span>
                <span className="text-4xl font-black text-stone-900 dark:text-stone-100">{result.w2.neptu}</span>
                <span className="text-2xl text-gold-500">=</span>
                <span className="text-4xl font-black text-gold-600 dark:text-gold-500">{result.jodoh.total}</span>
              </div>
            </div>

            {/* Main Category Card (Sisa 8) */}
            <div className="bg-white dark:bg-stone-900 border-2 border-gold-500/30 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-stone-400">Prediksi Utama (Sisa 8)</h4>
                <h3 className={cn("text-4xl font-black italic tracking-tighter", getScoreColor(result.jodoh.sisa8.category))}>
                  {result.jodoh.sisa8.category.split('(')[0]}
                </h3>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed italic max-w-md mx-auto">
                  "{result.jodoh.sisa8.category.split('(')[1]?.replace(')','')}"
                </p>
              </div>
            </div>

            {/* Detailed Analysis Grids */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-stone-100 dark:bg-stone-900/50 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-stone-400">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Karakter Hubungan</span>
                </div>
                <h5 className={cn("text-xl font-bold", getScoreColor(result.jodoh.sisa7.category))}>
                  {result.jodoh.sisa7.category.split('(')[0]}
                </h5>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {result.jodoh.sisa7.category.split('(')[1]?.replace(')','')}
                </p>
              </div>

              <div className="bg-stone-100 dark:bg-stone-900/50 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-2 text-stone-400">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Pancasuda Jodoh</span>
                </div>
                <h5 className={cn("text-xl font-bold", getScoreColor(result.jodoh.sisa5.category))}>
                  {result.jodoh.sisa5.category.split('(')[0]}
                </h5>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {result.jodoh.sisa5.category.split('(')[1]?.replace(')','')}
                </p>
              </div>
            </div>

            {/* Warning / Advice Section */}
            {(result.jodoh.sisa8.code === 1 || result.jodoh.sisa8.code === 7 || result.jodoh.sisa5.code === 0 || result.jodoh.sisa5.code === 4) && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-6 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-red-600 dark:text-red-400">Saran Perbaikan Energi</h5>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Berdasarkan hitungan, hubungan ini memiliki potensi hambatan. Disarankan untuk sering melakukan sedekah bersama atau melakukan "Ruwatan" sederhana sebagai bentuk ikhtiar batin menolak bala.
                  </p>
                </div>
              </div>
            )}

            {/* Footer Advice */}
            <div className="p-8 bg-stone-900 rounded-[2.5rem] text-center space-y-4">
              <p className="text-[10px] font-bold text-gold-500 uppercase tracking-[0.4em]">Wejangan Sesepuh</p>
              <p className="text-sm text-stone-300 italic leading-relaxed">
                "Jodoh adalah rahasia Ilahi. Perhitungan ini hanyalah sarana untuk mawas diri. Kunci kebahagiaan tetaplah komunikasi, kesabaran, dan ridho Tuhan Yang Maha Esa."
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      {!result && (
        <div className="mt-12 bg-white/50 dark:bg-stone-900/30 border border-stone-200 dark:border-stone-800 p-8 rounded-[2.5rem] space-y-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <Info size={18} className="text-gold-500" /> Mengenal Hitungan Jodoh
          </h4>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300">Metode Sisa 8</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                Metode paling umum yang membagi total neptu dengan angka 8. Hasil sisa menentukan nasib dasar rumah tangga.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300">Pancasuda Jodoh</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                Perhitungan mendalam untuk melihat potensi rezeki dan kesehatan keluarga setelah bersatu.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
