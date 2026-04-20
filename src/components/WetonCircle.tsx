import React, { useState, useEffect } from 'react';
import { User, Trash2, Heart, Plus, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getWeton } from '../lib/jawaMath';

interface Profile {
  id: string;
  name: string;
  dob: string;
}

export function WetonCircle({ onSelect }: { onSelect: (dob: string) => void }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('primbon_weton_circle');
    if (saved) {
      try {
        setProfiles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse weton circle profiles");
      }
    }
  }, []);

  const saveProfiles = (newProfiles: Profile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('primbon_weton_circle', JSON.stringify(newProfiles));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDob) return;

    const newProfile: Profile = {
      id: Date.now().toString(),
      name: newName.trim(),
      dob: newDob
    };

    saveProfiles([...profiles, newProfile]);
    setNewName('');
    setNewDob('');
    setShowAdd(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    saveProfiles(profiles.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <Heart size={14} className="text-red-400" /> Lingkaran Batin
        </h4>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] font-bold text-gold-600 dark:text-gold-500 uppercase tracking-widest hover:text-gold-500 transition-colors"
        >
          {showAdd ? 'Batal' : '+ Tambah Sosok'}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd}
            className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 gap-3 flex flex-col md:flex-row items-end overflow-hidden"
          >
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-1">Nama Sosok</label>
              <input 
                type="text" 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Mis: Istri, Anak, Kakak..."
                className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-1">Tanggal Lahir</label>
              <input 
                type="date"
                value={newDob}
                onChange={e => setNewDob(e.target.value)}
                className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <button 
              type="submit"
              className="bg-gold-500 text-white rounded-lg px-4 py-2 text-sm font-bold shadow-sm hover:bg-gold-600 transition-colors w-full md:w-auto"
            >
              Simpan
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {profiles.map((p) => {
          const weton = getWeton(new Date(p.dob));
          return (
            <motion.button
              layout
              key={p.id}
              onClick={() => onSelect(p.dob)}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3 text-left hover:border-gold-300 dark:hover:border-gold-700 transition-all group relative overflow-hidden shadow-sm"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-gold-600 dark:text-gold-500 truncate max-w-[70%]">{p.name}</span>
                <button 
                  onClick={(e) => handleDelete(p.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-stone-300 hover:text-red-400 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="text-sm font-black text-stone-800 dark:text-stone-200 leading-tight">
                {weton.dina} {weton.pasaran}
              </div>
              <div className="text-[9px] text-stone-400 mt-1 flex items-center gap-1 font-medium">
                <Calendar size={10} /> {new Date(p.dob).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </div>
              <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none -mt-2 -mr-2">
                <Sparkles size={40} />
              </div>
            </motion.button>
          );
        })}

        {profiles.length === 0 && !showAdd && (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
            <p className="text-stone-400 text-xs italic">Belum ada sosok yang disimpan di Lingkaran Batin Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
