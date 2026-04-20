import React from 'react';
import { motion } from 'motion/react';
import { FileText, AlertTriangle, Scale, Info, CheckCircle } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        <motion.section variants={itemVariants} className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mb-4 border border-amber-500/20">
            <FileText size={32} />
          </div>
          <h2 className="text-3xl font-black text-stone-900 dark:text-stone-100">Syarat Layanan</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm max-w-lg mx-auto leading-relaxed">
            Harap baca syarat layanan ini secara saksama sebelum menggunakan aplikasi Primbon Jawa Modern.
          </p>
        </motion.section>

        <motion.div variants={itemVariants} className="space-y-8 bg-white dark:bg-stone-900/50 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Info size={20} className="text-gold-500" /> Tujuan Informasi
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Aplikasi ini disediakan semata-mata untuk tujuan menyebarkan kearifan budaya dan hiburan. Informasi yang dihasilkan (seperti ramalan weton, tafsir mimpi, atau konsultasi AI) harus dipandang sebagai perspektif tradisional dan bukan sebagai fakta ilmiah yang absolut.
            </p>
          </section>

          <section className="space-y-3 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle size={20} /> Pelepasan Tanggung Jawab
            </h3>
            <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed italic">
              Pengembang tidak bertanggung jawab atas keputusan apa pun yang diambil pengguna berdasarkan hasil perhitungan atau ramalan dalam aplikasi ini. Segala bentuk interpretasi dan penggunaan informasi adalah risiko pribadi pengguna. Kami sangat menyarankan agar urusan penting medis, hukum, atau keuangan dikonsultasikan dengan profesional di bidangnya.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Scale size={20} className="text-gold-500" /> Penggunaan yang Adil
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Anda setuju untuk menggunakan aplikasi ini untuk tujuan yang sah dan tidak melanggar hak orang lain atau membatasi penggunaan aplikasi oleh pihak ketiga. Penyalahgunaan sistem AI atau upaya peretasan dilarang keras.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <CheckCircle size={20} className="text-gold-500" /> Persetujuan
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Dengan menggunakan aplikasi ini, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.
            </p>
          </section>
        </motion.div>

        <footer className="text-center opacity-40 py-6">
          <p className="text-[10px] font-bold tracking-widest uppercase">Terakhir diperbarui: 21 April 2026</p>
        </footer>
      </motion.div>
    </div>
  );
};
