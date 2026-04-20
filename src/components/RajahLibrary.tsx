import React, { useState } from 'react';
import { Copy, Check, Sparkles, Shield, Compass, ArrowLeft } from 'lucide-react';
import { rajahs } from '../data/rajahData';
import { cn } from '../lib/utils';

export function RajahLibrary({ onBack }: { onBack?: () => void }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-32 px-4 sm:px-6 pt-4 space-y-8">
      {/* Header with Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 hover:text-gold-500 transition-colors group mb-2"
        >
          <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 group-hover:bg-gold-500/10">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">Kembali ke Dashboard</span>
        </button>
      )}

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 rounded-full border border-gold-500/20">
          <Sparkles size={12} className="text-gold-600" />
          <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">Pustaka Rajah & Jimat</span>
        </div>
        <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100 italic">
          Koleksi Rajah Tradisional
        </h3>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-lg mx-auto">
          Kumpulan pola huruf sakral dan wafaq berbasis teks yang digunakan dalam kearifan lokal Nusantara untuk berbagai keperluan spiritual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rajahs.map((rajah) => (
          <div 
            key={rajah.id}
            className="group relative bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800 p-6 shadow-sm hover:shadow-xl hover:shadow-gold-900/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Shield size={120} />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-stone-800 dark:text-stone-100 group-hover:text-gold-600 transition-colors">
                    {rajah.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Compass size={10} />
                    Fungsi: {rajah.usage}
                  </p>
                </div>
                <button 
                  onClick={() => copyToClipboard(rajah.pattern, rajah.id)}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    copiedId === rajah.id 
                      ? "bg-green-500 text-white" 
                      : "bg-stone-50 dark:bg-stone-800 text-stone-400 hover:text-gold-600"
                  )}
                >
                  {copiedId === rajah.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              <div className="relative">
                <pre className={cn(
                  "w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800/50 rounded-2xl p-6 text-stone-600 dark:text-stone-400 font-mono text-sm leading-relaxed whitespace-pre group-hover:border-gold-500/30 transition-all text-center",
                  rajah.id === 'kalacakra-text' ? "text-xl py-8" : ""
                )}>
                  {rajah.pattern}
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-50/50 dark:from-stone-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed italic">
                {rajah.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">
          Gunakan dengan bijak sesuai niat yang tulus
        </p>
      </div>
    </div>
  );
}
