import React, { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { WetonCalc } from './components/WetonCalc';
import { AksaraConverter } from './components/AksaraConverter';
import { KonsultasiAI } from './components/KonsultasiAI';
import { JawaEvents } from './components/JawaEvents';
import { SEO } from './components/SEO';
import { CalendarDays, BookOpen, Quote, Moon, Sun, Feather, Star, MessageSquare } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'weton' | 'aksara' | 'ai' | 'acara'>('calendar');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('primbon-theme');
      if (saved) return saved === 'dark';
      return true; // Default ke dark
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('primbon-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('primbon-theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans w-full overflow-x-hidden relative bg-stone-50 dark:bg-stone-950 transition-colors">
      <SEO />
      {/* Mystical Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: Math.random() * 100 + "%" }}
            animate={{ 
              opacity: [0, 0.15, 0],
              y: ["100%", "-20%"],
              x: ["0%", (Math.random() - 0.5) * 50 + "%"]
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity, 
              delay: i * 5,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-gold-400 dark:bg-gold-500 rounded-full blur-[2px]"
            style={{ left: Math.random() * 100 + "%" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
      {/* App Header */}
      <header className="sticky top-0 z-40 bg-stone-100/90 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 pt-4 pb-3 px-4 shadow-sm text-center transition-colors">
         <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight flex justify-center items-center gap-2">
           <span className="text-gold-500 pt-1">❖</span>
           Primbon & Kalender Jawa
           <span className="text-gold-500 pt-1">❖</span>
         </h1>
         <button 
           onClick={() => setIsDarkMode(!isDarkMode)} 
           className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-stone-600 dark:text-stone-300 transition-colors"
           aria-label="Toggle Dark Mode"
         >
           {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
         </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-x-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'calendar' && (
            <motion.div className="flex-1 flex flex-col" key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Calendar />
            </motion.div>
          )}
          {activeTab === 'weton' && (
            <motion.div className="flex-1 flex flex-col" key="weton" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <WetonCalc />
            </motion.div>
          )}
          {activeTab === 'aksara' && (
            <motion.div className="flex-1 flex flex-col" key="aksara" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <AksaraConverter />
            </motion.div>
          )}
          {activeTab === 'ai' && (
            <motion.div className="flex-1 flex flex-col" key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <KonsultasiAI />
            </motion.div>
          )}
          {activeTab === 'acara' && (
            <motion.div className="flex-1 flex flex-col" key="acara" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <JawaEvents onConsult={() => setActiveTab('ai')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)] transition-colors">
         <div className="max-w-md mx-auto px-2 sm:px-6 h-16 flex justify-between items-center bg-transparent">
            {/* Tanggalan */}
            <button 
              onClick={() => setActiveTab('calendar')}
              className={cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors px-1", activeTab === 'calendar' ? "text-gold-500" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300")}
            >
              <CalendarDays size={20} strokeWidth={activeTab === 'calendar' ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">Tanggalan</span>
            </button>
            
            {/* Wetonku */}
            <button 
              onClick={() => setActiveTab('weton')}
              className={cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors px-1", activeTab === 'weton' ? "text-gold-500" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300")}
            >
              <BookOpen size={20} strokeWidth={activeTab === 'weton' ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">Wetonku</span>
            </button>
            
            {/* Konsultasi AI */}
            <button 
              onClick={() => setActiveTab('ai')}
              className={cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors px-1", activeTab === 'ai' ? "text-gold-500 font-bold" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300")}
            >
              <MessageSquare size={20} strokeWidth={activeTab === 'ai' ? 2.5 : 2} className={activeTab === 'ai' ? "drop-shadow-[0_0_8px_rgba(212,163,115,0.4)]" : ""} />
              <span className="text-[10px] font-medium tracking-wide">Konsultasi</span>
            </button>

            {/* Aksara */}
            <button 
              onClick={() => setActiveTab('aksara')}
              className={cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors px-1", activeTab === 'aksara' ? "text-gold-500" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300")}
            >
              <Quote size={20} strokeWidth={activeTab === 'aksara' ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">Aksara</span>
            </button>

            {/* Acara */}
            <button 
              onClick={() => setActiveTab('acara')}
              className={cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors px-1", activeTab === 'acara' ? "text-gold-500" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300")}
            >
              <Star size={20} strokeWidth={activeTab === 'acara' ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">Acara</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
