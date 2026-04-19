import React, { useState } from 'react';
import { RefreshCw, ALargeSmall, Copy, Check, Type } from 'lucide-react';
import { jawiToLatin, latinToJawi, latinToHanacaraka, hanacarakaToLatin } from '../lib/transliterate';
import { cn } from '../lib/utils';

export function AksaraConverter() {
  const [mode, setMode] = useState<'jawi' | 'hanacaraka'>('hanacaraka');
  const [latinText, setLatinText] = useState('tahu bulat di goreng dadakan limaratusan');
  const [aksaraText, setAksaraText] = useState(latinToHanacaraka('tahu bulat di goreng dadakan limaratusan'));
  const [activeSide, setActiveSide] = useState<'latin'|'aksara'>('latin');
  const [copied, setCopied] = useState(false);

  const handleLatinChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setActiveSide('latin');
    const val = e.target.value;
    setLatinText(val);
    setAksaraText(mode === 'jawi' ? latinToJawi(val) : latinToHanacaraka(val));
  };

  const handleAksaraChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setActiveSide('aksara');
    const val = e.target.value;
    setAksaraText(val);
    setLatinText(mode === 'jawi' ? jawiToLatin(val) : hanacarakaToLatin(val));
  };

  const toggleMode = (newMode: 'jawi' | 'hanacaraka') => {
    setMode(newMode);
    setAksaraText(newMode === 'jawi' ? latinToJawi(latinText) : latinToHanacaraka(latinText));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aksaraText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 pt-2 sm:pt-4">
        <div className="mb-4 text-center space-y-4">
          <div className="inline-flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm">
            <button 
              onClick={() => toggleMode('hanacaraka')}
              className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", mode === 'hanacaraka' ? "bg-gold-500 text-white shadow-sm" : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")}
            >
              Aksara Jawa
            </button>
            <button 
              onClick={() => toggleMode('jawi')}
              className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", mode === 'jawi' ? "bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300")}
            >
              Arab Jawi
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
              <Type size={32} className="text-gold-500" />
              Konverter Aksara
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm italic font-medium">
              Transformasi teks Latin ke {mode === 'jawi' ? 'Arab Jawi (Pegon)' : 'Aksara Jawa (Hanacaraka)'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-4 md:p-6 rounded-3xl relative overflow-hidden shadow-2xl shadow-gold-900/5">
           
           <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 items-center justify-center text-gold-500 z-10 shadow-lg">
             <RefreshCw size={22} className={cn("transition-transform duration-500", activeSide === 'aksara' ? "rotate-180" : "")} />
           </div>

           <div className="flex flex-col space-y-3 w-full min-w-0">
             <div className="flex items-center justify-between px-1">
               <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em]">Teks Latin</label>
               {activeSide === 'latin' && <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />}
             </div>
             <textarea 
               value={latinText}
               onChange={handleLatinChange}
               placeholder="Ketik di sini..."
               className="w-full flex-1 min-h-[300px] bg-stone-50/50 dark:bg-stone-950/50 border border-stone-100 dark:border-stone-800 rounded-2xl p-5 text-stone-800 dark:text-stone-200 resize-none outline-none focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/5 transition-all leading-relaxed font-medium"
             />
           </div>

           <div className="flex flex-col space-y-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800 w-full min-w-0">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em]">Hasil {mode === 'jawi' ? 'Pegon' : 'Aksara'}</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className={cn(
                      "p-1.5 rounded-lg transition-all",
                      copied ? "bg-green-500 text-white" : "text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-gold-500"
                    )}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  {activeSide === 'aksara' && <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />}
                </div>
             </div>
             <textarea 
               dir={mode === 'jawi' ? 'rtl' : 'ltr'}
               value={aksaraText}
               onChange={handleAksaraChange}
               className={cn(
                 "w-full flex-1 min-h-[300px] bg-white dark:bg-stone-950 border border-gold-100 dark:border-gold-900/20 rounded-2xl p-5 text-gold-600 dark:text-gold-400 leading-relaxed font-medium transition-all shadow-sm outline-none focus:ring-4 focus:ring-gold-500/5",
                 mode === 'hanacaraka' ? "text-4xl text-center" : "text-3xl"
               )}
             />
           </div>
        </div>
    </div>
  );
}
