import React, { useState } from 'react';
import { RefreshCw, ALargeSmall } from 'lucide-react';
import { jawiToLatin, latinToJawi } from '../lib/transliterate';

export function AksaraConverter() {
  const [latinText, setLatinText] = useState('Sugeng Enjing');
  const [aksaraText, setAksaraText] = useState(latinToJawi('Sugeng Enjing'));
  
  // To avoid circular updates, we track which side was last active
  const [activeSide, setActiveSide] = useState<'latin'|'aksara'>('latin');

  const handleLatinChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setActiveSide('latin');
    const val = e.target.value;
    setLatinText(val);
    setAksaraText(latinToJawi(val));
  };

  const handleAksaraChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setActiveSide('aksara');
    const val = e.target.value;
    setAksaraText(val);
    setLatinText(jawiToLatin(val));
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
       <div className="mb-8 text-center space-y-2">
         <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
           <ALargeSmall size={28} className="text-gold-500" />
           Konverter Arab Jawi (Pegon)
         </h2>
         <p className="text-stone-500 dark:text-stone-400 text-sm">Terjemahkan tulisan Latin ke huruf Arab Jawi / Pegon secara otomatis.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 md:p-6 rounded-2xl relative overflow-hidden shadow-sm">
          
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 items-center justify-center text-gold-500 z-10 shadow-sm">
            <RefreshCw size={20} />
          </div>

          <div className="flex flex-col space-y-3 w-full min-w-0">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest pl-1">Teks Latin</label>
              {activeSide === 'latin' && <span className="text-[10px] text-green-600 dark:text-green-500/80 px-2 py-0.5 rounded-full bg-green-500/10">Active</span>}
            </div>
            <textarea 
              value={latinText}
              onChange={handleLatinChange}
              placeholder="Ketik bahasa nusantara di sini..."
              className="w-full flex-1 min-h-[250px] bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-4 text-stone-800 dark:text-stone-200 resize-none outline-none focus:ring-1 focus:ring-gold-500 transition-shadow leading-relaxed"
            />
          </div>

          <div className="flex flex-col space-y-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-200 dark:border-stone-800 w-full min-w-0">
             <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest pl-1">Arab Jawi / Pegon</label>
              {activeSide === 'aksara' && <span className="text-[10px] text-green-600 dark:text-green-500/80 px-2 py-0.5 rounded-full bg-green-500/10">Active</span>}
            </div>
            <textarea 
              dir="rtl"
              value={aksaraText}
              onChange={handleAksaraChange}
              placeholder="كتيق..."
              className="w-full flex-1 min-h-[250px] bg-stone-50 dark:bg-[#25221e] border-l-[4px] border-y border-r border border-gold-300 dark:border-gold-600/30 border-r-gold-500 md:border-l-gold-500 md:border-r-gold-300 dark:md:border-r-gold-600/30 rounded-xl p-4 text-gold-600 dark:text-gold-400 text-3xl font-medium tracking-wide leading-relaxed resize-none outline-none focus:ring-1 focus:ring-gold-500/50 transition-shadow"
            />
          </div>
       </div>
    </div>
  );
}
