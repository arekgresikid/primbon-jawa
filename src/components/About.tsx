import React from 'react';
import { motion } from 'motion/react';
import { Info, Github, Globe, Mail, Sparkles, Heart, Zap, BookOpen, CalendarDays, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
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
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gold-500/10 dark:bg-gold-500/20 text-gold-600 dark:text-gold-500 mb-4 shadow-inner border border-gold-500/20">
            <Info size={40} />
          </div>
          <h2 className="text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Primbon Jawa <span className="text-gold-500">Modern</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
            Menjembatani kearifan lokal leluhur dengan teknologi masa kini untuk panduan spiritual yang presisi dan relevan.
          </p>
          <div className="flex justify-center gap-2 pt-2">
             <span className="px-3 py-1 bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-stone-200 dark:border-stone-800">Version 2.5.0</span>
             <span className="px-3 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-gold-500/20">PWA Ready</span>
          </div>
        </motion.section>

        {/* Philosophy Section */}
        <motion.section variants={itemVariants} className="relative p-8 rounded-3xl bg-stone-900 dark:bg-stone-950 text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-gold-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <BookOpen size={16} /> Filosofi Aplikasi
            </h3>
            <p className="text-lg font-medium leading-relaxed italic text-stone-200">
              "Maca Sasmita, Ngundhuh Rahayu"
            </p>
            <p className="text-sm text-stone-400 leading-relaxed max-w-xl">
              Kalimat ini bermakna "Membaca pertanda lahir batin, untuk menuai keselamatan dan keberkahan". Aplikasi ini bukan sekadar alat ramal, melainkan instrumen refleksi diri untuk menyelaraskan ritme hidup manusia dengan harmoni alam semesta.
            </p>
          </div>
        </motion.section>

        {/* Feature Grid */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h3 className="text-stone-900 dark:text-stone-100 font-bold text-xl px-2 flex items-center gap-2">
            <Zap size={20} className="text-gold-500" /> Ekosistem Digital
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: CalendarDays, title: 'Kalender Jawa', desc: 'Penanggalan presisi dengan Wuku dan Pranata Mangsa.' },
              { icon: Heart, title: 'Hitung Weton', desc: 'Analisis karakter dan kecocokan jodoh secara mendalam.' },
              { icon: MessageSquare, title: 'AI Sesepuh', iconColor: 'text-blue-500', desc: 'Konsultasi spiritual berbasis kecerdasan buatan.' },
              { icon: Compass, title: 'Kompas Keberuntungan', desc: 'Petunjuk arah rezeki dan kejayaan setiap hari.' },
            ].map((feature, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className={`mb-3 ${feature.iconColor || 'text-gold-500'}`} size={24} />
                <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-1">{feature.title}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Developer Section */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h3 className="text-stone-900 dark:text-stone-100 font-bold text-xl px-2">Kreator & Pengembang</h3>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-gold-50 to-stone-50 dark:from-stone-900/50 dark:to-stone-950 border border-gold-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center gap-8 shadow-sm">
            <div className="w-24 h-24 rounded-full bg-gold-500 p-0.5 shadow-lg overflow-hidden shrink-0">
              <img 
                src="/arekgresikID.jpg" 
                alt="ArekGresikID" 
                className="w-full h-full rounded-full object-cover border-2 border-stone-900 dark:border-stone-950"
              />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h4 className="text-2xl font-black text-stone-900 dark:text-stone-100">ArekGresikID</h4>
                <p className="text-stone-500 dark:text-stone-400 text-sm italic">Creative Technologist & Culture Enthusiast</p>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Didedikasikan untuk melestarikan budaya Nusantara melalui medium digital yang inklusif dan modern.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                <a href="https://ariftirtana.my.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-gold-500 transition-colors">
                  <Globe size={18} />
                  <span className="text-xs font-bold">Portfolio</span>
                </a>
                <a href="https://github.com/arekgresikid" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-gold-500 transition-colors">
                  <Github size={18} />
                  <span className="text-xs font-bold">GitHub</span>
                </a>
                <a href="mailto:arekgresikid@gmail.com" className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-gold-500 transition-colors">
                  <Mail size={18} />
                  <span className="text-xs font-bold">Kontak</span>
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Privacy Note */}
        <motion.section variants={itemVariants} className="p-6 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 text-center">
          <ShieldCheck size={24} className="mx-auto text-stone-400 mb-3" />
          <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">Privasi & Keamanan</h4>
          <p className="text-[10px] text-stone-500 dark:text-stone-500 uppercase tracking-widest leading-relaxed">
            Aplikasi ini tidak menyimpan data tanggal lahir Anda di server. <br/>
            Semua perhitungan dilakukan secara lokal pada peramban Anda untuk privasi maksimal.
          </p>
        </motion.section>

        <motion.div variants={itemVariants} className="text-center opacity-40 py-10">
           <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-stone-500">Primbon Jawa • 2026</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
