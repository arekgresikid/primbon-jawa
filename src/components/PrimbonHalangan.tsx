import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getFirasatHaidHari, getFirasatHaidTanggal, getFirasatHaidWaktu } from '../lib/jawaMath';
import { Sparkles, Calendar, Clock, Sun, Moon, Info, MessageCircle, HeartPulse } from 'lucide-react';
import { cn } from '../lib/utils';

export function PrimbonHalangan({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
  const [selectedHari, setSelectedHari] = useState<string>('');
  const [selectedTanggal, setSelectedTanggal] = useState<number | ''>('');
  const [selectedWaktu, setSelectedWaktu] = useState<number | ''>('');

  const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const waktuList = Array.from({ length: 24 }, (_, i) => i);
  const tanggalList = Array.from({ length: 31 }, (_, i) => i + 1);

  const hasilHari = selectedHari ? getFirasatHaidHari(selectedHari) : null;
  const hasilTanggal = typeof selectedTanggal === 'number' ? getFirasatHaidTanggal(selectedTanggal) : null;
  const hasilWaktu = typeof selectedWaktu === 'number' ? getFirasatHaidWaktu(selectedWaktu) : null;

  const handleAskAI = () => {
    let question = `Sesepuh, saya mengalami haid pertama pada hari ${selectedHari || '...'}, tanggal ${selectedTanggal || '...'}, jam ${selectedWaktu !== '' ? selectedWaktu + ':00' : '...'}. `;
    question += `Makna primbonnya adalah: Hari (${hasilHari || '...'}), Tanggal (${hasilTanggal || '...'}), Waktu (${hasilWaktu || '...'}). `;
    question += `Bagaimana seharusnya saya menyikapi firasat ini? Mohon nasehatnya.`;
    
    localStorage.setItem('primbon_ai_pending_question', question);
    setActiveTab('ai');
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
      <div className="mb-10 text-center space-y-3">
        <h2 className="text-3xl font-serif font-black text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
          <HeartPulse size={28} className="text-gold-500" />
          Firasat Haid (Halangan)
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
          "Dalam tradisi Primbon, waktu awal datangnya bulan (haid) dapat membawa pesan dan firasat tersendiri."
        </p>
      </div>

      <div className="space-y-6">
        {/* Form Inputs */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 space-y-6 shadow-sm">
          {/* Hari Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
              <Sun size={14} className="text-gold-500" /> Hari Kedatangan Haid
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {hariList.map(hari => (
                <button
                  key={hari}
                  onClick={() => setSelectedHari(hari)}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all border",
                    selectedHari === hari
                      ? "bg-gold-500 border-gold-400 text-white shadow-md"
                      : "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-gold-300"
                  )}
                >
                  {hari.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Tanggal Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
              <Calendar size={14} className="text-gold-500" /> Tanggal Kejadian
            </label>
            <select 
              value={selectedTanggal}
              onChange={(e) => setSelectedTanggal(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-stone-800 dark:text-stone-200 font-medium outline-none focus:ring-2 focus:ring-gold-500/20"
            >
              <option value="">-- Pilih Tanggal --</option>
              {tanggalList.map(tgl => (
                <option key={tgl} value={tgl}>Tanggal {tgl}</option>
              ))}
            </select>
          </div>

          {/* Jam Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
              <Clock size={14} className="text-gold-500" /> Perkiraan Jam (Waktu)
            </label>
            <select 
              value={selectedWaktu}
              onChange={(e) => setSelectedWaktu(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-stone-800 dark:text-stone-200 font-medium outline-none focus:ring-2 focus:ring-gold-500/20"
            >
              <option value="">-- Pilih Rentang Jam --</option>
              {waktuList.map(jam => (
                <option key={jam} value={jam}>
                  {jam.toString().padStart(2, '0')}:00 - {(jam + 1).toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {(hasilHari || hasilTanggal || hasilWaktu) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {hasilHari && (
                <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 hover:border-gold-300 transition-colors">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center shrink-0">
                      <Sun size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Firasat Hari {selectedHari}</h4>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-200 italic">"{hasilHari}"</p>
                    </div>
                  </div>
                </div>
              )}

              {hasilTanggal && (
                <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 hover:border-gold-300 transition-colors">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Firasat Tanggal {selectedTanggal}</h4>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-200 italic">"{hasilTanggal}"</p>
                    </div>
                  </div>
                </div>
              )}

              {hasilWaktu && (
                <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 hover:border-gold-300 transition-colors">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Firasat Waktu ({selectedWaktu}:00 - {Number(selectedWaktu) + 1}:00)</h4>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-200 italic">"{hasilWaktu}"</p>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={handleAskAI}
                className="w-full flex items-center justify-center gap-2 py-4 mt-4 bg-gold-500 text-white rounded-xl text-sm font-bold hover:bg-gold-600 transition-all active:scale-95 shadow-lg shadow-gold-500/20 uppercase tracking-widest"
              >
                <MessageCircle size={18} /> Tanya Sesepuh AI
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Note */}
      <div className="mt-12 p-6 bg-stone-900 dark:bg-stone-950 rounded-3xl text-stone-300 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
        <h4 className="text-gold-500 font-bold mb-2 uppercase tracking-widest text-xs flex items-center gap-2">
          <Info size={14} /> Catatan Medis & Tradisi
        </h4>
        <p className="text-xs leading-relaxed italic relative z-10">
          "Ramalan ini merupakan kekayaan tradisi Nusantara. Namun ingatlah, haid adalah proses medis alami. Jika terjadi hal yang tidak wajar seperti nyeri hebat atau siklus yang sangat tidak teratur, sangat disarankan untuk berkonsultasi secara medis."
        </p>
      </div>
    </div>
  );
}
