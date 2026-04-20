/// <reference types="vite/client" />
import React, { useState, useEffect, useMemo } from 'react';
import { Feather, Sparkles, Clock, Calendar, ArrowRight, Search, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Breadcrumbs } from './Breadcrumbs';
import { SEO } from './SEO';
import { cn } from '../lib/utils';

// Fetch all markdown files from the stories directory
const storyFiles = import.meta.glob('../content/stories/*.md', { query: '?raw', eager: true });

interface StoryMetadata {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
}

interface Story {
  metadata: StoryMetadata;
  content: string;
}

// Browser-safe frontmatter parser
function parseFrontmatter(text: string) {
  const regex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = text.match(regex);
  
  if (!match) return { data: {}, content: text };
  
  const yaml = match[1];
  const content = match[2];
  const data: any = {};
  
  yaml.split('\n').forEach(line => {
    const [key, ...values] = line.split(':');
    if (key && values.length > 0) {
      data[key.trim()] = values.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });
  
  return { data, content };
}

export function MysticalStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load and parse stories on mount
  useEffect(() => {
    console.log('Story files found:', Object.keys(storyFiles));
    const loadedStories = Object.values(storyFiles).map((file: any) => {
      const rawText = file.default || file;
      const { data, content } = parseFrontmatter(rawText);
      return { metadata: data as StoryMetadata, content };
    }).sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
    
    setStories(loadedStories);
  }, []);

  // Filter stories based on search query
  const filteredStories = useMemo(() => {
    return stories.filter(s => 
      s.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.metadata.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stories, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStories.length / itemsPerPage);
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStories.slice(start, start + itemsPerPage);
  }, [filteredStories, currentPage]);

  const selectedStory = useMemo(() => 
    stories.find(s => s.metadata.slug === selectedSlug),
    [stories, selectedSlug]
  );

  const resetView = () => {
    setSelectedSlug(null);
    window.scrollTo(0, 0);
  };

  if (selectedStory) {
    return (
      <div className="w-full max-w-4xl mx-auto pb-32 px-4 sm:px-6 pt-4">
        <SEO 
          title={`${selectedStory.metadata.title} | Primbon Jawa`}
          description={selectedStory.metadata.excerpt}
        />
        
        <Breadcrumbs items={[
          { label: 'Cerita', onClick: resetView },
          { label: selectedStory.metadata.title, active: true }
        ]} />

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-2xl shadow-gold-900/5"
        >
          {/* Hero Image */}
          <div className="relative h-64 sm:h-96 w-full">
            <img 
              src={selectedStory.metadata.thumbnail} 
              alt={selectedStory.metadata.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
               <div className="flex items-center gap-2 text-gold-400 mb-3">
                  <Calendar size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{selectedStory.metadata.date}</span>
               </div>
               <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {selectedStory.metadata.title}
               </h1>
            </div>
          </div>

          <div className="p-6 sm:p-12">
            <div className="prose dark:prose-invert max-w-none prose-stone prose-lg">
              <ReactMarkdown>{selectedStory.content}</ReactMarkdown>
            </div>
            
            <div className="mt-12 pt-8 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600">
                    <Feather size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Penulis</div>
                    <div className="text-sm font-bold text-stone-700 dark:text-stone-300">Ki Juru Cerita</div>
                  </div>
               </div>
               <button 
                onClick={resetView}
                className="text-stone-400 hover:text-gold-600 transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
               >
                 Tutup Cerita <ChevronRight size={14} />
               </button>
            </div>
          </div>
        </motion.article>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-32 px-4 sm:px-6 pt-4">
      <header className="mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-900 rounded-full border border-stone-200 dark:border-stone-800">
          <Sparkles size={14} className="text-gold-500" />
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Arsip Hikayat Nusantara</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-stone-900 dark:text-stone-100 italic">
          Cerita Mistis
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-lg mx-auto leading-relaxed">
          <span className="text-red-600 dark:text-red-500 font-bold">Kumpulan artikel misteri dan kearifan lokal</span> yang <span className="text-red-600 dark:text-red-500 font-bold">terbit secara gaib setiap 3 hari sekali</span> menggunakan kecerdasan buatan.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text"
            placeholder="Cari hikayat..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-gold-500/5 focus:border-gold-500 transition-all outline-none"
          />
        </div>
      </header>

      {paginatedStories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 text-center">
          <BookOpen size={48} className="text-stone-200 dark:text-stone-800 mb-4" />
          <p className="text-stone-400 font-medium italic">Cerita yang Anda cari tidak ditemukan...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedStories.map((story, i) => (
              <motion.div
                layout
                key={story.metadata.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => { setSelectedSlug(story.metadata.slug); window.scrollTo(0, 0); }}
                className="group cursor-pointer bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gold-900/10 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={story.metadata.thumbnail} 
                    alt={story.metadata.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/0 transition-colors" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                    <Calendar size={12} />
                    {story.metadata.date}
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3 leading-tight group-hover:text-gold-600 transition-colors line-clamp-2">
                    {story.metadata.title}
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {story.metadata.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-50 dark:border-stone-800/50">
                    <span className="text-[10px] font-bold text-gold-600 dark:text-gold-500 uppercase tracking-widest flex items-center gap-1.5">
                      Baca Selengkapnya <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "w-10 h-10 rounded-xl text-xs font-bold transition-all",
                  currentPage === i + 1 
                    ? "bg-gold-500 text-white shadow-lg shadow-gold-500/25" 
                    : "text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
