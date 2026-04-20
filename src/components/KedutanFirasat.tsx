import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getKedutanList } from '../lib/jawaMath';
import { Search, Sparkles, Filter, ChevronRight, Zap, X, Share2, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function KedutanFirasat({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleAskAI = (item: any) => {
    const question = `Sesepuh, saya mengalami kedutan di ${item.point}. Katanya maknanya adalah "${item.meaning}". Bagaimana seharusnya saya menyikapi isyarat ghaib ini? Mohon nasehatnya.`;
    localStorage.setItem('primbon_ai_pending_question', question);
    setActiveTab('ai');
  };
  
  const allKedutan = getKedutanList();
  const categories = ['Semua', ...new Set(allKedutan.map(k => k.category))];
  
  const filtered = allKedutan.filter(k => {
    const matchesSearch = k.point.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          k.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || k.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
      <div className="mb-10 text-center space-y-3">
        <h2 className="text-3xl font-black text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
          <Sparkles size={28} className="text-gold-500" />
          Isyarat Kedutan & Firasat
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
          "Tubuh manusia adalah antena semesta. Getaran kecil (kedutan) seringkali membawa pesan dari dimensi ghaib."
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-gold-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Cari bagian tubuh atau makna... (misal: Mata, Rejeki)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-stone-800 dark:text-stone-200 outline-none focus:ring-2 focus:ring-gold-500/20 transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border",
                activeCategory === cat 
                  ? "bg-gold-500 border-gold-400 text-white shadow-md scale-105" 
                  : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:border-gold-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <motion.article
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                key={item.point}
                onClick={() => setSelectedItem(item)}
                className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 hover:border-gold-300 dark:hover:border-gold-600/50 transition-all hover:shadow-md cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center border border-stone-100 dark:border-stone-700 text-gold-600 shrink-0 group-hover:scale-110 transition-transform">
                    <Zap size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-gold-600 transition-colors uppercase tracking-tight text-sm">
                        Kedutan {item.point}
                      </h4>
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest bg-stone-50 dark:bg-stone-800 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-stone-300 group-hover:text-gold-500 self-center" />
                </div>
              </motion.article>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-stone-50/50 dark:bg-stone-900/50 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800"
            >
              <div className="text-stone-300 dark:text-stone-700 mb-4 flex justify-center"><Search size={48} /></div>
              <p className="text-stone-500 dark:text-stone-400 font-medium">Isyarat tersebut belum tercatat dalam kitab kami.</p>
              <p className="text-[10px] uppercase font-bold text-stone-400 mt-2">Coba kata kunci lain atau bagian tubuh yang lebih umum</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800"
            >
              <div className="p-6 text-center border-b border-stone-100 dark:border-stone-800">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute right-4 top-4 p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-600">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 uppercase tracking-tight">Isyarat {selectedItem.point}</h3>
                <span className="text-[10px] font-bold text-gold-600 bg-gold-50 dark:bg-gold-500/10 px-3 py-1 rounded-full uppercase tracking-widest mt-2 inline-block">
                  {selectedItem.category}
                </span>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Makna Primbon</h4>
                  <p className="text-lg text-stone-800 dark:text-stone-200 font-medium leading-relaxed italic">
                    "{selectedItem.meaning}"
                  </p>
                </div>

                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-gold-500" /> Nasehat Bijak
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    Setiap isyarat adalah pengingat untuk tetap mawas diri. Jangan biarkan kabar baik membuat lalai, jangan biarkan isyarat buruk memutus harapan.
                  </p>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => handleAskAI(selectedItem)}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gold-500 text-white rounded-xl text-sm font-bold hover:bg-gold-600 transition-all active:scale-95 shadow-lg shadow-gold-500/20 uppercase tracking-widest"
                  >
                    <MessageCircle size={18} /> Tanya Sesepuh AI
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Glossary Note */}
      <div className="mt-12 p-6 bg-stone-900 dark:bg-stone-950 rounded-3xl text-stone-300 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
        <h4 className="text-gold-500 font-bold mb-2 uppercase tracking-widest text-xs">Petuah Sesepuh</h4>
        <p className="text-xs leading-relaxed italic relative z-10">
          "Kedutan hanyalah salah satu cara alam berkomunikasi. Jika isyaratnya buruk, berdoalah dan bersedekah. Jika isyaratnya baik, bersyukurlah dan tetaplah rendah hati."
        </p>
      </div>
    </div>
  );
}
