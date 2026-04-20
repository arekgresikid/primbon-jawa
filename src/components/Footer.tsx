import React from 'react';
import { Github, Globe, Mail, Sparkles } from 'lucide-react';

interface FooterProps {
  setTab?: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ setTab }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto py-16 px-6 relative overflow-hidden transition-colors border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/20">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <Sparkles size={300} strokeWidth={0.5} />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
        
        {/* Top Section: Branding & Tagline */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-stone-900 dark:text-stone-100 font-black tracking-tight text-lg">
            <span className="text-gold-500">❖</span>
            PRIMBON & KALENDER JAWA
            <span className="text-gold-500">❖</span>
          </div>
          <p className="text-stone-400 dark:text-stone-500 text-[10px] tracking-[0.4em] uppercase font-bold italic">
            — Maca Sasmita, Ngundhuh Rahayu —
          </p>
        </div>

        {/* Middle Section: Social Media & Links */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-stone-500 dark:text-stone-400">
          <a 
            href="https://ariftirtana.my.id" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-gold-500 transition-all duration-300 group"
          >
            <Globe size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Portfolio</span>
          </a>
          <a 
            href="https://github.com/arekgresikid" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-gold-500 transition-all duration-300 group"
          >
            <Github size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">GitHub</span>
          </a>
          <a 
            href="mailto:arekgresikid@gmail.com" 
            className="flex items-center gap-2 hover:text-gold-500 transition-all duration-300 group"
          >
            <Mail size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Kontak</span>
          </a>
        </div>

        {/* Bottom Section: Policies & Copyright */}
        <div className="w-full pt-10 border-t border-stone-200 dark:border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
          
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <button 
              onClick={() => setTab?.('privacy')}
              className="hover:text-gold-500 transition-colors"
            >
              Kebijakan Privasi
            </button>
            <button 
              onClick={() => setTab?.('terms')}
              className="hover:text-gold-500 transition-colors"
            >
              Syarat Layanan
            </button>
          </div>

          <div className="text-stone-400 dark:text-stone-500 text-[10px] font-medium flex items-center gap-1.5">
            <span>© {currentYear}</span>
            <span className="text-gold-500/30 text-lg">•</span>
            <span className="opacity-80">Design By</span>
            <a 
              href="https://ariftirtana.my.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-stone-500 dark:text-stone-400 hover:text-gold-500 transition-all duration-300 font-bold"
            >
              ArekGresikID
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};
