import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Star, Handshake, CheckCircle2, ChevronRight, LayoutTemplate, ArrowUpToLine, PanelLeft, ArrowDownToLine, PictureInPicture2, X, Eye } from 'lucide-react';

const WA_NUMBER = "6281234567890"; // Ganti dengan nomor WhatsApp yang benar
const WA_MESSAGE = encodeURIComponent("Halo Admin Primbon Jawa, saya tertarik untuk berdiskusi mengenai pemasangan iklan di aplikasi/website Primbon Jawa.");
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export const PasangIklan: React.FC = () => {
  const [showDemoPopup, setShowDemoPopup] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gold-500/10 text-gold-600 dark:text-gold-500 mb-2 shadow-inner border border-gold-500/20">
            <Megaphone size={40} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Pasang <span className="text-gold-500">Iklan</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed text-sm">
            Jangkau audiens tertarget yang peduli pada pelestarian budaya. Tampilkan bisnis Anda di aplikasi Primbon Jawa dengan ribuan kunjungan organik.
          </p>
        </div>

        {/* Rincian Harga & Slot */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 mb-8 flex items-center gap-3">
              <LayoutTemplate size={24} className="text-gold-500" />
              Harga & Posisi Penempatan Slot
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* POPUP AD */}
              <div className="border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 rounded-2xl p-5 hover:border-purple-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 relative">
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                  </span>
                  <PictureInPicture2 size={20} className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="px-2.5 py-1 bg-purple-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block">Eksklusif</span>
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-lg">Popup Ad</h4>
                <div className="mt-2 mb-4 flex items-baseline gap-1">
                  <span className="text-xl font-black text-purple-600 dark:text-purple-500">Rp 500.000</span>
                  <span className="text-stone-500 text-xs font-medium">/ bulan</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                  Ditampilkan dalam bentuk jendela dialog (popup) di tengah layar saat pengunjung baru masuk atau beralih halaman. Ukuran sangat besar dan eksklusif.
                </p>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 mt-auto flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-900 dark:text-stone-300 uppercase tracking-wider block mb-1">💡 Rekomendasi:</span>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Konversi tertinggi. Sangat disarankan untuk promo flash sale atau event besar. Wajib dilihat setiap pengunjung!</p>
                  </div>
                  <button 
                    onClick={() => setShowDemoPopup(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 mt-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Eye size={14} /> Lihat Contoh
                  </button>
                </div>
              </div>
              
              {/* TOP BANNER */}
              <div className="border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 rounded-2xl p-5 hover:border-gold-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4">
                  <ArrowUpToLine size={20} className="text-gold-600 dark:text-gold-400 group-hover:-translate-y-1 transition-transform" />
                </div>
                <span className="px-2.5 py-1 bg-gold-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block">Premium</span>
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-lg">Top Banner (Atas)</h4>
                <div className="mt-2 mb-4 flex items-baseline gap-1">
                  <span className="text-xl font-black text-gold-600 dark:text-gold-500">Rp 300.000</span>
                  <span className="text-stone-500 text-xs font-medium">/ bulan</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                  Tampil tepat di bawah navigasi (di atas konten utama). Slot ini dibuat lebih ramping (slim) agar tidak mengganggu fokus pembaca terhadap isi primbon.
                </p>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] font-bold text-stone-900 dark:text-stone-300 uppercase tracking-wider block mb-1">💡 Rekomendasi:</span>
                  <p className="text-xs text-stone-600 dark:text-stone-400">Sangat efektif untuk branding utama karena menjadi hal pertama yang dilihat pengunjung. Potensi klik maksimal.</p>
                </div>
              </div>

              {/* SIDEBAR AD */}
              <div className="border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 rounded-2xl p-5 hover:border-blue-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <PanelLeft size={20} className="text-blue-600 dark:text-blue-400 group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="px-2.5 py-1 bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[9px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block">Standar</span>
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-lg">Sidebar (Samping)</h4>
                <div className="mt-2 mb-4 flex items-baseline gap-1">
                  <span className="text-xl font-black text-stone-800 dark:text-stone-200">Rp 200.000</span>
                  <span className="text-stone-500 text-xs font-medium">/ bulan</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                  Tampil khusus pada layar komputer/laptop (di sidebar sebelah kiri). Slot ini berbentuk agak persegi (square) yang sangat pas untuk gambar banner promosi standar.
                </p>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] font-bold text-stone-900 dark:text-stone-300 uppercase tracking-wider block mb-1">💡 Rekomendasi:</span>
                  <p className="text-xs text-stone-600 dark:text-stone-400">Cocok untuk materi iklan berbentuk flyer persegi atau promo berjalan (campaign) dengan target pembaca via Desktop.</p>
                </div>
              </div>

              {/* BOTTOM AD */}
              <div className="border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 rounded-2xl p-5 hover:border-green-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <ArrowDownToLine size={20} className="text-green-600 dark:text-green-400 group-hover:translate-y-1 transition-transform" />
                </div>
                <span className="px-2.5 py-1 bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[9px] font-bold uppercase tracking-widest rounded-full mb-3 inline-block">Ekonomis</span>
                <h4 className="font-black text-stone-900 dark:text-stone-100 text-lg">Bottom Ad (Bawah)</h4>
                <div className="mt-2 mb-4 flex items-baseline gap-1">
                  <span className="text-xl font-black text-stone-800 dark:text-stone-200">Rp 150.000</span>
                  <span className="text-stone-500 text-xs font-medium">/ bulan</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                  Masih ada dan letaknya tetap di bawah, persis sebelum footer aplikasi. Berada di akhir dari seluruh konten di aplikasi.
                </p>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] font-bold text-stone-900 dark:text-stone-300 uppercase tracking-wider block mb-1">💡 Rekomendasi:</span>
                  <p className="text-xs text-stone-600 dark:text-stone-400">Sangat pas untuk budget hemat namun tetap mendapat exposure. Menjadi pengingat terakhir bagi pembaca.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Paket Custom */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-gold-500 group-hover:rotate-12 transition-transform">
              <Handshake size={100} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-lg">
                <div>
                  <span className="px-3 py-1 bg-gold-500/20 text-gold-400 border border-gold-500/30 text-[10px] font-bold uppercase tracking-widest rounded-full">Fleksibel</span>
                  <h3 className="text-2xl font-black text-white mt-4">Custom Slot (Nego)</h3>
                </div>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Bisa pilih penempatan khusus (misal: hanya tampil di halaman Jodoh atau Weton), sponsorship artikel, popup banner, dll. Harga menyesuaikan tingkat penempatan & durasi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 text-center space-y-6">
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">Tertarik Bekerja Sama?</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Jangan ragu untuk menghubungi kami melalui WhatsApp. Kami sangat terbuka untuk berdiskusi dan menyesuaikan dengan budget promosi Anda.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-stone-200/50 dark:shadow-none active:scale-95"
          >
            <img src="/images/whatsapp.svg" alt="WhatsApp" className="w-6 h-6 drop-shadow-sm" />
            Hubungi via WhatsApp
            <ChevronRight size={16} className="opacity-50" />
          </a>
        </div>
      </motion.div>

      {/* MODAL DEMO POPUP */}
      <AnimatePresence>
        {showDemoPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              onClick={() => setShowDemoPopup(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative z-10 w-full max-w-[90vw] md:max-w-4xl lg:max-w-5xl bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800"
            >
              <button 
                onClick={() => setShowDemoPopup(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40 text-white transition-colors z-20 backdrop-blur-md"
              >
                <X size={20} />
              </button>
              
              {/* Dummy Image Placeholder */}
              <div className="w-full h-48 md:h-80 lg:h-[28rem] bg-stone-200 dark:bg-stone-800 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <Megaphone size={64} className="text-stone-400 dark:text-stone-600 opacity-30 group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute bottom-6 left-6 z-20 text-white font-black text-2xl md:text-5xl tracking-tight drop-shadow-lg">SPACE IKLAN ANDA</span>
                <span className="absolute top-6 left-6 z-20 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-lg border border-white/10">Sponsor Utama</span>
              </div>
              
              <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <h3 className="font-black text-xl md:text-3xl text-stone-900 dark:text-stone-100 mb-3 md:mb-4">Penawaran Eksklusif!</h3>
                  <p className="text-sm md:text-lg text-stone-500 dark:text-stone-400 leading-relaxed">
                    Ini adalah contoh tampilan Popup Ad. Iklan Anda akan mendominasi layar dan menangkap perhatian penuh dari pengunjung situs sebelum mereka beralih membaca konten.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDemoPopup(false)}
                  className="w-full md:w-auto px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gold-500/30 flex-shrink-0"
                >
                  Lihat Info Selengkapnya
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
