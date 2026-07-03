import React, { useState } from 'react';
import { Palette, Compass, ArrowRight, Sparkles, ArrowRightCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PASARAN_DATA: Record<string, { warna: string; arah: string; warnaHex: string; desc: string }> = {
  Pon: {
    warna: 'Kuning',
    arah: 'Barat',
    warnaHex: 'bg-yellow-400',
    desc: 'Gunakan pakaian berwarna Kuning dan arahkan tujuan Anda ke Barat. Hal ini dipercaya dapat mendatangkan kebahagiaan, kelarisan dalam berdagang, dan kelancaran usaha.'
  },
  Wage: {
    warna: 'Hitam',
    arah: 'Utara',
    warnaHex: 'bg-stone-900',
    desc: 'Gunakan pakaian berwarna Hitam dan arahkan tujuan Anda ke Utara. Dipercaya memberikan keteguhan, kemantapan rezeki, serta menolak mara bahaya.'
  },
  Kliwon: {
    warna: 'Bebas / Netral',
    arah: 'Tengah / Netral',
    warnaHex: 'bg-gradient-to-br from-stone-200 to-stone-400',
    desc: 'Pasaran Kliwon merupakan pancer (pusat). Anda bebas mengenakan warna pakaian apa saja dan menuju arah mana saja, selama diiringi dengan niat yang baik dan hati yang bersih.'
  },
  Legi: {
    warna: 'Putih',
    arah: 'Timur',
    warnaHex: 'bg-white border-2 border-stone-200',
    desc: 'Gunakan pakaian berwarna Putih dan arahkan tujuan Anda ke Timur. Melambangkan kesucian dan awal yang baru, sangat baik untuk mencari rezeki agar berkah dan laris.'
  },
  Pahing: {
    warna: 'Merah',
    arah: 'Selatan',
    warnaHex: 'bg-red-500',
    desc: 'Gunakan pakaian berwarna Merah dan arahkan tujuan Anda ke Selatan. Memberikan energi keberanian, semangat tinggi, dan kewibawaan untuk memenangkan persaingan dagang.'
  }
};

export const ArahWarnaPasaran: React.FC<{ setActiveTab?: (tab: any) => void }> = ({ setActiveTab }) => {
  const [pasaran, setPasaran] = useState('Pon');
  const activeData = PASARAN_DATA[pasaran];

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Palette size={32} className="text-gold-600 dark:text-gold-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Warna & Arah Pasaran
        </h2>
        <p className="text-stone-500 text-sm">
          Paduan warna pakaian dan arah keberuntungan berdasarkan Pasaran lahir atau hari saat ini.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Pilih Pasaran:</label>
          <div className="grid grid-cols-5 gap-2">
            {Object.keys(PASARAN_DATA).map((p) => (
              <button
                key={p}
                onClick={() => setPasaran(p)}
                className={`py-3 px-1 rounded-xl text-[10px] font-bold transition-all border ${
                  pasaran === p 
                    ? "bg-gold-500 text-white border-gold-500 shadow-lg shadow-gold-500/20" 
                    : "bg-stone-50 dark:bg-stone-950 text-stone-500 border-stone-200 dark:border-stone-800 hover:border-gold-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden p-6 sm:p-8 bg-stone-50 dark:bg-stone-950/50 rounded-[2rem] border border-stone-100 dark:border-stone-800 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={pasaran}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center space-y-8 relative z-10"
            >
              <div className="flex items-center justify-center gap-8 sm:gap-16 w-full">
                
                {/* Warna Pakaian */}
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl shadow-inner flex items-center justify-center ${activeData.warnaHex}`}>
                    {activeData.warna === 'Kliwon' && <Sparkles size={24} className="text-stone-500" />}
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Warna Pakaian</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{activeData.warna}</span>
                  </div>
                </div>

                <div className="text-stone-300 dark:text-stone-700">
                  <ArrowRight size={24} />
                </div>

                {/* Arah Keberuntungan */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner">
                    <Compass size={28} />
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Arah Rejeki</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{activeData.arah}</span>
                  </div>
                </div>

              </div>

              <div className="w-full h-[1px] bg-stone-200 dark:bg-stone-800 my-4" />

              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed italic max-w-md mx-auto">
                "{activeData.desc}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 bg-gold-500/5 border border-gold-500/10 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-[10px] text-gold-700 dark:text-gold-400 font-medium leading-relaxed flex-1">
          <strong>Makna:</strong> Konsep ini sering digunakan leluhur saat hendak berdagang, mencari pekerjaan, atau melakukan perjalanan penting agar mendapat kemudahan dari Yang Maha Kuasa.
        </p>
        
        {setActiveTab && (
          <button 
            onClick={() => setActiveTab('rejeki')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-gold-600 dark:hover:text-gold-400 hover:border-gold-500/50 transition-all group shrink-0"
          >
            <Compass size={14} className="group-hover:animate-pulse text-gold-500" />
            Cek Arah Rejeki (Hari)
            <ArrowRightCircle size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        )}
      </div>
    </div>
  );
};
