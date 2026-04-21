import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Palette, Sparkles, Download, Loader2, Image as ImageIcon, 
  Square, Smartphone, Monitor, Wand2, RefreshCw, 
  ChevronDown, Info, Shield, ShieldOff, Ghost, Settings2, Hash, Ban,
  Languages, ImagePlus, Heart, History, Trash2, Copy, Check, ExternalLink, Layers, Feather,
  Video, Music, Clock, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SEO } from './SEO';

interface Model {
  name: string;
  description: string;
  output_modalities: string[];
}

interface GenerationMetadata {
  url: string;
  prompt: string;
  originalPrompt: string;
  model: string;
  seed: number;
  width: number;
  height: number;
  timestamp: number;
  style?: string;
  type: 'image' | 'video';
}

type AspectRatio = '1:1' | '16:9' | '9:16';

const PRESET_STYLES = [
  { id: 'none', label: 'None', prompt: '' },
  { id: 'cinematic', label: 'Cinematic', prompt: ', cinematic lighting, highly detailed, professional photography, 8k resolution' },
  { id: 'cyberpunk', label: 'Cyberpunk', prompt: ', futuristic neon lights, synthwave aesthetic, intricate details, moody atmosphere' },
  { id: 'anime', label: 'Anime/Manga', prompt: ', high-quality anime style, vibrant colors, expressive features, clean lines' },
  { id: 'oil', label: 'Oil Painting', prompt: ', classical oil painting, textured brushstrokes, rich colors, canvas texture' },
  { id: '3d', label: '3D Render', prompt: ', unreal engine 5 render, octane render, Ray Tracing, hyper-realistic, photorealistic' },
  { id: 'watercolor', label: 'Watercolor', prompt: ', dreamy watercolor painting, soft edges, ink splashes, artistic paper texture' },
  { id: 'fantasy', label: 'Dark Fantasy', prompt: ', ethereal dark fantasy art, epic scale, magical atmosphere, intricate character design' },
  { id: 'vintage', label: 'Vintage/Retro', prompt: ', 1970s film aesthetic, grain, faded colors, nostalgic vibe' },
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [textModels, setTextModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState("flux");
  const [selectedTextModel, setSelectedTextModel] = useState("openai");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [currentMetadata, setCurrentMetadata] = useState<GenerationMetadata | null>(null);
  
  const [history, setHistory] = useState<GenerationMetadata[]>(() => {
    try {
      const saved = localStorage.getItem('studio_image_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [favorites, setFavorites] = useState<GenerationMetadata[]>(() => {
    try {
      const saved = localStorage.getItem('studio_image_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [negativePrompt, setNegativePrompt] = useState("");
  const [seed, setSeed] = useState<number>(-1);
  const [isSafe, setIsSafe] = useState(true);
  const [isTransparent, setIsTransparent] = useState(false);
  const [noLogo, setNoLogo] = useState(true);
  const [quality, setQuality] = useState("high");
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [autoTranslate, setAutoTranslate] = useState(true);

  // Video Settings
  const [duration, setDuration] = useState(4);
  const [useAudio, setUseAudio] = useState(false);

  const [view, setView] = useState<'create' | 'history' | 'favorites'>('create');

  const selectedModelData = useMemo(() => allModels.find(m => m.name === selectedModel), [allModels, selectedModel]);
  const isVideoModel = useMemo(() => selectedModelData?.output_modalities.includes('video'), [selectedModelData]);

  // Fetch Models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const [imgRes, txtRes] = await Promise.all([
          fetch('https://gen.pollinations.ai/image/models'),
          fetch('https://gen.pollinations.ai/text/models')
        ]);
        const imgData = await imgRes.json();
        const txtData = await txtRes.json();
        setAllModels(imgData);
        setTextModels(txtData);
      } catch (err) {
        console.error("Failed to fetch models", err);
      }
    };
    fetchModels();
  }, []);

  // Sync Storage
  useEffect(() => {
    localStorage.setItem('studio_image_history', JSON.stringify(history.slice(0, 50)));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('studio_image_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const getDimensions = () => {
    switch (aspectRatio) {
      case '1:1': return { width: 1024, height: 1024 };
      case '16:9': return { width: 1280, height: 720 };
      case '9:16': return { width: 720, height: 1280 };
      default: return { width: 1024, height: 1024 };
    }
  };

  const translatePrompt = async (text: string) => {
    if (!text.trim()) return text;
    try {
      const response = await fetch("/api/custom-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [],
          systemInstruction: "You are a translator. Translate the following text to English for AI image generation prompt. Return ONLY the translated text.",
          userMessage: text,
          model: selectedTextModel
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.reply.trim();
      }
    } catch (err) {
      console.error("Translation failed", err);
    }
    return text;
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const systemInstruction = "You are a professional prompt engineer. Expand the user's prompt into a detailed, high-quality description for AI media generation. Return ONLY the enhanced text.";
      const response = await fetch("/api/custom-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [],
          systemInstruction,
          userMessage: prompt,
          model: selectedTextModel
        })
      });
      if (response.ok) {
        const data = await response.json();
        setPrompt(data.reply.trim());
      }
    } catch (err) {
      console.error("Enhance failed", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async (overridePrompt?: string, overrideSeed?: number) => {
    const targetPrompt = overridePrompt || prompt;
    if (!targetPrompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setGeneratedUrl(null);
    setCurrentMetadata(null);

    let finalPrompt = targetPrompt;
    
    // Auto Translation
    if (autoTranslate && !overridePrompt) {
      setIsTranslating(true);
      finalPrompt = await translatePrompt(targetPrompt);
      setIsTranslating(false);
    }

    // Apply Style Preset
    const styleSuffix = PRESET_STYLES.find(s => s.id === selectedStyle)?.prompt || '';
    const promptWithStyle = finalPrompt + styleSuffix;

    const { width, height } = getDimensions();
    const finalSeed = overrideSeed !== undefined ? overrideSeed : (seed === -1 ? Math.floor(Math.random() * 2147483647) : seed);
    const accessToken = localStorage.getItem('studio_access_token') || "";
    
    const params = new URLSearchParams({
      prompt: promptWithStyle,
      model: selectedModel,
      width: width.toString(),
      height: height.toString(),
      seed: finalSeed.toString(),
      enhance: "true",
      safe: isSafe.toString(),
      transparent: isTransparent.toString(),
      nologo: noLogo.toString(),
      quality,
      access_token: accessToken
    });

    if (negativePrompt.trim()) params.append('negative_prompt', negativePrompt.trim());
    if (referenceImageUrl.trim()) params.append('image', referenceImageUrl.trim());
    
    if (isVideoModel) {
      params.append('duration', duration.toString());
      params.append('audio', useAudio.toString());
      params.append('videoAspectRatio', aspectRatio);
    }

    const proxyUrl = `/api/image-proxy?${params.toString()}`;

    try {
      // For images, we can preload. For videos, we just trust the URL.
      if (!isVideoModel) {
        const img = new Image();
        img.src = proxyUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error("Image failed"));
        });
      }
      
      const meta: GenerationMetadata = {
        url: proxyUrl,
        prompt: promptWithStyle,
        originalPrompt: targetPrompt,
        model: selectedModel,
        seed: finalSeed,
        width,
        height,
        timestamp: Date.now(),
        style: selectedStyle,
        type: isVideoModel ? 'video' : 'image'
      };

      setGeneratedUrl(proxyUrl);
      setCurrentMetadata(meta);
      setHistory(prev => [meta, ...prev]);
      if (view === 'create') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert("Gagal membuat karya. Silakan coba model lain.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = (item: GenerationMetadata) => {
    const isFav = favorites.some(f => f.url === item.url);
    if (isFav) {
      setFavorites(prev => prev.filter(f => f.url !== item.url));
    } else {
      setFavorites(prev => [item, ...prev]);
    }
  };

  const handleDownload = async (url: string, type: 'image' | 'video') => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `studio-ai-${Date.now()}.${type === 'video' ? 'mp4' : 'jpg'}`;
      a.click();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-40 px-4 sm:px-6 pt-4 flex flex-col gap-8 relative">
      <SEO 
        title="AI Studio | Image & Video Creator"
        description="Studio kreatif berbasis AI dengan dukungan pembuatan gambar dan video profesional."
      />

      <header className="flex flex-col items-center gap-6">
        <div className="text-center space-y-2">
          <h2 className="text-4xl sm:text-6xl font-black text-stone-900 dark:text-stone-100 italic tracking-tighter">
            AI Studio
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-[0.3em]">Visual & Motion Creation</p>
        </div>

        <div className="flex bg-stone-100 dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800">
           {[
             { id: 'create', label: 'Create', icon: Palette },
             { id: 'history', label: 'History', icon: History },
             { id: 'favorites', label: 'Favorites', icon: Heart },
           ].map((v) => (
             <button 
               key={v.id}
               onClick={() => setView(v.id as any)}
               className={cn(
                 "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all",
                 view === v.id 
                  ? "bg-white dark:bg-stone-800 text-gold-600 dark:text-gold-500 shadow-sm"
                  : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
               )}
             >
               <v.icon size={14} /> {v.label}
             </button>
           ))}
        </div>
      </header>

      {view === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 p-8 shadow-2xl shadow-stone-200/40 dark:shadow-none space-y-8">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Feather size={14} className="text-gold-500" /> Deskripsi Imajinasi
                  </label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setAutoTranslate(!autoTranslate)}
                      className={cn(
                        "flex items-center gap-1.5 text-[9px] font-black transition-colors",
                        autoTranslate ? "text-blue-500" : "text-stone-300"
                      )}
                    >
                      <Languages size={12} /> {autoTranslate ? 'ID→EN: ON' : 'ID→EN: OFF'}
                    </button>
                    <button 
                      onClick={handleEnhancePrompt}
                      disabled={!prompt.trim() || isEnhancing}
                      className="flex items-center gap-1.5 text-[9px] font-black text-gold-600 dark:text-gold-500 hover:text-gold-700 disabled:opacity-30"
                    >
                      {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      ENHANCE
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Apa yang ingin Anda ciptakan hari ini?"
                    className="w-full h-36 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-3xl p-6 text-[15px] resize-none focus:ring-4 focus:ring-gold-500/5 outline-none transition-all"
                  />
                  {isTranslating && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-stone-900/60 backdrop-blur-[1px] rounded-3xl flex items-center justify-center gap-3">
                      <Loader2 size={20} className="animate-spin text-blue-500" />
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Translating...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block px-1">Model Engine</label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl px-4 py-3.5 text-xs font-bold outline-none cursor-pointer"
                  >
                    {allModels.map(m => (
                      <option key={m.name} value={m.name}>
                        {m.output_modalities.includes('video') ? '🎥 ' : '🖼️ '}
                        {(m.name || 'Model').charAt(0).toUpperCase() + (m.name || '').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block px-1">Format Layout</label>
                  <select 
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl px-4 py-3.5 text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Portrait</option>
                  </select>
                </div>
              </div>

              {isVideoModel && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block px-1 flex items-center gap-2">
                      <Clock size={12} /> Durasi (s)
                    </label>
                    <select 
                      value={duration} 
                      onChange={e => setDuration(parseInt(e.target.value))}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl px-4 py-3.5 text-xs font-bold outline-none cursor-pointer"
                    >
                      {[2, 4, 6, 8, 10, 12, 15].map(d => (
                        <option key={d} value={d}>{d} Detik</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block px-1 flex items-center gap-2">
                      <Music size={12} /> Audio
                    </label>
                    <button 
                      onClick={() => setUseAudio(!useAudio)}
                      className={cn(
                        "w-full py-3.5 rounded-2xl border font-bold text-xs transition-all",
                        useAudio ? "bg-gold-500 text-white border-transparent shadow-lg shadow-gold-500/20" : "bg-stone-50 dark:bg-stone-950 border-stone-100 dark:border-stone-800 text-stone-400"
                      )}
                    >
                      {useAudio ? 'GENERATE AUDIO: ON' : 'AUDIO: OFF'}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block px-1">Gaya Artistik</label>
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl px-4 py-3.5 text-xs font-bold outline-none cursor-pointer hover:border-gold-300 transition-colors"
                >
                  {PRESET_STYLES.map(style => (
                    <option key={style.id} value={style.id}>{style.label}</option>
                  ))}
                </select>
              </div>

              {/* Quick Toggles: Safe, Transparent, Private */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsSafe(!isSafe)} 
                  className={cn(
                    "flex-1 p-3 rounded-2xl border text-[10px] font-black transition-all flex items-center justify-center gap-2", 
                    isSafe ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-red-500/10 border-red-500/20 text-red-600"
                  )}
                >
                  {isSafe ? <Shield size={14} /> : <ShieldOff size={14} />} {isSafe ? 'SAFE' : 'UNSAFE'}
                </button>
                <button 
                  onClick={() => setIsTransparent(!isTransparent)} 
                  className={cn(
                    "flex-1 p-3 rounded-2xl border text-[10px] font-black transition-all flex items-center justify-center gap-2", 
                    isTransparent ? "bg-gold-500/10 border-gold-500/30 text-gold-600" : "bg-stone-50 dark:bg-stone-950 border-stone-100 dark:border-stone-800 text-stone-400"
                  )}
                >
                  <Ghost size={14} /> {isTransparent ? 'TRANS' : 'OPAQUE'}
                </button>
                <button 
                  onClick={() => setNoLogo(!noLogo)} 
                  className={cn(
                    "flex-1 p-3 rounded-2xl border text-[10px] font-black transition-all flex items-center justify-center gap-2", 
                    noLogo ? "bg-blue-500/10 border-blue-500/20 text-blue-600" : "bg-stone-50 dark:bg-stone-950 border-stone-100 dark:border-stone-800 text-stone-400"
                  )}
                >
                  <Shield size={14} className={noLogo ? "fill-current" : ""} /> {noLogo ? 'PRIVATE' : 'PUBLIC'}
                </button>
              </div>

              <div className="border-t border-stone-100 dark:border-stone-800 pt-6">
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] hover:text-gold-600 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Settings2 size={16} /> Advanced Settings
                  </div>
                  <ChevronDown size={16} className={cn("transition-transform", showAdvanced && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-6 pt-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <Ban size={12} /> Negative Prompt
                        </label>
                        <input type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Apa yang ingin dihindari?" className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-xl px-4 py-3 text-xs outline-none" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <ImagePlus size={12} /> {isVideoModel ? 'Initial Frame URL (Start Image)' : 'Reference Image URL'}
                        </label>
                        <input type="url" value={referenceImageUrl} onChange={(e) => setReferenceImageUrl(e.target.value)} placeholder="Paste URL gambar di sini..." className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-xl px-4 py-3 text-xs outline-none" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2"><Hash size={12} /> Seed</label>
                          <input type="number" value={seed} onChange={(e) => setSeed(parseInt(e.target.value))} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-xl px-4 py-2.5 text-xs outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Quality</label>
                          <select value={quality} onChange={e => setQuality(e.target.value)} className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-xl px-4 py-2.5 text-xs outline-none">
                            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="hd">Ultra HD</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => handleGenerate()}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-5 bg-stone-900 dark:bg-gold-600 hover:bg-black dark:hover:bg-gold-500 text-white rounded-3xl font-black text-sm tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-[0.97] disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : (isVideoModel ? <Video size={20} /> : <Palette size={20} />)}
                {isGenerating ? "GENERATING..." : (isVideoModel ? "CREATE AI VIDEO" : "GENERATE ARTWORK")}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-stone-900 rounded-[3rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center relative bg-stone-50 dark:bg-stone-950/50">
                <AnimatePresence mode="wait">
                  {generatedUrl ? (
                    <motion.div key={generatedUrl} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative group">
                      {currentMetadata?.type === 'video' ? (
                        <video src={generatedUrl} controls autoPlay loop className="w-full h-full object-contain" />
                      ) : (
                        <img src={generatedUrl} alt="Result" className="w-full h-full object-contain" />
                      )}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button onClick={() => handleDownload(generatedUrl, currentMetadata?.type || 'image')} className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur text-stone-900 flex items-center justify-center shadow-lg"><Download size={20} /></button>
                        <button onClick={() => toggleFavorite(currentMetadata!)} className={cn("w-12 h-12 rounded-xl backdrop-blur flex items-center justify-center shadow-lg", favorites.some(f => f.url === generatedUrl) ? "bg-red-500 text-white" : "bg-white/90 text-stone-900")}><Heart size={20} fill={favorites.some(f => f.url === generatedUrl) ? "white" : "none"} /></button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 text-stone-300 dark:text-stone-800">
                      <div className="relative">
                        {isVideoModel ? <Video size={80} className={isGenerating ? "animate-pulse text-gold-500/20" : ""} /> : <ImageIcon size={80} className={isGenerating ? "animate-pulse text-gold-500/20" : ""} />}
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.4em]">{isGenerating ? "Menenun Frame Semesta..." : "Studio Siap Berkarya"}</span>
                    </div>
                  )}
                </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 italic">{view === 'history' ? 'Riwayat' : 'Favorit'}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(view === 'history' ? history : favorites).map((item, i) => (
              <div key={i} className="group bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all relative">
                {item.type === 'video' ? (
                  <video src={item.url} muted className="w-full aspect-square object-cover" onMouseEnter={e => e.currentTarget.play()} onMouseLeave={e => {e.currentTarget.pause(); e.currentTarget.currentTime = 0;}} />
                ) : (
                  <img src={item.url} className="w-full aspect-square object-cover" />
                )}
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleDownload(item.url, item.type)} className="p-3 bg-white rounded-xl text-stone-900 hover:bg-gold-500 hover:text-white transition-all"><Download size={18} /></button>
                  <button onClick={() => {
                    setPrompt(item.originalPrompt);
                    setSelectedModel(item.model);
                    setView('create');
                  }} className="px-4 py-2 bg-white text-stone-900 rounded-full font-black text-[9px] tracking-widest">REUSE</button>
                </div>
                {item.type === 'video' && <div className="absolute top-2 left-2 p-1 bg-black/50 rounded text-[8px] text-white font-bold uppercase tracking-widest flex items-center gap-1"><Play size={8} /> Video</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
