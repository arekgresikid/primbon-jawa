import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

export const SplashCurtain: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    // Check if the user has already opened the curtain in this session
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('primbon-curtain-opened') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    sessionStorage.setItem('primbon-curtain-opened', 'true');
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-8 text-center select-none bg-[#0d0d0d]"
        >
          {/* Top Header */}
          <div className="w-full flex justify-between items-center opacity-60 pt-2">
            <span className="text-[#ecd06f] font-serif text-xs tracking-widest uppercase font-semibold">
              WARISAN LELUHUR
            </span>
            <div className="w-12 sm:w-16 h-[1px] bg-[#ecd06f]"></div>
          </div>

          {/* Middle Content */}
          <div className="flex flex-col items-center space-y-6 sm:space-y-8 my-auto px-4">
            {/* Logo Text / Title */}
            <div className="space-y-2">
              <h1 className="text-[#ecd06f] font-serif text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase drop-shadow-lg">
                Primbon Jawa
              </h1>
              <a 
                href="https://jawidigital.my.id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-white/80 hover:text-white font-sans text-sm sm:text-lg font-semibold tracking-[0.2em] uppercase transition-colors"
              >
                jawidigital.my.id
              </a>
            </div>

            {/* Gold Geometric Symbol */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 text-[#ecd06f] opacity-80 animate-pulse my-2">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                <path d="M50 0 C45 25, 25 45, 0 50 C25 55, 45 75, 50 100 C55 75, 75 55, 100 50 C75 45, 55 25, 50 0 Z" />
                <circle cx="50" cy="50" r="12" fill="none" stroke="#ecd06f" strokeWidth="2" />
              </svg>
            </div>

            <h2 className="text-[#ecd06f]/80 font-serif text-lg sm:text-xl tracking-widest uppercase italic font-light">
              Maca Sasmita, Ngundhuh Rahayu
            </h2>
            <div className="w-16 h-[1px] bg-[#ecd06f]/40"></div>
          </div>

          {/* Bottom Row */}
          <div className="w-full flex justify-between items-center pb-12 sm:pb-4 relative z-50">
            <div className="text-[#ecd06f]/40 text-xs tracking-wider uppercase font-medium">
              Est. 2026
            </div>

            <button
              onClick={handleOpen}
              className="group flex items-center space-x-2 sm:space-x-3 bg-[#ecd06f] hover:bg-[#fdf8e2] border border-[#ecd06f] px-4 py-2.5 sm:px-5 sm:py-3 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(236,208,111,0.4)] cursor-pointer focus:outline-none active:scale-95"
            >
              <span className="text-[#0d0d0d] font-sans text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors">
                Buka Primbon
              </span>
              <div className="bg-[#0d0d0d] p-1 sm:p-1.5 rounded-full transition-all duration-300 animate-bounce">
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ecd06f]" strokeWidth={3} />
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
