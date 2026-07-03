import React, { useState, useRef, useEffect } from 'react';
import { Send, Moon, CloudMoon, Sparkles, Loader2, Trash2, Download, Copy, Check, Image as ImageIcon, Feather, UserCircle, ChevronDown, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  visualPrompt?: string;
}

function DreamImage({ prompt, seed, onZoom }: { prompt: string, seed: string, onZoom: (url: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const imageUrl = `/api/image-proxy?prompt=${encodeURIComponent(prompt)}&seed=${seed}`;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev;
          return prev + (prev < 70 ? 10 : 2);
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 mb-4 relative group shadow-inner">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stone-50 dark:bg-stone-900 z-10 transition-opacity p-6">
          <div className="relative">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[8px] font-bold text-gold-600">{progress}%</span>
            </div>
          </div>
          <div className="w-full max-w-[120px] h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gold-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 animate-pulse">Membuka Tabir Visual...</span>
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400 p-4 text-center">
          <ImageIcon size={24} />
          <p className="text-[10px] font-medium">Gagal memvisualisasikan isyarat ghaib.</p>
        </div>
      ) : (
        <img 
          src={imageUrl} 
          alt="Visualisasi Mimpi"
          className={cn("w-full h-full object-cover transition-opacity duration-1000", loading ? "opacity-0" : "opacity-100")}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
        <span className="text-[9px] text-white/80 font-medium italic">Simulasi Dimensi Ghaib • zimage model</span>
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => onZoom(imageUrl)}
            className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-gold-500 transition-colors"
            title="Zoom"
          >
            <Maximize2 size={14} />
          </button>
          <button 
            onClick={async () => {
              try {
                const res = await fetch(imageUrl);
                const blob = await res.blob();
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `tafsir-mimpi-${seed}.jpg`;
                a.click();
              } catch (e) { console.error(e); }
            }}
            className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-gold-500 transition-colors"
            title="Download"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TafsirMimpi() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('primbon_mimpi_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [{
          id: "1",
          role: "assistant",
          text: "Salam sejahtera, Ananda. Malam adalah gerbang antara dunia nyata dan ghaib. Ceritakanlah mimpi yang mengusik batinmu, akan ku bantu menafsirkan isyarat alam di dalamnya."
        }];
      }
    }
    return [{
      id: "1",
      role: "assistant",
      text: "Salam sejahtera, Ananda. Malam adalah gerbang antara dunia nyata dan ghaib. Ceritakanlah mimpi yang mengusik batinmu, akan ku bantu menafsirkan isyarat alam di dalamnya."
    }];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`;
    }
  }, [input]);

  useEffect(() => {
    localStorage.setItem('primbon_mimpi_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && messages.length > 1) {
        // Fokus ke awal pesan asisten
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Fokus ke dasar untuk pesan user
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [messages]);

  useEffect(() => {
    const handleWindowScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      // Tampilkan jika jarak ke bawah > 150px
      const isFarFromBottom = fullHeight - (scrolled + viewportHeight) > 150;
      setShowScrollButton(isFarFromBottom && scrolled > 300);
    };

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearChat = () => {
    if (confirm("Hapus catatan tafsir mimpi ini?")) {
      setMessages([{
        id: "1",
        role: "assistant",
        text: "Salam sejahtera, Ananda. Ceritakanlah kembali mimpi barumu..."
      }]);
      localStorage.removeItem('primbon_mimpi_history');
    }
  };

  const handleDownload = (msg: ChatMessage) => {
    const text = `[SESEPUH TAFSIR - MIMPI]\n\n${msg.text}\n\n---\nIsyarat ini diterima pada: ${new Date().toLocaleString('id-ID')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tafsir-Mimpi-${msg.id.slice(-5)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (msg: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopyStatus(msg.id);
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks");
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: "user", text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemInstruction = `Kamu adalah Pakar Tafsir Mimpi Nusantara yang bijaksana. 
Gunakan gaya bahasa mistis, tenang, dan mendalam. 
Panggil pengguna dengan sebutan "Ananda".
Tugasmu: Menafsirkan mimpi berdasarkan kearifan lokal Jawa, Primbon, dan filosofi Nusantara.

Kriteria Visual: Deskripsi sangat realistis, gaya fotografi profesional (professional photography), cinematic lighting, golden hour, detail tajam, suasana mistis yang nyata.
Contoh: [VISUAL: a professional high-detail photograph of a giant golden snake in a dark misty jungle, 8k resolution, cinematic lighting, sharp focus]

Interpretasikan simbol-simbol dalam mimpi dengan makna spiritual atau pertanda masa depan.
Berikan nasehat agar Ananda tetap berserah diri kepada Tuhan YME apapun tafsirnya.
Gunakan format Markdown yang indah.`;

      const response = await fetch("/api/custom-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.text })),
          systemInstruction,
          userMessage: userMessage.text
        })
      });

      if (!response.ok) throw new Error("Energi batin sedang terhambat...");

      const data = await response.json();
      let replyText = data.reply || "Sesepuh sedang merenungkan isyarat tersebut...";
      
      // Extract Visual Prompt
      let visualPrompt = "";
      const visualMatch = replyText.match(/\[VISUAL:\s*([^\]]+)\]/);
      if (visualMatch) {
        visualPrompt = visualMatch[1].trim()
          .replace(/[*_#`[\]]/g, "") // Bersihkan karakter markdown/bracket
          .trim();
        replyText = replyText.replace(visualMatch[0], "").trim();
      }

      const assistantMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        text: replyText,
        visualPrompt: visualPrompt || `professional realistic photography of a mystical dream about ${userMessage.text.slice(0, 50)}, high detail, cinematic lighting, 8k resolution`
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        text: "Mohon maaf Ananda, sepertinya tabir ghaib sedang sulit dibuka. Cobalah ceritakan kembali nanti." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col relative bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 transition-colors overflow-hidden">
      <section 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-40 w-full flex flex-col items-center flex-grow"
      >
        <div className="w-full max-w-4xl">
          <div className="mb-10 text-center shrink-0">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 dark:bg-stone-800 rounded-full mb-4 shadow-xl border border-gold-500/30">
              <CloudMoon className="text-gold-500" size={32} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 dark:text-stone-100 tracking-tight">
              Tafsir Mimpi Sesepuh
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-2 max-w-md mx-auto italic">
              "Kembang turu memiliki isyarat bagi mereka yang mampu membaca tanda semesta."
            </p>
          </div>

          <div className="space-y-8">
            {messages.map((msg, index) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                key={msg.id} 
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={cn("flex flex-col w-full", msg.role === 'user' ? "items-end" : "items-start")}
              >
                <div className="flex items-center gap-2 mb-2 px-1">
                  {msg.role === 'assistant' ? (
                    <div className="flex items-center gap-1.5 text-gold-600 dark:text-gold-500 text-xs font-semibold tracking-wider uppercase">
                      <Feather size={12} /> Sesepuh Tafsir
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold tracking-wider uppercase">
                       Ananda <UserCircle size={12} />
                    </div>
                  )}
                </div>
                
                <div className={cn(
                  "p-5 rounded-2xl text-[15px] leading-relaxed relative w-full sm:max-w-[85%]", 
                  msg.role === "user" 
                    ? "bg-stone-800 dark:bg-stone-200 text-stone-50 dark:text-stone-900 rounded-tr-sm ml-auto shadow-lg" 
                    : "bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-sm shadow-sm"
                )}>
                  {msg.role === 'assistant' && <Sparkles size={14} className="absolute -top-2 -left-2 text-gold-500" />}
                  
                  {/* Visual Dream Illustration */}
                  {msg.role === 'assistant' && msg.visualPrompt && (
                    <DreamImage prompt={msg.visualPrompt} seed={msg.id} onZoom={setZoomImage} />
                  )}

                  <div className={cn(
                    "prose prose-stone prose-sm max-w-none",
                    msg.role === 'user' ? "prose-invert dark:prose-neutral" : "dark:prose-invert"
                  )}>
                    <Markdown>{msg.text}</Markdown>
                  </div>

                  {/* Per-message Utilities for Assistant Only */}
                  {msg.role === 'assistant' && msg.id !== '1' && (
                    <div className="mt-6 pt-3 border-t border-stone-100 dark:border-stone-800/50 flex items-center justify-end gap-3">
                       <button 
                          onClick={() => handleCopy(msg)}
                          className="p-1 px-2 rounded-md hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-400 hover:text-gold-600 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                       >
                          {copyStatus === msg.id ? <Check size={12} /> : <Copy size={12} />}
                          {copyStatus === msg.id ? 'Tersalin' : 'Salin'}
                       </button>
                       <button 
                          onClick={() => handleDownload(msg)}
                          className="p-1 px-2 rounded-md hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-400 hover:text-gold-600 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                       >
                          <Download size={12} /> Unduh
                       </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col mr-auto items-start">
                 <div className="flex items-center gap-2 text-gold-600/60 text-[10px] font-bold tracking-widest uppercase px-1">
                   <Loader2 size={12} className="animate-spin" /> Menafsirkan Isyarat...
                 </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      </section>

        {/* Floating Scroll to Bottom Button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={scrollToBottom}
              className="fixed bottom-[140px] right-[20px] md:right-[calc(50%-360px)] z-50 w-12 h-12 bg-white dark:bg-stone-900 text-gold-600 dark:text-gold-500 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-stone-200 dark:border-stone-800 hover:scale-110 transition-all active:scale-95"
              title="Gulir ke dasar"
            >
              <ChevronDown size={28} />
            </motion.button>
          )}
        </AnimatePresence>

      <div className="fixed bottom-16 left-0 right-0 w-full bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-3 sm:px-6 z-40">
        <div className="max-w-4xl mx-auto w-full">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <button 
                type="button"
                onClick={handleClearChat}
                className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-red-500 transition-all shadow-sm active:scale-95 shrink-0"
                title="Hapus Catatan"
             >
                <Trash2 size={20} />
             </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ceritakan mimpimu semalam..."
              className="flex-1 min-h-[56px] max-h-32 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-5 py-4 text-stone-800 dark:text-stone-200 outline-none focus:ring-1 focus:ring-gold-500 shadow-inner resize-none scrollbar-hide text-sm"
              rows={1}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="h-14 w-14 shrink-0 bg-stone-950 dark:bg-stone-100 text-white dark:text-stone-950 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl"
            >
              <Moon size={24} />
            </button>
          </form>
        </div>
      </div>

      {/* Zoom Overlay */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10"
            onClick={() => setZoomImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setZoomImage(null)}
                className="absolute -top-12 right-0 sm:-right-12 text-white/50 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
              
              <img src={zoomImage} alt="Zoomed result" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/10" />

              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-4">
                <button 
                  onClick={async () => {
                    try {
                      const res = await fetch(zoomImage);
                      const blob = await res.blob();
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = `tafsir-mimpi-zoom.jpg`;
                      a.click();
                    } catch (e) { console.error(e); }
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-full font-black text-xs tracking-widest hover:bg-gold-500 hover:text-white transition-all shadow-xl"
                >
                  <Download size={16} /> DOWNLOAD
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
