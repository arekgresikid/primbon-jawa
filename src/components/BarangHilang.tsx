import React, { useState } from 'react';
import { Search, MapPin, PersonStanding, Repeat, AlertCircle, Calendar, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type Hari = 'Minggu' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
type Pasaran = 'Legi' | 'Pahing' | 'Pon' | 'Wage' | 'Kliwon';

const HARI_VALUES: Record<Hari, number> = {
  'Minggu': 5, 'Senin': 4, 'Selasa': 3, 'Rabu': 7, 'Kamis': 8, 'Jumat': 6, 'Sabtu': 9
};

const PASARAN_VALUES: Record<Pasaran, number> = {
  'Legi': 5, 'Pahing': 9, 'Pon': 7, 'Wage': 4, 'Kliwon': 8
};

interface Result {
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

export function BarangHilang() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [hari, setHari] = useState<Hari>('Senin');
  const [pasaran, setPasaran] = useState<Pasaran>('Legi');
  const [showResult, setShowResult] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setSelectedDate(dateStr);
    if (!dateStr) return;

    const date = new Date(dateStr);
    
    // Hitung Hari (0 = Minggu, 1 = Senin, ...)
    const hariList: Hari[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const hIdx = date.getDay();
    setHari(hariList[hIdx]);

    // Hitung Pasaran
    // Epoch 1 Jan 1970 adalah Kamis Wage (Index Pasaran 3: Wage)
    const pasaranList: Pasaran[] = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const baseDate = new Date(1970, 0, 1);
    const diffTime = date.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Mencari index pasaran. Karena 1 Jan 1970 adalah Wage (Index 3), kita tambah 3
    // Gunakan fungsi modulo yang menangani angka negatif (jika memilih tanggal sebelum 1970)
    const pIdx = ((diffDays % 5) + 3 + 5) % 5;
    setPasaran(pasaranList[pIdx]);
    
    setShowResult(false);
  };

  const calculate = () => {
    const total = HARI_VALUES[hari] + PASARAN_VALUES[pasaran];
    const sisa = total % 4;
    setShowResult(true);
    return sisa;
  };

  const sisa = (HARI_VALUES[hari] + PASARAN_VALUES[pasaran]) % 4;

  const results: Record<number, Result> = {
    1: {
      label: "Bukan Pencurian",
      desc: "Barang kemungkinan besar tidak hilang dicuri, melainkan terselip, lupa menaruh, atau masih berada di sekitar rumah/lokasi kejadian. Coba cari kembali di tempat-tempat tersembunyi.",
      icon: <Repeat className="text-blue-500" />,
      color: "blue"
    },
    2: {
      label: "Orang Dekat / Saudara",
      desc: "Ramalan menunjukkan barang diambil oleh orang yang mengenal lokasi tersebut dengan baik, atau kemungkinan kerabat/saudara sendiri. Ada potensi barang dikembalikan jika dibicarakan baik-baik.",
      icon: <PersonStanding className="text-orange-500" />,
      color: "orange"
    },
    3: {
      label: "Orang Luar / Kenalan Baru",
      desc: "Barang diambil oleh orang luar yang sering berkunjung atau kerabat dari pasangan (istri/suami). Bisa juga oleh pendatang baru di lingkungan tersebut.",
      icon: <Search className="text-gold-500" />,
      color: "gold"
    },
    0: {
      label: "Orang Jauh",
      desc: "Barang diambil oleh orang asing yang tidak dikenal atau orang jauh yang kebetulan lewat (pecat saking nggone). Kecil kemungkinan barang kembali secara alami tanpa upaya keras.",
      icon: <ShieldAlert className="text-red-500" />,
      color: "red"
    }
  };

  const getDirection = (p: Pasaran) => {
    const directions: Record<Pasaran, string> = {
      'Legi': 'Timur (Wetan)',
      'Pahing': 'Selatan (Kidul)',
      'Pon': 'Barat (Kulon)',
      'Wage': 'Utara (Lor)',
      'Kliwon': 'Dekat dengan Lokasi / Kembali Lagi'
    };
    return directions[p];
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 mb-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
          <Search size={32} className="text-gold-600" />
          Primbon Barang Hilang
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mt-2 max-w-lg mx-auto">
          Mendeteksi keberadaan barang yang hilang dan ciri pelakunya berdasarkan kalender Jawa Kuno.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Selection Area */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-3">
              Pilih Tanggal Kejadian
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-stone-400" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="block w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium text-stone-800 dark:text-stone-200"
              />
            </div>
            <p className="mt-2 text-[10px] text-stone-400 italic">
              *Mengisi tanggal akan otomatis menentukan Hari & Pasaran di bawah.
            </p>
          </div>

          <div className="border-t border-stone-100 dark:border-stone-800 pt-6">
            <label className="block text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-4">
              Pilih Hari (Manual)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {(Object.keys(HARI_VALUES) as Hari[]).map((h) => (
                <button
                  key={h}
                  onClick={() => { setHari(h); setShowResult(false); }}
                  className={cn(
                    "py-2 px-1 text-xs font-semibold rounded-lg transition-all border",
                    hari === h 
                      ? "bg-gold-500 border-gold-500 text-white shadow-md shadow-gold-500/20" 
                      : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-gold-300"
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-4">
              Pilih Pasaran
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(PASARAN_VALUES) as Pasaran[]).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPasaran(p); setShowResult(false); }}
                  className={cn(
                    "py-3 px-1 text-xs font-bold rounded-lg transition-all border",
                    pasaran === p 
                      ? "bg-stone-800 dark:bg-stone-100 border-stone-800 dark:border-stone-100 text-white dark:text-stone-900 shadow-lg" 
                      : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-400"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowResult(true)}
            className="w-full py-4 bg-gold-600 hover:bg-gold-500 text-white font-bold rounded-xl shadow-lg shadow-gold-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            Lacak Keberadaan <Search size={18} className="group-hover:scale-110 transition-transform" />
          </button>

          <p className="text-[10px] text-stone-400 dark:text-stone-500 text-center italic">
            *Hasil perhitungan ini bersifat ramalan tradisional (Ilmu Titen). Gunakan sebagai bahan pertimbangan tambahan.
          </p>
        </div>

        {/* Result Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-10 text-center"
              >
                <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={24} className="text-stone-300" />
                </div>
                <h3 className="text-stone-400 dark:text-stone-500 font-medium">Belum ada data</h3>
                <p className="text-stone-400 text-sm">Silakan pilih hari dan pasaran saat barang hilang untuk memulai analisis.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="bg-white dark:bg-stone-950 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-stone-50 dark:bg-stone-900 flex items-center justify-center border border-stone-100 dark:border-stone-800">
                            {results[sisa].icon}
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">Analisis Pelaku</span>
                            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">{results[sisa].label}</h3>
                        </div>
                    </div>
                    
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                        {results[sisa].desc}
                    </p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                            <div className="flex items-center gap-2 mb-2 text-stone-400 text-[10px] font-bold uppercase">
                                <MapPin size={12} className="text-gold-500" /> Arah Pencarian
                            </div>
                            <div className="text-sm font-bold text-stone-800 dark:text-stone-200">{getDirection(pasaran)}</div>
                        </div>
                        <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                            <div className="flex items-center gap-2 mb-2 text-stone-400 text-[10px] font-bold uppercase">
                                <Calendar size={12} className="text-gold-500" /> Waktu Kejadian
                            </div>
                            <div className="text-sm font-bold text-stone-800 dark:text-stone-200">{hari} {pasaran} (Neptu: {HARI_VALUES[hari] + PASARAN_VALUES[pasaran]})</div>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase mb-2">Nasehat Sesepuh</h4>
                    <p className="text-amber-800/80 dark:text-amber-400/80 text-xs italic leading-relaxed">
                        "Janganlah gelisah berlebihan. Jika sudah rejeki, pasti akan kembali. Namun jika bukan, anggaplah sebagai sedekah penolak bala. Tetaplah waspada dan lebih berhati-hati di masa mendatang."
                    </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
