import React, { useState, useRef, useEffect } from 'react';
import { Send, UserCircle, MessageSquare, Loader2, Feather, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export function KonsultasiAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      text: "Halo, salam sejahtera. Saya adalah Asisten AI ahli Primbon. Silakan tanyakan hal-hal seputar Weton, Watak, Kecocokan Jodoh, atau penanggalan secara umum. Ada yang bisa saya bantu hari ini?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Sesepuh sedang bersemedi...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: messages.map(m => ({ 
            role: m.role, 
            content: m.text 
          })),
          systemInstruction,
          userMessage: userMessage.text
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Sistem sedang sibuk atau API Key belum disetel.");
      }

      const data = await response.json();
      let replyText = data.reply || "Sesepuh sedang diam seribu bahasa...";

      // Pembersihan ganda jika masih ada JSON yang tersisa
      if (typeof replyText === 'string' && replyText.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(replyText);
          replyText = parsed.choices?.[0]?.message?.content || parsed.content || replyText;
        } catch (e) {}
      }

      const assistantMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        text: replyText
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
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
    <div className="w-full flex-1 flex flex-col relative">
       {/* Main scrollable chat area */}
        <section className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-40 w-full flex flex-col items-center">
          <div className="w-full max-w-3xl">
           <div className="mb-8 text-center shrink-0">
             <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-3">
               <Feather size={28} className="text-gold-500" />
               Konsultasi Sesepuh AI
             </h2>
             <p className="text-stone-500 dark:text-stone-400 text-sm mt-2">
               Tanya jawab interaktif seputar Primbon, watak & jodoh dari pandangan AI ahli Primbon.
             </p>
             {messages.length > 1 && (
               <button 
                 onClick={handleClearChat}
                 className="mt-4 text-xs flex items-center gap-1 mx-auto text-stone-400 hover:text-red-400 transition-colors"
               >
                 <Trash2 size={14} /> Hapus Percakapan
               </button>
             )}
           </div>

           <div className="space-y-4">
              {messages.map(msg => (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  key={msg.id} 
                  className={cn("flex flex-col max-w-[85%] sm:max-w-[75%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}
                >
                  <div className="flex items-center gap-2 mb-1.5 px-1">
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
                    "p-4 rounded-2xl text-[15px] leading-relaxed", 
                    msg.role === "user" 
                      ? "bg-stone-800 dark:bg-stone-100 text-stone-50 dark:text-stone-900 rounded-tr-sm" 
                      : "bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-sm shadow-sm"
                  )}>
                    <div className={cn(
                      "prose prose-stone max-w-none",
                      msg.role === 'user' 
                        ? "prose-invert dark:prose-neutral" 
                        : "dark:prose-invert"
                    )}>
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col max-w-[80%] mr-auto items-start">
                  <div className="flex items-center gap-1.5 text-gold-600/60 text-[10px] font-bold tracking-widest uppercase mb-1 px-1">
                    <Loader2 size={10} className="animate-spin" /> {loadingMessage}
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-tl-sm shadow-sm font-sans">
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

       {/* Fixed Input Area (Lebar Penuh) */}
       <div className="fixed bottom-16 left-0 right-0 w-full bg-stone-100/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-3 sm:px-6 z-40 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <div className="max-w-3xl mx-auto w-full">
             <form onSubmit={handleSend} className="relative flex items-center gap-2">
               <input
                 type="text"
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => {
                   if (e.key === 'Enter') {
                     e.preventDefault();
                     handleSend();
                   }
                 }}
                 placeholder="Tanya soal weton Rebo Wage..."
                 className="flex-1 h-[52px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 text-stone-800 dark:text-stone-200 outline-none focus:ring-1 focus:ring-gold-500 shadow-sm"
                 autoComplete="off"
               />
               <button 
                 type="submit" 
                 disabled={!input.trim() || isLoading}
                 className="h-[52px] w-[52px] shrink-0 bg-gold-500 hover:bg-gold-600 dark:bg-gold-600 dark:hover:bg-gold-500 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
               >
                 <Send size={20} className="-ml-0.5" />
               </button>
             </form>
          </div>
       </div>
    </div>
  );
}
