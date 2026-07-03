import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { SEO } from './components/SEO';
import { Footer } from './components/Footer';
import { AdSlot } from './components/AdSlot';
import { SplashCurtain } from './components/SplashCurtain';
import { 
  CalendarDays, BookOpen, MessageSquare, Quote, Heart,
  Compass, Feather, Sun, Moon, Sparkles, LayoutGrid, CloudMoon, Zap, Info, Search, Eye, EyeOff, ArrowLeft, HeartPulse, Activity, Volume2, Palette
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'calendar' | 'weton' | 'jodoh' | 'aksara' | 'ai' | 'kompas' | 'cerita' | 'rajah' | 'mimpi' | 'kedutan' | 'hilang' | 'katuranggan' | 'about' | 'privacy' | 'terms' | 'rejeki' | 'halangan' | 'lindu' | 'telinga' | 'warnapasaran' | 'pasangiklan';

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
const BarangHilang = lazy(() => import('./components/BarangHilang').then(m => ({ default: m.BarangHilang })));
const Katuranggan = lazy(() => import('./components/Katuranggan').then(m => ({ default: m.Katuranggan })));
const ImageGenerator = lazy(() => import('./components/ImageGenerator').then(m => ({ default: m.ImageGenerator })));
const WetonJodoh = lazy(() => import('./components/WetonJodoh').then(m => ({ default: m.WetonJodoh })));
const ArahRejeki = lazy(() => import('./components/ArahRejeki').then(m => ({ default: m.ArahRejeki })));
const PrimbonHalangan = lazy(() => import('./components/PrimbonHalangan').then(m => ({ default: m.PrimbonHalangan })));
const PrimbonLindu = lazy(() => import('./components/PrimbonLindu').then(m => ({ default: m.PrimbonLindu })));
const TelingaBerdenging = lazy(() => import('./components/TelingaBerdenging').then(m => ({ default: m.TelingaBerdenging })));
const ArahWarnaPasaran = lazy(() => import('./components/ArahWarnaPasaran').then(m => ({ default: m.ArahWarnaPasaran })));
const PasangIklan = lazy(() => import('./components/PasangIklan').then(m => ({ default: m.PasangIklan })));

// Loading placeholder
const NavLoading = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-10 gap-4">
    <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
    <span className="text-stone-400 text-xs font-medium animate-pulse uppercase tracking-widest">Memuat Energi Semesta...</span>
  </div>
);

