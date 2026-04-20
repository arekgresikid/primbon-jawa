import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, EyeOff, Database, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 mb-4 border border-blue-500/20">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-black text-stone-900 dark:text-stone-100">Kebijakan Privasi</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm max-w-lg mx-auto leading-relaxed">
            Privasi Anda adalah prioritas utama kami. Aplikasi Primbon Jawa dirancang dengan prinsip "Privacy by Design".
          </p>
        </motion.section>

        <motion.div variants={itemVariants} className="space-y-8 bg-white dark:bg-stone-900/50 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Lock size={20} className="text-gold-500" /> Pengolahan Data Lokal
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Semua perhitungan data spiritual, termasuk input tanggal lahir Anda, dilakukan secara **lokal** pada perangkat Anda. Kami tidak mengirimkan data sensitif ini ke server mana pun. Ini memastikan bahwa informasi pribadi Anda tetap berada di tangan Anda.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <EyeOff size={20} className="text-gold-500" /> Tanpa Pengumpulan Data Pribadi
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Aplikasi ini tidak memerlukan proses pendaftaran atau login. Kami tidak meminta nama, nomor telepon, alamat, atau informasi identitas pribadi lainnya untuk memberikan layanan dasar kami.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Database size={20} className="text-gold-500" /> Penyimpanan Lokal (Local Storage)
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Kami menggunakan teknologi *Local Storage* pada browser Anda hanya untuk menyimpan preferensi aplikasi, seperti pengaturan mode gelap (Dark Mode) dan tab terakhir yang Anda buka, guna memberikan pengalaman pengguna yang lebih baik saat Anda kembali.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
              <Mail size={20} className="text-gold-500" /> Hubungi Kami
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Jika Anda memiliki pertanyaan mengenai kebijakan privasi kami, jangan ragu untuk menghubungi kami melalui email di:
              <a href="mailto:arekgresikid@gmail.com" className="block mt-2 text-gold-600 dark:text-gold-400 font-bold hover:underline">
                arekgresikid@gmail.com
              </a>
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
