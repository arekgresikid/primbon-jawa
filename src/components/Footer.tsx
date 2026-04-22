import React from 'react';
import { Github, Globe, Mail, Sparkles, Sun, Moon } from 'lucide-react';

interface FooterProps {
  setTab?: (tab: any) => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (isDark: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ setTab, isDarkMode, setIsDarkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto py-16 px-6 relative overflow-hidden transition-colors border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/20">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <Sparkles size={300} strokeWidth={0.5} />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
        
        {/* Top Section: Branding & Tagline */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <span className="text-gold-500 text-2xl animate-pulse">❖</span>
            <h2 className="text-stone-900 dark:text-stone-100 font-black tracking-[0.2em] text-xl uppercase text-center">
              Primbon & Kalender Jawa
            </h2>
            <span className="text-gold-500 text-2xl animate-pulse">❖</span>
          </div>
          
          <p className="text-stone-400 dark:text-stone-500 text-[10px] tracking-[0.5em] uppercase font-black italic text-center max-w-xs leading-loose">
            — Maca Sasmita, Ngundhuh Rahayu —
          </p>

          {/* Dark Mode Toggle Moved Here */}
          {setIsDarkMode && (
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="mt-4 flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-gold-500 transition-all shadow-sm group"
            >
              {isDarkMode ? <Sun size={16} className="text-gold-500" /> : <Moon size={16} className="text-indigo-400" />}
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Mode {isDarkMode ? 'Terang' : 'Gelap'}
              </span>
            </button>
          )}
        </div>

        {/* Bottom Section: Policies, Socials & Copyright */}
        <div className="w-full pt-10 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-8 items-center text-center">
          
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
            <a 
              href="https://ariftirtana.my.id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gold-500 transition-all flex items-center gap-2"
            >
              <Globe size={14} /> Portfolio
            </a>
            <a 
              href="https://github.com/arekgresikid" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gold-500 transition-all flex items-center gap-2"
            >
              <Github size={14} /> GitHub
            </a>
            <a 
              href="mailto:arekgresikid@gmail.com" 
              className="hover:text-gold-500 transition-all flex items-center gap-2"
            >
              <Mail size={14} /> Kontak
            </a>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-800">|</span>
            <button 
              onClick={() => setTab?.('privacy')}
              className="hover:text-gold-500 transition-colors"
            >
              Privasi
            </button>
            <button 
              onClick={() => setTab?.('terms')}
              className="hover:text-gold-500 transition-colors"
            >
              Syarat
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-stone-400 dark:text-stone-500 text-[10px] font-bold uppercase tracking-widest opacity-60">
            <div className="flex items-center gap-1.5">
              <span>© {currentYear}</span>
              <span className="text-gold-500/30 text-lg">•</span>
              <span className="opacity-80 font-medium">Design By</span>
              <a 
                href="https://ariftirtana.my.id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-500 dark:text-stone-400 hover:text-gold-500 transition-all font-black"
              >
                ArekGresikID
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
