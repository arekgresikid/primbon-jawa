import React, { useState, useEffect } from 'react';
import { Megaphone, Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdSlotProps {
  setActiveTab?: (tab: any) => void;
  variant?: 'top' | 'side' | 'bottom' | 'popup';
}

export const AdSlot: React.FC<AdSlotProps> = ({ setActiveTab, variant = 'bottom' }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (variant === 'popup') {
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
      }, 5000); // Popup appears after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [variant]);

  if (variant === 'popup') {
    return (
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              onClick={() => setIsPopupOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative z-10 w-full max-w-[90vw] md:max-w-4xl lg:max-w-5xl bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800"
            >
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40 text-white transition-colors z-20 backdrop-blur-md"
              >
                <X size={20} />
              </button>
              
              {/* Dummy Image Placeholder */}
              <div className="w-full h-48 md:h-80 lg:h-[28rem] bg-stone-200 dark:bg-stone-800 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <Megaphone size={64} className="text-stone-400 dark:text-stone-600 opacity-30 group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute bottom-6 left-6 z-20 text-white font-black text-2xl md:text-5xl tracking-tight drop-shadow-lg">SPACE IKLAN ANDA</span>
                <span className="absolute top-6 left-6 z-20 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-lg border border-white/10">Sponsor Utama</span>
              </div>
              
              <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <h3 className="font-black text-xl md:text-3xl text-stone-900 dark:text-stone-100 mb-3 md:mb-4">Penawaran Eksklusif!</h3>
                  <p className="text-sm md:text-lg text-stone-500 dark:text-stone-400 leading-relaxed">
                    Ini adalah slot Popup Ad. Iklan Anda akan mendominasi layar dan menangkap perhatian penuh dari pengunjung situs sebelum mereka beralih membaca konten.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsPopupOpen(false);
                    setActiveTab?.('pasangiklan');
                  }}
                  className="w-full md:w-auto px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/30 flex-shrink-0"
                >
                  Pasang Iklan Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  if (variant === 'top') {
    return (
      <div className="w-full px-4 pt-4 pb-2 relative z-10">
        <button 
          onClick={() => setActiveTab?.('pasangiklan')}
          className="block w-full text-left"
        >
          <div className="w-full bg-stone-100/80 dark:bg-stone-900/80 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl flex items-center justify-between p-3 sm:px-6 hover:border-gold-500 hover:bg-gold-500/5 transition-all group cursor-pointer shadow-sm">
            <div className="flex items-center gap-3">
              <Megaphone size={16} className="text-stone-400 group-hover:text-gold-500 group-hover:animate-pulse transition-colors" />
              <div>
                <span className="font-bold text-[10px] sm:text-xs tracking-wider uppercase text-stone-600 dark:text-stone-300 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                  Top Banner / Space Iklan
                </span>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:block">
                  Klik di sini untuk info pemasangan iklan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-stone-500 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors uppercase tracking-wider bg-white dark:bg-stone-950 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800">
              <Mail size={12} /> Info
            </div>
          </div>
        </button>
      </div>
    );
  }

  if (variant === 'side') {
    return (
      <div className="w-full mt-4 mb-2 relative z-10">
        <button 
          onClick={() => setActiveTab?.('pasangiklan')}
          className="block w-full text-left"
        >
          <div className="w-full aspect-square bg-stone-100 dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl flex flex-col items-center justify-center text-center p-4 hover:border-gold-500 hover:bg-gold-500/5 transition-all group cursor-pointer shadow-sm">
            <Megaphone size={28} className="text-stone-400 group-hover:text-gold-500 group-hover:animate-pulse transition-colors mb-3" />
            <span className="font-black text-xs tracking-widest uppercase text-stone-600 dark:text-stone-300 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
              Sidebar Ad
            </span>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium leading-relaxed mt-2 max-w-[150px]">
              Tingkatkan visibilitas brand Anda
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-stone-500 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors uppercase tracking-widest bg-white dark:bg-stone-950 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800">
              Pasang Iklan
            </div>
          </div>
        </button>
      </div>
    );
  }

  // default 'bottom'
  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-10 relative z-10">
      <button 
        onClick={() => setActiveTab?.('pasangiklan')}
        className="block w-full text-left"
      >
        <div className="w-full bg-stone-100 dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl flex flex-col items-center justify-center text-center p-6 sm:p-8 hover:border-gold-500 hover:bg-gold-500/5 transition-all group cursor-pointer shadow-sm">
          <div className="flex items-center gap-3 text-stone-400 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors mb-3">
            <Megaphone size={24} className="group-hover:animate-pulse" />
            <span className="font-black text-sm tracking-widest uppercase">Space Iklan Tersedia</span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium leading-relaxed max-w-md">
            Jangkau ribuan pelestari budaya setiap harinya. Hubungi kami untuk memasang banner atau promosi bisnis Anda di sini.
          </p>
          <div className="mt-5 flex items-center gap-2 text-[10px] font-bold text-stone-500 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors uppercase tracking-widest bg-white dark:bg-stone-950 px-4 py-2 rounded-full border border-stone-200 dark:border-stone-800 group-hover:border-gold-500/30">
            <Mail size={14} /> Hubungi Admin
          </div>
        </div>
      </button>
    </div>
  );
};
