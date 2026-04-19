import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Info, Search, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWeton, getJavaneseDateLocal, getPranataMangsa } from '../lib/jawaMath';
import { cn } from '../lib/utils';

interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  weton: ReturnType<typeof getWeton>;
  jowo: ReturnType<typeof getJavaneseDateLocal>;
  pranata: ReturnType<typeof getPranataMangsa>;
}

const DAYS_OF_WEEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
    
    const endDate = new Date(lastDay);
    if (endDate.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday
    }

    const daysArray: DayData[] = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    let current = new Date(startDate);
    while (current <= endDate) {
      const d = new Date(current);
      d.setHours(0,0,0,0);
      daysArray.push({
        date: d,
        isCurrentMonth: current.getMonth() === month,
        isToday: d.getTime() === today.getTime(),
        weton: getWeton(d),
        jowo: getJavaneseDateLocal(d),
        pranata: getPranataMangsa(d)
      });
      current.setDate(current.getDate() + 1);
    }
    return daysArray;
  }, [currentDate]);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 3) return [];
    
    const q = searchQuery.toLowerCase();
    const results: DayData[] = [];
    const year = currentDate.getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    let current = new Date(startDate);
    while (current <= endDate) {
      const d = new Date(current);
      const w = getWeton(d);
      const pr = getPranataMangsa(d);
      const jowo = getJavaneseDateLocal(d);
      
      const wetonStr = `${w.dina} ${w.pasaran}`.toLowerCase();
      const wukuStr = w.wuku.toLowerCase();
      const monthStr = MONTHS[current.getMonth()].toLowerCase();
      const dateStr = `${current.getDate()} ${monthStr} ${year}`;
      const searchStr = `${wetonStr} ${wukuStr} ${pr.name} ${jowo.month} ${dateStr} jumat kliwon selasa kliwon`.toLowerCase();
      
      if (searchStr.includes(q)) {
        d.setHours(0,0,0,0);
        results.push({
          date: d,
          isCurrentMonth: true,
          isToday: false,
          weton: w,
          jowo,
          pranata: pr
        });
      }
      current.setDate(current.getDate() + 1);
    }
    
    return results.slice(0, 12);
  }, [searchQuery, currentDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleSelectSearchResult = (res: DayData) => {
    setCurrentDate(new Date(res.date.getFullYear(), res.date.getMonth(), 1));
    setSelectedDay(res);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <section className="w-full max-w-5xl mx-auto pb-32 px-3 sm:px-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pt-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-gold-500 tracking-tight flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <span className="flex items-center gap-2"><CalendarIcon size={24} /> {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <span className="text-[11px] sm:text-sm font-medium text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-800 px-2 py-1 rounded-md">
            {getJavaneseDateLocal(currentDate).month} {getJavaneseDateLocal(currentDate).year}
          </span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-end relative" ref={searchRef}>
          {/* Search Bar */}
          <div className="relative w-full sm:w-[250px]">
            <input 
              type="text" 
              placeholder="Cari (mis: Wage, Kliwon, Sinta)..." 
              value={searchQuery}
              onClick={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              className="w-full pl-9 pr-3 py-2 sm:py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 shadow-sm text-stone-800 dark:text-stone-200 transition-colors"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            
            {/* Search Dropdown */}
            <AnimatePresence>
              {isSearchOpen && searchQuery.length >= 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl rounded-xl overflow-hidden z-50 max-h-[300px] overflow-y-auto"
                >
                  <div className="p-2 text-xs font-semibold text-stone-500 bg-stone-50 dark:bg-stone-950 uppercase tracking-wider sticky top-0 border-b border-stone-200 dark:border-stone-800">
                    Hasil Pencarian di Tahun {currentDate.getFullYear()}
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-stone-100 dark:divide-stone-800">
                      {searchResults.map((res, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSelectSearchResult(res)}
                          className="w-full text-left p-3 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between"
                        >
                          <div>
                            <p className="font-semibold text-sm text-stone-800 dark:text-stone-200">{res.date.getDate()} {MONTHS[res.date.getMonth()]}</p>
                            <p className="text-xs text-gold-600 dark:text-gold-500 font-medium">{res.weton.dina} {res.weton.pasaran} (Wuku {res.weton.wuku})</p>
                          </div>
                          <ChevronRight size={16} className="text-stone-300" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-stone-500 dark:text-stone-400">
                      Tidak ada hasil yang cocok.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            <button onClick={goToToday} className="text-sm font-medium bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 px-3 py-2 sm:py-2 rounded-md transition-colors flex-1 sm:flex-none whitespace-nowrap">Hari Ini</button>
            <button onClick={prevMonth} className="flex-1 sm:flex-none flex justify-center p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className="flex-1 sm:flex-none flex justify-center p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="bg-white/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden backdrop-blur-md w-full shadow-sm">
        <div className="grid grid-cols-7 bg-stone-100/50 dark:bg-stone-950/50 border-b border-stone-200 dark:border-stone-800">
          {DAYS_OF_WEEK.map((day, i) => (
            <div key={day} className={cn("py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider", i === 0 ? "text-red-500 dark:text-red-400/80" : "text-stone-500 dark:text-stone-400")}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-stone-200 dark:bg-stone-800">
          {days.map((day, i) => {
            const isKliwon = day.weton.pasaran === 'Kliwon';
            const isJumatKliwon = day.weton.isJumatKliwon;
            const isSelasaKliwon = day.weton.isSelasaKliwon;
            const highlight = isJumatKliwon || isSelasaKliwon;

            return (
              <button
                key={day.date.getTime()}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "relative aspect-[3/4] sm:aspect-square flex flex-col p-1.5 sm:p-2 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-left w-full overflow-hidden",
                  !day.isCurrentMonth && "opacity-40",
                  day.isToday && "ring-2 ring-gold-500 ring-inset z-10",
                  highlight && "bg-[#fefce8] dark:bg-[#2d2417] hover:bg-[#fef08a] dark:hover:bg-[#3d3120]"
                )}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={cn("text-base sm:text-xl font-bold leading-none", day.date.getDay() === 0 ? "text-red-500 dark:text-red-400" : "text-stone-900 dark:text-stone-200")}>
                    {day.date.getDate()}
                  </span>
                  <span className="text-[9px] sm:text-xs text-stone-400 dark:text-stone-500 font-mono hidden md:block truncate ml-1">
                    {day.weton.wuku.slice(0, 3)}
                  </span>
                </div>
                
                <div className="mt-auto items-start flex flex-col sm:gap-0.5 w-full">
                  <div className={cn("text-[9px] sm:text-sm font-medium leading-tight truncate w-full", isKliwon ? "text-gold-600 dark:text-gold-500" : "text-stone-500 dark:text-stone-400")}>
                    {day.weton.pasaran}
                  </div>
                  <div className="flex justify-between w-full items-baseline overflow-hidden">
                    <span className="text-[8px] sm:text-xs text-gold-600/90 dark:text-gold-600/80 font-bold truncate leading-none">
                      {day.jowo.date} {day.jowo.month.slice(0, 3)}
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-stone-400 dark:text-stone-500 hidden sm:block shrink-0 ml-1 leading-none">
                      {day.jowo.hijriStr.split(' ')[0]}H
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && (
          <Modal day={selectedDay} onClose={() => setSelectedDay(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function Modal({ day, onClose }: { day: DayData; onClose: () => void }) {
  const dFormat = new Intl.DateTimeFormat('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/60 dark:bg-stone-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl dark:shadow-black overflow-hidden z-10"
      >
        <div className="flex justify-between items-center p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/30">
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">{day.weton.dina} {day.weton.pasaran}</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{dFormat.format(day.date)}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-stone-100 dark:bg-stone-800/50 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
                <p className="text-xs text-stone-500 font-medium mb-1 tracking-wider uppercase">Wuku</p>
                <div className="text-lg text-gold-600 dark:text-gold-500 font-semibold">{day.weton.wuku}</div>
             </div>
             <div className="bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
                <p className="text-xs text-stone-500 font-medium mb-1 tracking-wider uppercase">Nilai Neptu</p>
                <div className="text-lg text-gold-600 dark:text-gold-500 font-semibold">{day.weton.neptu}</div>
                <div className="text-[10px] text-stone-500 mt-1">({day.weton.dinaNeptu} + {day.weton.pasaranNeptu})</div>
             </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-4">
            <div>
              <p className="text-xs text-stone-500 font-medium mb-1 tracking-wider uppercase">Sistem Penanggalan</p>
              <div className="text-sm text-stone-700 dark:text-stone-300">
                 Tanggal Jawa: <span className="font-semibold text-stone-900 dark:text-stone-200">{day.jowo.date} {day.jowo.month} {day.jowo.year}</span>
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                 Hijriah: {day.jowo.hijriStr}
              </div>
            </div>
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800/50">
              <p className="text-xs text-stone-500 font-medium mb-1 tracking-wider uppercase flex items-center gap-2">
                <Info size={14} className="text-gold-500" />
                Pranata Mangsa: {day.pranata.name}
              </p>
              <div className="text-sm text-stone-700 dark:text-stone-300 italic mt-2 bg-stone-100 dark:bg-stone-900/50 p-3 rounded-lg border border-stone-200 dark:border-stone-800/50 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold-500 rounded-l-lg"></div>
                {day.pranata.desc}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
