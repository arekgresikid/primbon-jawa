import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-12 px-4 text-center">
      <div className="max-w-md mx-auto opacity-60">
        <p className="text-stone-400 dark:text-stone-500 text-[9px] tracking-[0.3em] uppercase font-bold mb-3 italic">
          — Maca Sasmita, Ngundhuh Rahayu —
        </p>
        <div className="text-stone-400 dark:text-stone-500 text-[10px] font-medium flex items-center justify-center gap-1.5">
          <span>© {new Date().getFullYear()}</span>
          <span className="text-gold-500/30">•</span>
          <span className="opacity-80">Design By</span>
          <a 
            href="https://ariftirtana.my.id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-stone-500 dark:text-stone-400 hover:text-gold-500 transition-all duration-300 hover:tracking-wider"
          >
            ArekGresikID
          </a>
        </div>
      </div>
    </footer>
  );
};
