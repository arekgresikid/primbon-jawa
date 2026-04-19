import React, { useState } from 'react';
import { getWeton, getWatak, getJodoh, getRamalanNasib, getArahRezeki, getWarnaKeberuntungan, getStrategiBisnis } from '../lib/jawaMath';
import { cn } from '../lib/utils';
import { Heart, Search, User, Flame, Sparkles, Compass, Palette, Briefcase, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function WetonCalc() {
  const [tab, setTab] = useState<'pribadi' | 'bisnis' | 'jodoh'>('pribadi');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');

  const renderPribadi = () => {
    let result = null;
    if (date1) {
      const d = new Date(date1);
      if (!isNaN(d.getTime())) {
        const weton = getWeton(d);
        const watak = getWatak(weton.neptu);
        const nasib = getRamalanNasib(weton.neptu);
        const arah = getArahRezeki(weton.neptu);
        const warna = getWarnaKeberuntungan(weton.neptu);
        result = { weton, watak, nasib, arah, warna };
      }
    }

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl shadow-sm">
          <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Tanggal Lahir Anda</label>
          <input 
            type="date"
            value={date1}
            onChange={e => setDate1(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 text-stone-900 dark:text-stone-200 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
          />
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white/80 dark:bg-stone-900/40 border border-gold-200 dark:border-gold-600/30 overflow-hidden rounded-2xl backdrop-blur-sm shadow-md"
            >
              <div className="p-6 text-center border-b border-gold-200 dark:border-gold-600/20 bg-gradient-to-b from-gold-50 dark:from-gold-500/10 to-transparent">
                <p className="text-stone-500 dark:text-stone-400 text-sm mb-1 uppercase tracking-widest font-medium">Weton Lahir</p>
                <h3 className="text-3xl font-bold text-gold-600 dark:text-gold-500 mb-2">
                  {result.weton.dina} {result.weton.pasaran}
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-stone-950 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm">
                  <span className="text-stone-600 dark:text-stone-300 text-sm">Wuku:</span>
                  <span className="text-gold-600 dark:text-gold-500 font-medium">{result.weton.wuku}</span>
                </div>
              </div>
              <div className="p-6 grid gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center border border-stone-200 dark:border-stone-800 text-gold-600 dark:text-gold-500 shrink-0 shadow-sm">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="text-stone-800 dark:text-stone-300 font-semibold mb-1">Total Neptu: {result.weton.neptu}</h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-mono">({result.weton.dinaNeptu} untuk {result.weton.dina} + {result.weton.pasaranNeptu} untuk {result.weton.pasaran})</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center border border-stone-200 dark:border-gold-600/30 text-gold-500 dark:text-gold-400 shrink-0 shadow-sm">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h4 className="text-stone-800 dark:text-stone-300 font-semibold mb-1">Watak Dominan</h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{result.watak}</p>
                  </div>
                </div>

                <div className="border-t border-stone-200 dark:border-stone-800/50 pt-6">
                  <h4 className="text-gold-600 dark:text-gold-500 font-semibold mb-5 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <Sparkles size={16} /> Primbon Ramalan
                  </h4>
                  <div className="grid gap-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-300 shrink-0 shadow-sm">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h4 className="text-stone-800 dark:text-stone-300 font-semibold mb-1">Jalur Nasib (Pancasuda)</h4>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{result.nasib}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-300 shrink-0 shadow-sm">
                        <Compass size={18} />
                      </div>
                      <div>
                        <h4 className="text-stone-800 dark:text-stone-300 font-semibold mb-1">Arah Rezeki & Kejayaan</h4>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{result.arah}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-300 shrink-0 shadow-sm">
                        <Palette size={18} />
                      </div>
                      <div>
                        <h4 className="text-stone-800 dark:text-stone-300 font-semibold mb-1">Warna Keberuntungan</h4>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{result.warna}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glosarium / Explanation */}
        <div className="bg-white/80 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl md:mt-8">
           <h4 className="text-gold-600 dark:text-gold-500 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
             <Info size={18} /> Panduan Ringkas Primbon
           </h4>
           <div className="grid sm:grid-cols-2 gap-4 text-sm text-stone-600 dark:text-stone-400">
             <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-lg border border-stone-100 dark:border-stone-800">
                <p className="font-semibold text-stone-800 dark:text-stone-200 mb-1">Dina & Pasaran</p>
                <p>Paduan siklus 7 hari masehi (Kamis, Jumat, dll) dan 5 hari pasaran Jawa (Legi, Pahing, Pon, Wage, Kliwon). Pertemuannya membentuk Weton unik setiap 35 hari sekali (sebuah 'Selapan').</p>
             </div>
             <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-lg border border-stone-100 dark:border-stone-800">
                <p className="font-semibold text-stone-800 dark:text-stone-200 mb-1">Neptu</p>
                <p>Formula sakral berupa angka dari penjumlahan nilai (angka mati) hari masehi ditambah nilai pasaran. Neptu adalah pondasi utama penarikan semua garis ramalan di dalam kitab Primbon.</p>
             </div>
             <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-lg border border-stone-100 dark:border-stone-800 sm:col-span-2">
                <p className="font-semibold text-stone-800 dark:text-stone-200 mb-1">Wuku</p>
                <p>Adalah perhitungan siklus 30 pekan (1 Wuku = 7 hari) yang dinamakan dari riwayat seorang tokoh prasejarah Jawa, Raden Watugunung. Wuku mewakili corak takdir seseorang atau alam dalam 210 hari masa putarannya, yang memengaruhi segala tata kelola hari baik pernikahan dan bisnis.</p>
             </div>
           </div>
        </div>
      </div>
    );
  };

  const renderBisnis = () => {
    let result = null;
    if (date1) {
      const d = new Date(date1);
      if (!isNaN(d.getTime())) {
        const weton = getWeton(d);
        const bisnis = getStrategiBisnis(weton.neptu, weton.dina, weton.pasaran);
        result = { weton, bisnis };
      }
    }

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl shadow-sm">
          <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Tanggal Lahir Anda</label>
          <input 
            type="date"
            value={date1}
            onChange={e => setDate1(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 text-stone-900 dark:text-stone-200 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
          />
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white/80 dark:bg-stone-900/40 border border-gold-200 dark:border-gold-600/30 overflow-hidden rounded-2xl backdrop-blur-sm shadow-md"
            >
              <div className="p-6 text-center border-b border-gold-200 dark:border-gold-600/20 bg-gradient-to-b from-stone-50 dark:from-stone-800/10 to-transparent">
                <p className="text-stone-500 dark:text-stone-400 text-sm mb-1 uppercase tracking-widest font-medium">Bakat Usaha Weton</p>
                <h3 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-1">
                  {result.weton.dina} {result.weton.pasaran}
                </h3>
              </div>
              <div className="p-6 grid gap-6">
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center border border-stone-200 dark:border-stone-800 text-gold-600 dark:text-gold-500 shrink-0 shadow-sm">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h4 className="text-stone-800 dark:text-stone-300 font-semibold mb-1">Bidang Usaha Cocok</h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{result.bisnis.bidang}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center border border-stone-200 dark:border-stone-800 text-gold-600 dark:text-gold-500 shrink-0 shadow-sm">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h4 className="text-stone-800 dark:text-stone-300 font-semibold mb-1">Waktu Baik Memulai</h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                      Hari: <span className="text-stone-800 dark:text-stone-300">{result.bisnis.hariBaik}</span> <br/>
                      Bulan: <span className="text-stone-800 dark:text-stone-300">{result.bisnis.bulanBaik}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-2">
                   <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2 opacity-10"><TrendingUp size={48} /></div>
                     <h4 className="text-green-600 dark:text-green-500 font-semibold mb-2 flex items-center gap-2">
                       <TrendingUp size={16} /> Kelebihan
                     </h4>
                     <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed relative z-10">
                       {result.bisnis.kelebihan}
                     </p>
                   </div>
                   <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2 opacity-10"><AlertTriangle size={48} /></div>
                     <h4 className="text-orange-500 dark:text-orange-400 font-semibold mb-2 flex items-center gap-2">
                       <AlertTriangle size={16} /> Kekurangan
                     </h4>
                     <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed relative z-10">
                       {result.bisnis.kekurangan}
                     </p>
                   </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glosarium / Explanation */}
        <div className="bg-white/80 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl md:mt-8">
           <h4 className="text-gold-600 dark:text-gold-500 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
             <Info size={18} /> Panduan Ringkas Primbon
           </h4>
           <div className="grid sm:grid-cols-2 gap-4 text-sm text-stone-600 dark:text-stone-400">
             <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-lg border border-stone-100 dark:border-stone-800">
                <p className="font-semibold text-stone-800 dark:text-stone-200 mb-1">Dina & Pasaran</p>
                <p>Paduan siklus 7 hari masehi (Kamis, Jumat, dll) dan 5 hari pasaran Jawa (Legi, Pahing, Pon, Wage, Kliwon). Pertemuannya membentuk Weton unik setiap 35 hari sekali (sebuah 'Selapan').</p>
             </div>
             <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-lg border border-stone-100 dark:border-stone-800">
                <p className="font-semibold text-stone-800 dark:text-stone-200 mb-1">Neptu</p>
                <p>Formula sakral berupa angka dari penjumlahan nilai (angka mati) hari masehi ditambah nilai pasaran. Neptu adalah pondasi utama penarikan semua garis ramalan di dalam kitab Primbon.</p>
             </div>
             <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-lg border border-stone-100 dark:border-stone-800 sm:col-span-2">
                <p className="font-semibold text-stone-800 dark:text-stone-200 mb-1">Wuku</p>
                <p>Adalah perhitungan siklus 30 pekan (1 Wuku = 7 hari) yang dinamakan dari riwayat seorang tokoh prasejarah Jawa, Raden Watugunung. Wuku mewakili corak takdir seseorang atau alam dalam 210 hari masa putarannya, yang memengaruhi segala tata kelola hari baik pernikahan dan bisnis.</p>
             </div>
           </div>
        </div>
      </div>
    );
  };

  const renderJodoh = () => {
    let result = null;
    if (date1 && date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const w1 = getWeton(d1);
        const w2 = getWeton(d2);
        const jodoh = getJodoh(w1.neptu, w2.neptu);
        result = { w1, w2, jodoh };
      }
    }

    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl shadow-sm">
             <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Tanggal Lahir Anda</label>
             <input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 text-stone-900 dark:text-stone-200 outline-none focus:border-gold-500" />
          </div>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl relative shadow-sm">
             <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hidden sm:flex items-center justify-center border-4 border-white dark:border-stone-950 z-10"><Heart size={14} /></div>
             <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Tanggal Lahir Pasangan</label>
             <input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 text-stone-900 dark:text-stone-200 outline-none focus:border-gold-500" />
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden rounded-2xl text-center shadow-md">
              <div className="flex flex-col sm:flex-row items-stretch border-b border-stone-200 dark:border-stone-800 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800 bg-stone-50 dark:bg-stone-950/30">
                 <div className="flex-1 p-4">
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Pihak 1</p>
                    <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">{result.w1.dina} {result.w1.pasaran}</p>
                    <p className="text-sm font-mono text-stone-500 mt-1">Neptu: {result.w1.neptu}</p>
                 </div>
                 <div className="flex-1 p-4">
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Pihak 2</p>
                    <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">{result.w2.dina} {result.w2.pasaran}</p>
                    <p className="text-sm font-mono text-stone-500 mt-1">Neptu: {result.w2.neptu}</p>
                 </div>
              </div>
              <div className="p-6 py-8">
                 <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">Total Neptu Berdua: <span className="text-stone-800 dark:text-stone-300 font-bold">{result.w1.neptu + result.w2.neptu}</span> (dibagi 7, sisa {result.jodoh.score})</p>
                 <div className="inline-block mt-2">
                   <h3 className="text-2xl font-bold text-gold-600 dark:text-gold-500 mb-3">{result.jodoh.category.split('(')[0]}</h3>
                   <p className="text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl max-w-md mx-auto italic border border-stone-200 dark:border-stone-800">
                     "... {result.jodoh.category.split('(')[1]?.replace(')','')} ..."
                   </p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
       <div className="mb-8 text-center space-y-2">
         <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
           <Search size={28} className="text-gold-500" />
           Cek Weton & Primbon
         </h2>
         <p className="text-stone-500 dark:text-stone-400 text-sm">Hitung akurat berdasarkan hari pengelompokan tanggal kalender.</p>
       </div>

       <div className="flex bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-1 mb-6 relative shadow-sm">
          <button 
            onClick={() => setTab('pribadi')} 
            className={cn("flex-1 py-3 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all relative z-10", tab === 'pribadi' ? "text-stone-950" : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200")}
          >
            Sifat Pribadi
          </button>
          <button 
            onClick={() => setTab('bisnis')} 
            className={cn("flex-1 py-3 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all relative z-10", tab === 'bisnis' ? "text-stone-950" : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200")}
          >
            Bisnis & Usaha
          </button>
          <button 
            onClick={() => setTab('jodoh')} 
            className={cn("flex-1 py-3 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all relative z-10", tab === 'jodoh' ? "text-stone-950" : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200")}
          >
            Ramalan Jodoh
          </button>
          <div className={cn(
             "absolute top-1 bottom-1 w-[calc(33.33%-4px)] bg-gold-400 dark:bg-gold-500 rounded-md transition-all duration-300 ease-out shadow-sm", 
             tab === 'pribadi' ? "left-1" : tab === 'bisnis' ? "left-[calc(33.33%+2px)]" : "left-[calc(66.66%+2px)]"
          )} />
       </div>

       <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
            {tab === 'pribadi' ? renderPribadi() : tab === 'bisnis' ? renderBisnis() : renderJodoh()}
          </motion.div>
       </AnimatePresence>
    </div>
  )
}
