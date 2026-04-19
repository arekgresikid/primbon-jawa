import React, { useState, useRef, useEffect } from 'react';
import { Send, UserCircle, MessageSquare, Loader2, Feather, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const systemInstruction = `Kamu adalah pakar Primbon Jawa, Weton, watak, kecocokan jodoh, dan penanggalan Jawa.
Jawablah pertanyaan pengguna dengan santun dan ramah menggunakan Bahasa Indonesia yang baik dan benar. DILARANG menggunakan bahasa Jawa.
Berikan penjelasan berdasarkan ilmu Primbon. Selalu akhiri dengan pesan spiritual atau nasehat kebaikan universal.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.slice(1).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMessage.text }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const assistantMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        text: response.text || "Mohon maaf, pesan tidak dapat diproses." 
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
    <div className="w-full flex-1 flex flex-col relative h-[100dvh]">
       {/* Main scrollable chat area */}
       <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 pb-28 w-full flex flex-col items-center">
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
                    <div className="prose prose-stone dark:prose-invert max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start max-w-[80%] mr-auto">
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-tl-sm shadow-sm">
                    <Loader2 size={20} className="text-gold-500 animate-spin" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-4" />
           </div>
         </div>
       </div>

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
