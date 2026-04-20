import React, { useState, useEffect, lazy, Suspense } from 'react';
import { SEO } from './components/SEO';
import { Footer } from './components/Footer';
import { 
  CalendarDays, BookOpen, MessageSquare, Quote, 
  Compass, Feather, Sun, Moon, Sparkles, LayoutGrid, CloudMoon, Zap, Info
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'calendar' | 'weton' | 'aksara' | 'ai' | 'kompas' | 'cerita' | 'rajah' | 'mimpi' | 'kedutan' | 'about' | 'privacy' | 'terms';

// Lazy loading for optimization
const Calendar = lazy(() => import('./components/Calendar').then(m => ({ default: m.Calendar })));
const RajahLibrary = lazy(() => import('./components/RajahLibrary').then(m => ({ default: m.RajahLibrary })));
const WetonCalc = lazy(() => import('./components/WetonCalc').then(m => ({ default: m.WetonCalc })));
const AksaraConverter = lazy(() => import('./components/AksaraConverter').then(m => ({ default: m.AksaraConverter })));
const KonsultasiAI = lazy(() => import('./components/KonsultasiAI').then(m => ({ default: m.KonsultasiAI })));
const JawaEvents = lazy(() => import('./components/JawaEvents').then(m => ({ default: m.JawaEvents })));
const FortuneCompass = lazy(() => import('./components/FortuneCompass').then(m => ({ default: m.FortuneCompass })));
const MysticalStories = lazy(() => import('./components/MysticalStories').then(m => ({ default: m.MysticalStories })));
const TafsirMimpi = lazy(() => import('./components/TafsirMimpi.tsx').then(m => ({ default: m.TafsirMimpi })));
const KedutanFirasat = lazy(() => import('./components/KedutanFirasat').then(m => ({ default: m.KedutanFirasat })));
const About = lazy(() => import('./components/About.tsx').then(m => ({ default: m.About })));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy.tsx').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./components/TermsOfService.tsx').then(m => ({ default: m.TermsOfService })));

// Loading placeholder
const NavLoading = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-10 gap-4">
    <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
    <span className="text-stone-400 text-xs font-medium animate-pulse uppercase tracking-widest">Memuat Energi Semesta...</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('primbon-active-tab');
      return (saved as Tab) || 'calendar';
    }
    return 'calendar';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('primbon-theme');
      if (saved) return saved === 'dark';
      return true; // Default ke dark
    }
    return true;
  });

  // Save active tab
  useEffect(() => {
    localStorage.setItem('primbon-active-tab', activeTab);
  }, [activeTab]);

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
      
      {/* Sub-header Menu (4-column Grid) */}
      <nav className="sticky top-[60px] z-30 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors w-full">
        <div className="max-w-3xl mx-auto p-2 grid grid-cols-4 gap-1.5">
          {[
            { id: 'calendar', label: 'Kalender', icon: CalendarDays },
            { id: 'weton', label: 'Wetonku', icon: BookOpen },
            { id: 'mimpi', label: 'Tafsir Mimpi', icon: CloudMoon },
            { id: 'cerita', label: 'Cerita', icon: Feather },
            { id: 'aksara', label: 'Aksara', icon: Quote },
            { id: 'rajah', label: 'Pustaka Rajah', icon: Sparkles },
            { id: 'kompas', label: 'Kompas', icon: Compass },
            { id: 'kedutan', label: 'Kedutan', icon: Zap },
            { id: 'ai', label: 'AI Sesepuh', icon: MessageSquare },
            { id: 'about', label: 'Tentang', icon: Info },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl transition-all border",
                activeTab === item.id 
                  ? "bg-gold-500/10 dark:bg-gold-500/20 text-gold-600 dark:text-gold-400 border-gold-500/30 shadow-[inset_0_0_12px_rgba(212,163,115,0.05)]" 
                  : "bg-white/50 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 border-stone-100 dark:border-stone-800 hover:border-gold-200 dark:hover:border-gold-800"
              )}
            >
              <item.icon size={16} className={activeTab === item.id ? "text-gold-600 dark:text-gold-500" : ""} />
              <span className="text-[9px] font-bold uppercase tracking-tighter text-center leading-[1.1]">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-x-hidden flex flex-col pt-4 pb-20">
        <AnimatePresence mode="wait">
          <Suspense fallback={<NavLoading />}>
            {activeTab === 'calendar' && (
              <motion.div className="flex-1 flex flex-col" key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <Calendar setTab={setActiveTab} />
              </motion.div>
            )}
            {activeTab === 'rajah' && (
              <motion.div className="flex-1 flex flex-col" key="rajah" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                <RajahLibrary onBack={() => setActiveTab('calendar')} />
              </motion.div>
            )}
            {activeTab === 'weton' && (
              <motion.div className="flex-1 flex flex-col" key="weton" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <WetonCalc />
              </motion.div>
            )}
            {activeTab === 'ai' && (
              <motion.div className="flex-1 flex flex-col" key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <KonsultasiAI />
              </motion.div>
            )}
            {activeTab === 'kompas' && (
              <motion.div className="flex-1 flex flex-col" key="kompas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <FortuneCompass />
              </motion.div>
            )}
            {activeTab === 'cerita' && (
              <motion.div className="flex-1 flex flex-col" key="cerita" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <MysticalStories />
              </motion.div>
            )}
            {activeTab === 'aksara' && (
              <motion.div className="flex-1 flex flex-col" key="aksara" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <AksaraConverter />
              </motion.div>
            )}
            {activeTab === 'mimpi' && (
              <motion.div className="flex-1 flex flex-col" key="mimpi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <TafsirMimpi />
              </motion.div>
            )}
            {activeTab === 'kedutan' && (
              <motion.div className="flex-1 flex flex-col" key="kedutan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <KedutanFirasat setActiveTab={setActiveTab} />
              </motion.div>
            )}
            {activeTab === 'about' && (
              <motion.div className="flex-1 flex flex-col" key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <About />
              </motion.div>
            )}
            {activeTab === 'privacy' && (
              <motion.div className="flex-1 flex flex-col" key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <PrivacyPolicy />
              </motion.div>
            )}
            {activeTab === 'terms' && (
              <motion.div className="flex-1 flex flex-col" key="terms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <TermsOfService />
              </motion.div>
            )}
          </Suspense>
        </AnimatePresence>

        <Footer setTab={setActiveTab} />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)] transition-colors">
         <div className="max-w-md mx-auto px-2 sm:px-6 h-16 flex justify-between items-center bg-transparent">
            {[
              { id: 'calendar', label: 'Kalender', icon: CalendarDays },
              { id: 'weton', label: 'Wetonku', icon: BookOpen },
              { id: 'mimpi', label: 'Mimpi', icon: CloudMoon },
              { id: 'ai', label: 'AI Sesepuh', icon: MessageSquare },
              { id: 'kompas', label: 'Kompas', icon: Compass },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors px-1", 
                  activeTab === item.id ? "text-gold-500" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300"
                )}
              >
                <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} className={activeTab === item.id ? "drop-shadow-[0_0_8px_rgba(212,163,115,0.4)]" : ""} />
                <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
