import React, { useState } from 'react';
import { User, Bird, Search, Info, Eye, PersonStanding, Fingerprint, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface KaturangganItem {
  id: string;
  name: string;
  trait: string;
  meaning: string;
  impact: 'good' | 'neutral' | 'bad';
}

const HUMAN_DATA: KaturangganItem[] = [
  { id: 'h1', name: 'Alis Nyambung', trait: 'Alis kiri dan kanan bertemu di tengah.', meaning: 'Memiliki sifat yang keras kepala, namun sangat tekun dan memiliki pendirian yang teguh.', impact: 'neutral' },
  { id: 'h2', name: 'Dahi Luas', trait: 'Dahi lebar dan tidak menonjol ke depan.', meaning: 'Cerdas, bijaksana, memiliki wawasan luas, dan biasanya memiliki nasib yang baik dalam karir.', impact: 'good' },
  { id: 'h3', name: 'Mata Tajam', trait: 'Tatapan mata yang tajam dan berwibawa.', meaning: 'Memiliki ambisi yang kuat, jujur, namun terkadang kurang sabar dalam menghadapi rintangan.', impact: 'good' },
  { id: 'h4', name: 'Bibir Tipis', trait: 'Bentuk bibir yang tipis di bagian atas dan bawah.', meaning: 'Pandai berkomunikasi, pandai berdebat, namun harus berhati-hati dalam menjaga rahasia.', impact: 'neutral' },
  { id: 'h5', name: 'Cara Jalan Seperti Macan', trait: 'Langkah kaki mantap dan badan condong ke depan.', meaning: 'Memiliki kewibawaan tinggi, cocok menjadi pemimpin, dan rejekinya stabil.', impact: 'good' },
  { id: 'h6', name: 'Telinga Tebal', trait: 'Daun telinga tebal dan lunak.', meaning: 'Panjang umur, sabar, dan memiliki keberuntungan dalam harta benda.', impact: 'good' },
];

const BIRD_DATA: KaturangganItem[] = [
  { id: 'b1', name: 'Songgo Buwono', trait: 'Memiliki satu helai bulu putih di bagian punggung.', meaning: 'Membawa kedamaian dalam rumah tangga dan melancarkan rejeki bagi pemiliknya.', impact: 'good' },
  { id: 'b2', name: 'Kusuma Wicitra', trait: 'Paruh dan sisik kaki berwarna keputihan.', meaning: 'Membantu pemiliknya mencapai cita-cita yang tinggi dan memberikan kewibawaan.', impact: 'good' },
  { id: 'b3', name: 'Pancuran Mas', trait: 'Kotorannya berwarna kekuningan seperti emas.', meaning: 'Diyakini menarik kekayaan dan kelimpahan rejeki yang tidak terputus.', impact: 'good' },
  { id: 'b4', name: 'Sengkuni', trait: 'Bulu sayap sering berbunyi saat terbang atau gelisah.', meaning: 'Kurang baik, dipercaya membawa suasana panas atau pertengkaran di rumah.', impact: 'bad' },
  { id: 'b5', name: 'Satrio Piningit', trait: 'Bulu halus di atas kepala membentuk jambul.', meaning: 'Memberikan perlindungan ghaib dan meningkatkan derajat sosial pemiliknya.', impact: 'good' },
  { id: 'b6', name: 'Wilis', trait: 'Terdapat bulu kehijauan di sekitar mata.', meaning: 'Sangat baik untuk ketenangan batin dan keharmonisan keluarga.', impact: 'good' },
];

export function Katuranggan() {
  const [activeTab, setActiveTab] = useState<'human' | 'bird'>('human');
  const [search, setSearch] = useState('');

  const currentData = activeTab === 'human' ? HUMAN_DATA : BIRD_DATA;
  const filteredData = currentData.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.trait.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 mb-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
          <Sparkles size={32} className="text-gold-600" />
          Katuranggan & Ciri Mathi
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mt-2 max-w-2xl mx-auto">
          Ilmu Titen untuk mengenali karakter, nasib, dan keberuntungan melalui ciri fisik manusia maupun hewan peliharaan.
        </p>
      </div>

      {/* Tab UI */}
      <div className="flex justify-center mb-8">
        <div className="bg-stone-100 dark:bg-stone-900 p-1 rounded-2xl flex border border-stone-200 dark:border-stone-800">
          <button 
            onClick={() => setActiveTab('human')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'human' 
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm" 
                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
            )}
          >
            <User size={18} /> Katuranggan Manusia
          </button>
          <button 
            onClick={() => setActiveTab('bird')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'bird' 
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm" 
                : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
            )}
          >
            <Bird size={18} /> Perkutut Klenik
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-stone-400" />
        </div>
        <input
          type="text"
          placeholder={`Cari ciri ${activeTab === 'human' ? 'manusia' : 'burung'}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all shadow-sm"
        />
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredData.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id}
              className="group bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 hover:shadow-xl hover:border-gold-500/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-stone-50 dark:bg-stone-950 flex items-center justify-center text-gold-600 border border-stone-100 dark:border-stone-800">
                  {activeTab === 'human' ? <PersonStanding size={24} /> : <Bird size={24} />}
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  item.impact === 'good' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" :
                  item.impact === 'bad' ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400" :
                  "bg-stone-50 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                )}>
                  {item.impact === 'good' ? 'Bertuah Baik' : item.impact === 'bad' ? 'Pantangan' : 'Netral'}
                </div>
              </div>

              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 group-hover:text-gold-600 transition-colors">
                {item.name}
              </h3>
              
              <div className="flex items-start gap-2 mb-4">
                <Info size={14} className="mt-1 text-stone-400 shrink-0" />
                <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                  "{item.trait}"
                </p>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-100 dark:border-stone-800">
                <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block mb-1">Arti & Watak</span>
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {item.meaning}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20">
          <p className="text-stone-400 italic">Tidak ditemukan katuranggan dengan kata kunci tersebut.</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-16 p-6 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 shrink-0 bg-gold-500/20 rounded-full flex items-center justify-center border border-gold-500/30">
            <Eye size={32} className="text-gold-500" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Mengenal Watak Melalui Ilmu Titen</h4>
            <p className="text-sm opacity-80 leading-relaxed">
              Katuranggan adalah warisan leluhur untuk membaca tanda-tanda alam pada tubuh. Gunakan informasi ini sebagai sarana mawas diri dan meningkatkan kewaspadaan, bukan untuk menghakimi seseorang secara mutlak.
            </p>
          </div>
      </div>
    </div>
  );
}
