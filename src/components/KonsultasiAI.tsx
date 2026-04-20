import React, { useState, useRef, useEffect } from 'react';
import { Send, UserCircle, MessageSquare, Loader2, Feather, Trash2, Download, Copy, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export function KonsultasiAI() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('primbon_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [{
          id: "1",
          role: "assistant",
          text: "Halo, salam sejahtera. Saya adalah Asisten AI ahli Primbon. Silakan tanyakan hal-hal seputar Weton, Watak, Kecocokan Jodoh, atau penanggalan secara umum. Ada yang bisa saya bantu hari ini?"
        }];
      }
    }
    return [{
      id: "1",
      role: "assistant",
      text: "Halo, salam sejahtera. Saya adalah Asisten AI ahli Primbon. Silakan tanyakan hal-hal seputar Weton, Watak, Kecocokan Jodoh, atau penanggalan secara umum. Ada yang bisa saya bantu hari ini?"
    }];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Sesepuh sedang bersemedi...");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check for pending questions from other components
  useEffect(() => {
    const pendingQuestion = localStorage.getItem('primbon_ai_pending_question');
    if (pendingQuestion) {
      setInput(pendingQuestion);
      localStorage.removeItem('primbon_ai_pending_question');
      
      // Auto-send after a short delay to allow UI to settle
      const timer = setTimeout(() => {
        handleSend();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-resize chat input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`;
    }
  }, [input]);

  // Save messages to local storage
  useEffect(() => {
    localStorage.setItem('primbon_chat_history', JSON.stringify(messages));
  }, [messages]);

  const mysticalMessages = [
    "Sesepuh sedang bersemedi...",
    "Merasakan getaran ghaib...",
    "Membuka tabir masa depan...",
    "Menghitung siklus neptu...",
    "Mendengar bisikan semesta...",
    "Menyelaraskan energi batin..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let index = 0;
      setLoadingMessage(mysticalMessages[0]);
      interval = setInterval(() => {
        index = (index + 1) % mysticalMessages.length;
        setLoadingMessage(mysticalMessages[index]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && messages.length > 1) {
        // Scroll ke awal/header pesan asisten
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Scroll ke dasar untuk pesan user
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [messages]);

  useEffect(() => {
    const handleWindowScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      // Tampilkan tombol jika jarak ke bawah > 150px
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
    if (confirm("Hapus semua percakapan?")) {
      setMessages([{
        id: "1",
        role: "assistant",
        text: "Halo, salam sejahtera. Saya adalah Asisten AI ahli Primbon. Silakan tanyakan hal-hal seputar Weton, Watak, Kecocokan Jodoh, atau penanggalan secara umum. Ada yang bisa saya bantu hari ini?"
      }]);
      localStorage.removeItem('primbon_chat_history');
    }
  };

  const handleDownload = (msg: ChatMessage) => {
    const text = `[SESEPUH AI - KONSULTASI]\n\n${msg.text}\n\n---\nGenerasi: ${new Date().toLocaleString('id-ID')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Respon-Sesepuh-${msg.id.slice(-5)}.txt`;
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
      const systemInstruction = `Kamu adalah Sesepuh Primbon Jawa yang bijaksana. 
Panggil pengguna dengan sebutan "Cucu" atau "Ananda". 
Gunakan gaya bahasa seorang kakek/sesepuh yang tenang dan penuh hikmat.
Tugasmu: Menjawab pertanyaan tentang Weton, Watak, Jodoh, dan Kalender Jawa.
Jika ditanya tentang weton tetapi mataharinya (tanggal lahir) belum ada, mintalah tanggal lahirnya dengan sopan.
DILARANG menjawab hal di luar budaya/mistis Jawa.
Selalu berikan nasehat spiritual Jawa yang menenangkan.`;

      const response = await fetch("/api/custom-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.text })),
          systemInstruction,
          userMessage: userMessage.text
        })
      });

      if (!response.ok) throw new Error("Sistem sedang sibuk.");

      const data = await response.json();
      let replyText = data.reply || "Sesepuh sedang diam seribu bahasa...";

      const assistantMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        text: replyText
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        text: "Mohon maaf, sistem sedang sibuk atau mengalami kendala. Silakan coba kirim ulang pertanyaan Anda." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className="w-full flex-1 flex flex-col relative overflow-hidden">
       {/* Main scrollable chat area */}
        <section 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-40 w-full flex flex-col items-center"
        >
          <div className="w-full max-w-3xl">
            <div className="mb-12 text-center shrink-0">
             <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
               <Feather size={28} className="text-gold-500" />
               Konsultasi Sesepuh AI
             </h2>
             <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">
               Tanya jawab interaktif seputar Primbon, watak & jodoh.
             </p>
           </div>

           <div className="space-y-8">
              {messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  key={msg.id} 
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  className={cn("flex flex-col w-full", msg.role === 'user' ? "items-end" : "items-start")}
                >
                  <div className="flex items-center gap-2 mb-2 px-1">
                    {msg.role === 'assistant' ? (
                      <div className="flex items-center gap-1.5 text-gold-600 dark:text-gold-500 text-xs font-semibold tracking-wider uppercase">
                        <Feather size={12} /> Sesepuh AI
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs font-semibold tracking-wider uppercase">
                         Anda <UserCircle size={12} />
                      </div>
                    )}
                  </div>
                  
                  <div className={cn(
                    "p-5 rounded-2xl text-[15px] leading-relaxed max-w-[90%] sm:max-w-[80%]", 
                    msg.role === "user" 
                      ? "bg-stone-800 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-tr-sm" 
                      : "bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-sm shadow-sm"
                  )}>
                    <div className={cn(
                      "prose prose-stone max-w-none",
                      msg.role === 'user' ? "prose-invert dark:prose-neutral" : "dark:prose-invert"
                    )}>
                      <Markdown>{msg.text}</Markdown>
                    </div>

                    {/* Per-message Utilities for Assistant Only */}
                    {msg.role === 'assistant' && msg.id !== '1' && (
                      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/50 flex items-center justify-end gap-3">
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
                  <div className="flex items-center gap-1.5 text-gold-600/60 text-[10px] font-bold tracking-widest uppercase mb-1 px-1">
                    <Loader2 size={10} className="animate-spin" /> {loadingMessage}
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-tl-sm shadow-sm">
                    <div className="flex gap-1">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                    </div>
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

       {/* Fixed Input Area */}
       <div className="fixed bottom-16 left-0 right-0 w-full bg-stone-100/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-3 sm:px-6 z-40 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <div className="max-w-3xl mx-auto w-full">
             <form onSubmit={handleSend} className="relative flex items-center gap-3">
               <button 
                  type="button"
                  onClick={handleClearChat}
                  className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-red-500 transition-all shadow-sm active:scale-95 shrink-0"
                  title="Hapus Chat"
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
                 placeholder="Tanya soal weton..."
                 className="flex-1 min-h-[52px] max-h-32 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3.5 text-stone-800 dark:text-stone-200 outline-none focus:ring-1 focus:ring-gold-500 shadow-sm resize-none scrollbar-hide text-sm"
                 rows={1}
               />
               <button 
                 type="submit" 
                 disabled={!input.trim() || isLoading}
                 className="h-[52px] w-[52px] shrink-0 bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-500 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 shadow-sm"
               >
                 <Send size={20} className="-ml-0.5" />
               </button>
             </form>
          </div>
       </div>
    </div>
  );
}