function PrimbonApp() {
  const navigate = useNavigate();
  const location = useLocation();
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
      return true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('primbon-active-tab', activeTab);
    // Reset scroll position to top when tab changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <SplashCurtain />
      <SEO />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: Math.random() * 100 + "%" }}
            animate={{ opacity: [0, 0.15, 0], y: ["100%", "-20%"], x: ["0%", (Math.random() - 0.5) * 50 + "%"] }}
            transition={{ duration: 10 + Math.random() * 20, repeat: Infinity, delay: i * 5, ease: "linear" }}
            className="absolute w-1 h-1 bg-gold-400 dark:bg-gold-500 rounded-full blur-[2px]"
            style={{ left: Math.random() * 100 + "%" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row min-h-[100dvh]">
        {/* MOBILE HEADER */}
        <header className="md:hidden sticky top-0 z-40 bg-stone-100/90 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 pt-4 pb-3 px-4 shadow-sm text-center transition-colors">
           <h1 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight flex justify-center items-center gap-2">
             <span className="text-gold-500 pt-1">❖</span>
             Primbon & Kalender
             <span className="text-gold-500 pt-1">❖</span>
           </h1>
        </header>

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-72 fixed inset-y-0 left-0 bg-stone-100/95 dark:bg-stone-950/95 backdrop-blur-2xl border-r border-stone-200 dark:border-stone-800 z-50 p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] overflow-y-auto transition-colors">
          <div className="flex flex-col items-center mb-10 mt-4 text-center">
            <h1 className="text-3xl font-serif font-black text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
              <span className="text-gold-500 block text-lg mb-2">❖</span>
              Primbon Jawa
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 font-bold mt-3">Warisan Leluhur</p>
          </div>
          
          <div className="flex flex-col gap-1.5 flex-1">
            {[
              { id: 'calendar', label: 'Kalender Jawa', icon: CalendarDays },
              { id: 'weton', label: 'Kalkulator Weton', icon: BookOpen },
              { id: 'jodoh', label: 'Cek Jodoh', icon: Heart },
              { id: 'mimpi', label: 'Tafsir Mimpi', icon: CloudMoon },
              { id: 'rejeki', label: 'Arah Rejeki', icon: Compass },
              { id: 'warnapasaran', label: 'Warna Pasaran', icon: Palette },
              { id: 'halangan', label: 'Firasat Haid', icon: HeartPulse },
              { id: 'lindu', label: 'Firasat Lindu', icon: Activity },
              { id: 'telinga', label: 'Telinga Berdenging', icon: Volume2 },
              { id: 'kedutan', label: 'Makna Kedutan', icon: Zap },
              { id: 'cerita', label: 'Cerita Mistis', icon: Feather },
              { id: 'aksara', label: 'Aksara Jawa', icon: Quote },
              { id: 'rajah', label: 'Pustaka Rajah', icon: Sparkles },
              { id: 'kompas', label: 'Kompas Arah', icon: Compass },
              { id: 'hilang', label: 'Lacak Barang', icon: Search },
              { id: 'katuranggan', label: 'Katuranggan', icon: Eye },
              { id: 'about', label: 'Tentang Aplikasi', icon: Info },
              { id: 'ai', label: 'Tanya Sesepuh AI', icon: MessageSquare, highlight: true },
              { id: 'studio', label: 'AI Image Studio', icon: Zap, highlight: true },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'studio') {
                    navigate('/studio');
                  } else {
                    setActiveTab(item.id as Tab);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 py-3 px-4 rounded-2xl transition-all border text-sm font-bold w-full text-left",
                  activeTab === item.id 
                    ? "bg-gold-500/10 dark:bg-gold-500/20 text-gold-600 dark:text-gold-400 border-gold-500/30 shadow-[inset_0_0_12px_rgba(212,163,115,0.05)]" 
                    : item.highlight
                      ? "bg-stone-900 dark:bg-gold-600 text-white border-transparent shadow-md hover:bg-stone-800 dark:hover:bg-gold-500"
                      : "bg-transparent border-transparent text-stone-600 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-900/50 hover:border-stone-200 dark:hover:border-stone-800"
                )}
              >
                <item.icon size={18} className={activeTab === item.id ? "text-gold-600 dark:text-gold-500" : (item.highlight ? "text-gold-300 dark:text-white" : "text-stone-400")} />
                <span className={cn("tracking-wide", item.highlight && "uppercase tracking-widest text-xs")}>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>
        
        {/* MOBILE SECONDARY NAV */}
        <nav className="md:hidden sticky top-[60px] z-30 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors w-full">
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
              { id: 'hilang', label: 'Lacak Barang', icon: Search },
              { id: 'katuranggan', label: 'Katuranggan', icon: Eye },
              { id: 'ai', label: 'AI Sesepuh', icon: MessageSquare },
              { id: 'jodoh', label: 'Cek Jodoh', icon: Heart },
              { id: 'rejeki', label: 'Arah Rejeki', icon: Compass },
              { id: 'warnapasaran', label: 'Warna Pasaran', icon: Palette },
              { id: 'halangan', label: 'Haid', icon: HeartPulse },
              { id: 'lindu', label: 'Lindu', icon: Activity },
              { id: 'telinga', label: 'Telinga', icon: Volume2 },
              { id: 'studio', label: 'AI Studio', icon: Zap, highlight: true },
            ].filter(item => {
              // Daftar item yang sudah ada di bottom nav
              const bottomNavIds = ['calendar', 'weton', 'jodoh', 'mimpi', 'ai'];
              return !bottomNavIds.includes(item.id);
            }).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'studio') {
                    navigate('/studio');
                  } else {
                    setActiveTab(item.id as Tab);
                  }
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl transition-all border",
                  activeTab === item.id 
                    ? "bg-gold-500/10 dark:bg-gold-500/20 text-gold-600 dark:text-gold-400 border-gold-500/30 shadow-[inset_0_0_12px_rgba(212,163,115,0.05)]" 
                    : item.highlight
                      ? "bg-stone-900 dark:bg-gold-600 text-white border-transparent"
                      : "bg-white/50 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 border-stone-100 dark:border-stone-800 hover:border-gold-200 dark:hover:border-gold-800"
                )}
              >
                <item.icon size={16} className={activeTab === item.id ? "text-gold-600 dark:text-gold-500" : ""} />
                <span className="text-[9px] font-bold uppercase tracking-tighter text-center leading-[1.1]">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-x-hidden pt-20 md:pt-8 pb-24 md:pb-8 md:pl-72 w-full max-w-7xl mx-auto">
          {/* POPUP AD (Runs its own 5s timer) */}
          <AdSlot variant="popup" setActiveTab={setActiveTab} />

          {/* TOP AD SLOT */}
          <AdSlot variant="top" setActiveTab={setActiveTab} />
          
          <main className="flex-1 relative flex flex-col pt-4 pb-20 md:pb-8 md:pt-8 md:px-8 w-full">
          <AnimatePresence mode="wait">
            <Suspense fallback={<NavLoading />}>
              {activeTab === 'calendar' && (
                <motion.div className="flex-1 flex flex-col" key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Calendar setTab={setActiveTab} />
                </motion.div>
              )}
              {activeTab === 'rajah' && (
                <motion.div className="flex-1 flex flex-col" key="rajah" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <RajahLibrary onBack={() => setActiveTab('calendar')} />
                </motion.div>
              )}
              {activeTab === 'weton' && (
                <motion.div className="flex-1 flex flex-col" key="weton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <WetonCalc />
                </motion.div>
              )}
              {activeTab === 'jodoh' && (
                <motion.div className="flex-1 flex flex-col" key="jodoh" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <WetonJodoh />
                </motion.div>
              )}
              {activeTab === 'ai' && (
                <motion.div className="flex-1 flex flex-col" key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <KonsultasiAI />
                </motion.div>
              )}
              {activeTab === 'kompas' && (
                <motion.div className="flex-1 flex flex-col" key="kompas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FortuneCompass />
                </motion.div>
              )}
              {activeTab === 'cerita' && (
                <motion.div className="flex-1 flex flex-col" key="cerita" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MysticalStories />
                </motion.div>
              )}
              {activeTab === 'aksara' && (
                <motion.div className="flex-1 flex flex-col" key="aksara" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AksaraConverter />
                </motion.div>
              )}
              {activeTab === 'mimpi' && (
                <motion.div className="flex-1 flex flex-col" key="mimpi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <TafsirMimpi />
                </motion.div>
              )}
              {activeTab === 'kedutan' && (
                <motion.div className="flex-1 flex flex-col" key="kedutan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <KedutanFirasat setActiveTab={setActiveTab} />
                </motion.div>
              )}
              {activeTab === 'hilang' && (
                <motion.div className="flex-1 flex flex-col" key="hilang" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <BarangHilang />
                </motion.div>
              )}
              {activeTab === 'katuranggan' && (
                <motion.div className="flex-1 flex flex-col" key="katuranggan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Katuranggan />
                </motion.div>
              )}
              {activeTab === 'rejeki' && (
                <motion.div className="flex-1 flex flex-col" key="rejeki" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ArahRejeki setActiveTab={setActiveTab} />
                </motion.div>
              )}
              { activeTab === 'halangan' && (
                <motion.div className="flex-1 flex flex-col" key="halangan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PrimbonHalangan setActiveTab={setActiveTab} />
                </motion.div>
              )}
              {activeTab === 'lindu' && (
                <motion.div className="flex-1 flex flex-col" key="lindu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PrimbonLindu setActiveTab={setActiveTab} />
                </motion.div>
              )}
              {activeTab === 'telinga' && (
                <motion.div className="flex-1 flex flex-col" key="telinga" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <TelingaBerdenging setActiveTab={setActiveTab} />
                </motion.div>
              )}
              {activeTab === 'warnapasaran' && (
                <motion.div className="flex-1 flex flex-col" key="warnapasaran" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ArahWarnaPasaran setActiveTab={setActiveTab} />
                </motion.div>
              )}
              {activeTab === 'about' && <About />}
              {activeTab === 'privacy' && <PrivacyPolicy />}
              {activeTab === 'terms' && <TermsOfService />}
              {activeTab === 'pasangiklan' && (
                <motion.div className="flex-1 flex flex-col" key="pasangiklan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PasangIklan />
                </motion.div>
              )}
            </Suspense>
          </AnimatePresence>
          <AdSlot setActiveTab={setActiveTab} />
          <Footer 
            setTab={setActiveTab} 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
          />
        </main>
        
        {/* MOBILE BOTTOM NAV */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 pb-[env(safe-area-inset-bottom)] z-50 transition-colors">
          <div className="max-w-md mx-auto px-2 sm:px-6 h-16 flex justify-between items-center bg-transparent">
            {[
              { id: 'calendar', label: 'Kalender', icon: CalendarDays },
              { id: 'weton', label: 'Wetonku', icon: BookOpen },
              { id: 'jodoh', label: 'Jodoh', icon: Heart },
              { id: 'mimpi', label: 'Mimpi', icon: CloudMoon },
              { id: 'ai', label: 'AI Sesepuh', icon: MessageSquare },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={cn("flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors px-1", activeTab === item.id ? "text-gold-500" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-300")}>
                <item.icon size={18} className={activeTab === item.id ? "drop-shadow-[0_0_8px_rgba(212,163,115,0.4)]" : ""} />
                <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioPage() {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('studio_beta_unlocked') === 'true' || 
           new URLSearchParams(window.location.search).get('beta') === 'true';
  });
  const [clickCount, setClickCount] = useState(0);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setShowCodeInput(true);
      setClickCount(0);
    }
  };

  const verifyCode = async () => {
    try {
      const response = await fetch("/api/verify-studio-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accessCode })
      });
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (Status: ${response.status}).`);
      }

      const data = await response.json();
      
      if (data.success) {
        setIsUnlocked(true);
        localStorage.setItem('studio_beta_unlocked', 'true');
        localStorage.setItem('studio_access_token', data.token);
        setShowCodeInput(false);
      } else {
        alert(`Kode akses salah. (Pesan: ${data.error || 'Invalid'})`);
        setAccessCode("");
      }
    } catch (err) {
      alert(`Kendala akses: ${err instanceof Error ? err.message : 'Unknown Error'}`);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/5 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 space-y-8 max-w-md"
        >
          <button 
            onClick={handleLogoClick}
            className="w-24 h-24 bg-stone-900 dark:bg-gold-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-gold-500/20 active:scale-95 transition-transform"
          >
            <Zap size={40} className="text-white animate-pulse" />
          </button>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-stone-900 dark:text-stone-100 italic tracking-tighter">
              AI Studio <span className="text-gold-500">Coming Soon</span>
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Kami sedang menyiapkan studio kreatif berbasis kecerdasan buatan tingkat tinggi untuk membantu imajinasi Anda menjadi nyata.
            </p>
          </div>

          <div className="pt-8">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-stone-300 hover:bg-stone-50 transition-all mx-auto"
            >
              <ArrowLeft size={16} /> Kembali ke Beranda
            </button>
          </div>
        </motion.div>

        {/* Hidden Password Dialog */}
        <AnimatePresence>
          {showCodeInput && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-stone-950/90 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] w-full max-w-sm space-y-6 shadow-2xl"
              >
                <div className="text-center space-y-2">
                  <h3 className="font-black text-xl italic dark:text-white">Beta Access</h3>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Masukkan Kode Akses</p>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && verifyCode()}
                    placeholder="Kode Rahasia..."
                    className="w-full bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-6 py-4 text-center text-lg font-black tracking-[0.5em] focus:ring-2 focus:ring-gold-500 outline-none pr-14"
                    autoFocus
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-gold-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowCodeInput(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Batal</button>
                  <button onClick={verifyCode} className="flex-1 py-4 bg-gold-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Buka Akses</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-10 left-0 right-0 text-[10px] font-bold text-stone-300 dark:text-stone-800 uppercase tracking-[0.5em]">
          Beta Version 1.0
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Kembali ke Primbon</span>
          </button>
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-gold-500" />
            <span className="font-black text-sm tracking-tighter uppercase dark:text-white">AI Image Studio</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>
      <main className="flex-1">
        <Suspense fallback={<NavLoading />}>
          <ImageGenerator />
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PrimbonApp />} />
      <Route path="/studio" element={<StudioPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
