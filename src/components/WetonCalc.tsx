import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { getWeton, getWatak, getJodoh, getRamalanNasib, getArahRezeki, getWarnaKeberuntungan, getStrategiBisnis, getDailyLuck, getCharacterScores, getAuspiciousHours } from '../lib/jawaMath';
import { cn } from '../lib/utils';
import { Heart, Search, User, Flame, Sparkles, Compass, Palette, Briefcase, TrendingUp, AlertTriangle, Info, Zap, Clock, Share2, Download, Check, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RadarChart } from './RadarChart';
import { FortuneCompass } from './FortuneCompass';
import { WetonCircle } from './WetonCircle';
import { PalSrigati } from './PalSrigati';
import { getNagaHari, getHajatHarian } from '../lib/jawaMath';

export function WetonCalc() {
  const cardRef = useRef<HTMLElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [tab, setTab] = useState<'pribadi' | 'bisnis' | 'jodoh' | 'hajat'>('pribadi');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [showLoveMeter, setShowLoveMeter] = useState(false);
  const [loveProgress, setLoveProgress] = useState(0);

  useEffect(() => {
    if (showLoveMeter) {
      setLoveProgress(0);
      const timer = setTimeout(() => setLoveProgress(100), 100);
      return () => clearTimeout(timer);
    }
  }, [showLoveMeter]);

  const handleCapture = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    setCaptureStatus('idle');

    try {
      // Small delay to ensure any animations finish
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Weton-Jawa-${date1}.png`;
      link.href = image;
      link.click();
      
      setCaptureStatus('success');
      setTimeout(() => setCaptureStatus('idle'), 3000);
    } catch (err) {
      console.error('Capture failed:', err);
      setCaptureStatus('error');
    } finally {
      setIsCapturing(false);
    }
  };

  const renderPribadi = () => {
    let result = null;
    let dailyLuck = null;
    let charScores = null;
    let hours = null;

    if (date1) {
      const d = new Date(date1);
      if (!isNaN(d.getTime())) {
        const weton = getWeton(d);
        const todayWeton = getWeton(new Date());
        const watak = getWatak(weton.neptu);
        const nasib = getRamalanNasib(weton.neptu);
        const arah = getArahRezeki(weton.neptu);
        const warna = getWarnaKeberuntungan(weton.neptu);
        
        result = { weton, watak, nasib, arah, warna };
        dailyLuck = getDailyLuck(weton.neptu, todayWeton.neptu);
        charScores = getCharacterScores(weton.neptu);
        hours = getAuspiciousHours(new Date().getDay());
      }
    }

    const nagaHari = date1 ? getNagaHari(new Date(date1)) : null;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl shadow-sm">
          <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Tanggal Lahir Anda</label>
                    <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" size={18} />
            <input 
              type="date"
              value={date1}
              onChange={e => setDate1(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 pl-10 text-stone-900 dark:text-stone-200 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
            />
          </div>
        </div>

        <AnimatePresence>
          {result && dailyLuck && charScores && hours && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Daily Fortune Card */}
              <article className="bg-gradient-to-br from-gold-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-20"><Zap size={100} /></div>
                <div className="relative z-10">
                  <header className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Keberuntungan Hari Ini</h4>
                    <span className="text-2xl font-black">{dailyLuck.score}%</span>
                  </header>
                  <p className="text-lg font-medium leading-tight mb-2">"{dailyLuck.advice}"</p>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden" role="progressbar" aria-valuenow={dailyLuck.score} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${dailyLuck.score}%` }} 
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-white h-full" 
                    />
                  </div>
                </div>
              </article>

              {/* Character Radar */}
              <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
                <h4 className="text-center text-sm font-bold text-stone-500 uppercase tracking-widest mb-6">Analisis Karakter Neptu</h4>
                <RadarChart data={charScores} />
              </section>

              {/* Main Result Card */}
              <article 
                ref={cardRef}
                className="bg-white dark:bg-stone-900 border border-gold-200 dark:border-gold-600/30 overflow-hidden rounded-2xl backdrop-blur-sm shadow-md"
              >
                <div className="p-6 text-center border-b border-gold-200 dark:border-gold-600/20 bg-gradient-to-b from-gold-50 dark:from-gold-500/10 to-transparent relative">
                  {/* Share button (Float) */}
                  <button 
                    onClick={handleCapture}
                    disabled={isCapturing}
                    className={cn(
                      "absolute right-4 top-4 p-2.5 rounded-full transition-all duration-300 shadow-sm border",
                      captureStatus === 'success' 
                        ? "bg-green-500 border-green-400 text-white" 
                        : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-gold-600 dark:text-gold-400 hover:scale-110 active:scale-95"
                    )}
                    title="Simpan sebagai Gambar"
                  >
                    {isCapturing ? <div className="w-5 h-5 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" /> : 
                     captureStatus === 'success' ? <Check size={20} /> : <Download size={20} />}
                  </button>

                  <p className="text-stone-500 dark:text-stone-400 text-xs mb-1 uppercase tracking-widest font-bold">Weton Lahir Ananda</p>
                  <h3 className="text-3xl font-black text-gold-600 dark:text-gold-500 mb-2 drop-shadow-sm">
                    {result.weton.dina} {result.weton.pasaran}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-stone-950/50 rounded-full border border-gold-100 dark:border-gold-900/30 shadow-sm">
                    <span className="text-stone-500 dark:text-stone-400 text-[10px] font-bold uppercase">Wuku:</span>
                    <span className="text-gold-600 dark:text-gold-500 font-bold text-sm">{result.weton.wuku}</span>
                  </div>

                  <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold uppercase tracking-tighter text-stone-400">
                    <div className="flex flex-col">
                      <span>Neptu</span>
                      <span className="text-lg text-stone-700 dark:text-stone-300">{result.weton.neptu}</span>
                    </div>
                    <div className="w-px h-8 bg-stone-200 dark:bg-stone-800 my-auto" />
                    <div className="flex flex-col">
                      <span>Pranata Mangsa</span>
                      <span className="text-lg text-stone-700 dark:text-stone-300">{result.weton.mangsa || 'Kapat'}</span>
                    </div>
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
                      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-950 flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-300 shrink-0 shadow-sm">
                            <Compass size={18} />
                          </div>
                          <div>
                            <h4 className="text-stone-800 dark:text-stone-300 font-semibold mb-1">Arah Rezeki & Kejayaan</h4>
                            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{result.arah}</p>
                          </div>
                        </div>
                        <div className="shrink-0 scale-75 sm:scale-100 -my-4">
                          <FortuneCompass />
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

                {/* Auspicious Hours */}
                <div className="border-t border-stone-100 dark:border-stone-800 p-6 bg-stone-50/50 dark:bg-stone-950/20">
                   <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Clock size={14} /> Jam Baik Hari Ini
                   </h4>
                   <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {hours.map((h, idx) => (
                        <div key={idx} className={cn(
                          "p-2 rounded-lg border text-center transition-all",
                          h.status === 'good' ? "bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/50" : 
                          h.status === 'warning' ? "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800/50" :
                          "bg-white border-stone-100 dark:bg-stone-900 dark:border-stone-800"
                        )}>
                           <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 mb-0.5">{h.time}</div>
                           <div className={cn("text-[10px] font-bold truncate", h.status === 'good' ? "text-green-600" : h.status === 'warning' ? "text-red-500" : "text-stone-600 dark:text-stone-400")}>
                             {h.name}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Pal Srigati Graph */}
                <div className="border-t border-stone-100 dark:border-stone-800 p-6">
                  <PalSrigati neptu={result.weton.neptu} />
                </div>

                {/* Naga Hari Section */}
                <div className="border-t border-stone-100 dark:border-stone-800 p-6 bg-stone-900 dark:bg-stone-950 text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-4 opacity-10 rotate-12"><Compass size={80} /></div>
                  <h4 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} /> Pantangan Naga Hari
                  </h4>
                  <p className="text-sm font-medium mb-1">Hari ini Naga berada di: <span className="text-gold-400">{nagaHari}</span></p>
                  <p className="text-[10px] text-stone-400 italic leading-tight">"Hindari berjalan ke arah tersebut untuk urusan penting agar tidak menemui kesialan atau rintangan berat."</p>
                </div>
              </article>
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

        <div className="border-t border-stone-200 dark:border-stone-800/50 pt-8 mt-8">
           <WetonCircle onSelect={(dob) => setDate1(dob)} />
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
                    <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" size={18} />
            <input 
              type="date"
              value={date1}
              onChange={e => setDate1(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 pl-10 text-stone-900 dark:text-stone-200 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-sans"
            />
          </div>
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
        if (!showLoveMeter) setShowLoveMeter(true);
      }
    }

    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl shadow-sm">
             <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Tanggal Lahir Anda</label>
             <div className="relative">
               <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" size={16} />
               <input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 pl-9 text-stone-900 dark:text-stone-200 outline-none focus:border-gold-500" />
             </div>
          </div>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl relative shadow-sm">
             <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 hidden sm:flex items-center justify-center border-4 border-white dark:border-stone-950 z-10"><Heart size={14} /></div>
             <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Tanggal Lahir Pasangan</label>
             <div className="relative">
               <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" size={16} />
               <input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 pl-9 text-stone-900 dark:text-stone-200 outline-none focus:border-gold-500" />
             </div>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden rounded-2xl text-center shadow-md">
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
                <div className="p-6 py-8 relative overflow-hidden">
                   {/* Animated Love Meter Bar */}
                   <div className="absolute top-0 left-0 w-full h-1 bg-stone-100 dark:bg-stone-800">
                     <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: `${loveProgress}%` }} 
                       transition={{ duration: 1.5, ease: "easeInOut" }}
                       className="h-full bg-gradient-to-r from-red-400 to-pink-500" 
                     />
                   </div>

                   <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">Total Neptu Berdua: <span className="text-stone-800 dark:text-stone-300 font-bold">{result.jodoh.total}</span></p>
                   <div className="inline-block mt-2">
                     <motion.div
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ delay: 1.2, type: "spring" }}
                     >
                       <h3 className="text-2xl font-bold text-gold-600 dark:text-gold-500 mb-3 uppercase tracking-tighter">{result.jodoh.sisa8.category.split('(')[0]}</h3>
                     </motion.div>
                     <p className="text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl max-w-md mx-auto italic border border-stone-200 dark:border-stone-800">
                       "... {result.jodoh.sisa8.category.split('(')[1]?.replace(')','')} ..."
                     </p>
                     <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="bg-stone-100 dark:bg-stone-800/30 p-2 rounded text-[10px] text-stone-500">
                          <span className="font-bold block text-stone-400 mb-1">HASIL UTAMA (Sisa 8)</span>
                          {result.jodoh.sisa8.category.split('(')[0]}
                        </div>
                        <div className="bg-stone-100 dark:bg-stone-800/30 p-2 rounded text-[10px] text-stone-500">
                          <span className="font-bold block text-stone-400 mb-1">WATAK HUBUNGAN (Sisa 7)</span>
                          {result.jodoh.sisa7.category.split('(')[0]}
                        </div>
                     </div>
                   </div>
                </div>
              </div>
              
              <button className="w-full py-4 bg-stone-100 dark:bg-stone-800 rounded-xl text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-white transition-all shadow-sm">
                Simpan Sebagai Kartu Weton
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const renderHajat = () => {
    let hajat = null;
    if (date1) {
      const d = new Date(date1);
      const weton = getWeton(d);
      hajat = getHajatHarian(weton.neptu);
    }

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl shadow-sm">
          <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">Pilih Tanggal Acara / Kelahiran</label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" size={18} />
            <input 
              type="date"
              value={date1}
              onChange={e => setDate1(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-3 pl-10 text-stone-900 dark:text-stone-200 outline-none focus:border-gold-500 transition-all"
            />
          </div>
        </div>

        <AnimatePresence>
          {hajat && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
              {hajat.map((h, i) => (
                <div key={i} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border",
                    h.status === 'Sangat Baik' || h.status === 'Unggul' ? "bg-green-50 border-green-200 text-green-600" : "bg-stone-50 border-stone-200 text-stone-600"
                  )}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-stone-800 dark:text-stone-200">{h.type}</h4>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                        h.status === 'Sangat Baik' || h.status === 'Unggul' ? "bg-green-500 text-white" : "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      )}>{h.status}</span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{h.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-stone-900 text-white p-6 rounded-2xl relative overflow-hidden">
           <Zap className="absolute -right-4 -top-4 opacity-10" size={100} />
           <h4 className="text-gold-500 font-bold text-sm uppercase tracking-widest mb-3">Pesan Bijak</h4>
           <p className="text-xs text-stone-300 leading-relaxed italic">
             "Perhitungan hari hanyalah ikhtiar batin manusia untuk menyelaraskan diri dengan alam. Kunci utama keberhasilan tetaplah doa, usaha, dan tawakal kepada Sang Khaliq."
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
       <div className="mb-8 text-center space-y-2">
         <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
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
          <button 
            onClick={() => setTab('hajat')} 
            className={cn("flex-1 py-3 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all relative z-10", tab === 'hajat' ? "text-stone-950" : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200")}
          >
            Hajat & Acara
          </button>
          <div className={cn(
             "absolute top-1 bottom-1 w-[calc(25%-4px)] bg-gold-400 dark:bg-gold-500 rounded-md transition-all duration-300 ease-out shadow-sm", 
             tab === 'pribadi' ? "left-1" : tab === 'bisnis' ? "left-[calc(25%+1px)]" : tab === 'jodoh' ? "left-[calc(50%+1px)]" : "left-[calc(75%+1px)]"
          )} />
       </div>

       <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
            {tab === 'pribadi' ? renderPribadi() : tab === 'bisnis' ? renderBisnis() : tab === 'jodoh' ? renderJodoh() : renderHajat()}
          </motion.div>
       </AnimatePresence>
    </div>
  )
}
