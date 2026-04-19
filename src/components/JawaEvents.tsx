import React from 'react';
import { motion } from 'motion/react';
import { getJavaneseEvents } from '../lib/jawaMath';
import { Star, Sparkles, MapPin, CalendarDays } from 'lucide-react';

export function JawaEvents({ onConsult }: { onConsult?: () => void }) {
  const currentYear = new Date().getFullYear();
  const events = getJavaneseEvents(currentYear);

  return (
    <section className="w-full max-w-2xl mx-auto pb-32 px-4 sm:px-6 pt-6 sm:pt-10">
      <header className="mb-10 text-center space-y-2">
        <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
          <Star size={28} className="text-gold-500 fill-gold-500/20" />
          Katalog Hari Besar Jawa
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm italic">Menelusuri siklus waktu dan tradisi luhur Tanah Jawa.</p>
      </header>

      <div className="space-y-6">
        {events.map((event, i) => (
          <motion.article 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={event.name}
            className="group relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-gold-300 dark:hover:border-gold-700"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gold-500/10 group-hover:bg-gold-500 transition-colors rounded-l-2xl" />
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-50 dark:bg-stone-950 flex items-center justify-center text-gold-600 dark:text-gold-500 shrink-0 border border-gold-100 dark:border-stone-800">
                {event.type === 'dynamic' ? <Sparkles size={20} /> : <CalendarDays size={20} />}
              </div>
              
              <div className="flex-1">
                <header className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">{event.name}</h3>
                  {event.type !== 'dynamic' && (
                    <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                      {event.day} {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][event.month]} {currentYear}
                    </span>
                  )}
                </header>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{event.desc}</p>
                
                {event.type === 'dynamic' && (
                  <footer className="mt-3 flex items-center gap-2 text-xs font-semibold text-gold-600 dark:text-gold-500 bg-gold-50 dark:bg-gold-500/5 px-3 py-2 rounded-lg border border-gold-100 dark:border-gold-500/20">
                    <MapPin size={12} /> Cek tab Wetonku untuk jadwal Selapanan pribadi Anda.
                  </footer>
                )}
              </div>
            </div>
          </motion.article>
        ))}

        <div className="mt-12 p-8 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <Star size={120} />
           </div>
           <h4 className="text-stone-800 dark:text-stone-200 font-bold mb-2">Ingin info lebih mendalam?</h4>
           <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">Tanyakan pada Sesepuh AI mengenai tata cara adat pada hari-hari besar tersebut.</p>
            <button 
              onClick={onConsult}
              className="text-xs font-bold uppercase tracking-widest bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 px-6 py-3 rounded-full hover:bg-gold-600 dark:hover:bg-gold-500 transition-colors shadow-lg cursor-pointer"
            >
              Konsultasi Sekarang
            </button>
        </div>
      </div>
    </section>
  );
}
