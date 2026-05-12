import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Palette, Sparkles, Download, Loader2, Image as ImageIcon, 
  Square, Smartphone, Monitor, Wand2, RefreshCw, 
  ChevronDown, Info, Shield, ShieldOff, Ghost, Settings2, Hash, Ban,
  Languages, ImagePlus, Heart, History, Trash2, Copy, Check, ExternalLink, Layers, Feather, Upload,
  Video, Music, Clock, Play, Maximize2, X, Dices, Image as ImageIcon2
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

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '3:2' | '21:9';

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

const RANDOM_PROMPTS = [
  "A futuristic cyberpunk city with neon lights and flying cars, high detail, 8k, cinematic",
  "A majestic dragon perched on a mountain top, fantasy art, volumetric lighting, hyper-realistic",
  "An underwater lost city with glowing corals and bioluminescent jellyfish, deep sea atmosphere",
  "A cozy cottage in a mystical forest with floating lanterns and fireflies, studio ghibli style",
  "A space explorer standing on a purple planet looking at a giant nebula, cosmic scale, interstellar",
  "A surreal portrait of a person whose hair is made of galaxies and stars, ethereal, dreamlike",
  "An ancient library with floating books and magical dust particles, dark academia aesthetic",
  "A peaceful zen garden with a cherry blossom tree in the middle of a lake, tranquil, minimalist",
  "A robotic cat playing with a holographic ball of yarn in a high-tech room, futuristic, sleek",
  "A steampunk airship flying through a sea of golden clouds at sunset, clockwork details, victorian",
  "Cybernetic samurai in a rain-slicked neo-tokyo street, neon reflections, sharp focus",
  "Whimsical treehouse village connected by rope bridges in a giant oak tree, soft sunlight",
  "Mechanical owl with brass feathers and glowing amber eyes, intricate gears, dark background",
  "Floating islands with waterfalls falling into the void, sunset sky, breathtaking landscape",
  "Abstract flow of colors representing liquid music, vibrant, high contrast, wallpaper"
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
  const [guidance, setGuidance] = useState<number>(7.5);
  const [steps, setSteps] = useState<number>(30);
  const [strength, setStrength] = useState<number>(0.75);

  // Video Advanced Settings
  const [motionBucketId, setMotionBucketId] = useState<number>(127);
  const [fps, setFps] = useState<number>(12);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg'>('png');
  const [styleStrength, setStyleStrength] = useState<number>(1.0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSuccess, setAnalysisSuccess] = useState(false);

  const NEGATIVE_SHORTCUTS = [
    { label: "Low Quality", value: "low quality, blurry, distorted, grainy, pixelated" },
    { label: "Bad Anatomy", value: "extra limbs, malformed hands, fused fingers, bad proportions" },
    { label: "Text/Watermark", value: "text, watermark, signature, logo, copyright, letters" },
    { label: "Unrealistic", value: "unrealistic, plastic, CGI, cartoonish (unless specified)" }
  ];

  // Video Settings
  const [duration, setDuration] = useState(4);
  const [useAudio, setUseAudio] = useState(false);

  const [view, setView] = useState<'create' | 'history' | 'favorites'>('create');
  const [subView, setSubView] = useState<'image' | 'video'>('image');
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const selectedModelData = useMemo(() => allModels.find(m => m.name === selectedModel), [allModels, selectedModel]);
  const isVideoModel = useMemo(() => selectedModelData?.output_modalities.includes('video'), [selectedModelData]);
  
  const filteredModels = useMemo(() => {
    return allModels.filter(m => {
      const isVideo = m.output_modalities?.includes('video');
      const isImage = m.output_modalities?.includes('image');
      return subView === 'video' ? isVideo : isImage;
    });
  }, [allModels, subView]);

  // Sync selected model when subView changes
  useEffect(() => {
    if (filteredModels.length > 0) {
      const currentIsValid = filteredModels.some(m => m.name === selectedModel);
      if (!currentIsValid) {
        setSelectedModel(filteredModels[0].name);
      }
    }
  }, [subView, filteredModels]);

  // Fetch Models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const [imgRes, txtRes] = await Promise.all([
          fetch('https://gen.pollinations.ai/models'),
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

  // Progress Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setGenerationProgress(0);
      interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) return prev;
          return prev + (prev < 60 ? 5 : 2);
        });
      }, 500);
    } else {
      setGenerationProgress(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

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
      case '4:5': return { width: 896, height: 1120 };
      case '3:2': return { width: 1200, height: 800 };
      case '21:9': return { width: 1536, height: 640 };
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

  const compressImage = (base64: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
    return new Promise((resolve) => {
      if (!base64.startsWith('data:image')) {
        resolve(base64); // Not a base64 image (could be a URL)
        return;
      }
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => resolve(base64);
    });
  };

  const handleAnalyzeImage = async (imgUrlOrEvent?: string | React.MouseEvent) => {
    const imgUrl = typeof imgUrlOrEvent === 'string' ? imgUrlOrEvent : undefined;
    let urlToAnalyze = imgUrl || referenceImageUrl;
    if (!urlToAnalyze || typeof urlToAnalyze !== 'string' || !urlToAnalyze.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      // Compress if it's a base64 string
      if (urlToAnalyze.startsWith('data:image')) {
        urlToAnalyze = await compressImage(urlToAnalyze);
      }
      const systemInstruction = "You are a professional prompt engineer. Describe the image provided in detail for a high-quality text-to-image prompt. Return ONLY the descriptive prompt text, no introductory words.";
      
      const response = await fetch("/api/custom-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Describe this image for an AI image prompt:" },
                { type: "image_url", image_url: { url: urlToAnalyze } }
              ]
            }
          ],
          model: selectedTextModel
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.reply || "";
        
        if (text && text.length > 5) {
          setPrompt(text.trim());
          setAnalysisSuccess(true);
          setTimeout(() => setAnalysisSuccess(false), 5000);
        } else {
          throw new Error("AI memberikan respon kosong.");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }
    } catch (err: any) {
      console.error("Image analysis failed:", err);
      alert("Analisis Gagal: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const systemInstruction = `You are a professional prompt engineer. 
Refine the user's prompt for AI image generation:
1. Translate to English if needed.
2. Add descriptive keywords for lighting, atmosphere, and artistic style.
3. DO NOT include technical parameters like aspect ratio, resolution, or seed (handled by UI).
4. Keep the output concise (2-3 powerful sentences).
5. Return ONLY the enhanced text.`;

      const response = await fetch("/api/custom-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction,
          userMessage: `Refine this prompt: ${prompt}`,
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

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_PROMPTS.length);
    setPrompt(RANDOM_PROMPTS[randomIndex]);
  };

  const handleGenerate = async (overridePrompt?: string, overrideSeed?: number) => {
    const targetPrompt = overridePrompt || prompt;
    if (!targetPrompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setGeneratedUrl(null);
    setCurrentMetadata(null);
    
    // Tutup keyboard pada mobile & beri jeda scroll agar layout stabil
    if (typeof window !== 'undefined') {
      (document.activeElement as HTMLElement)?.blur();
      
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }

    let finalPrompt = targetPrompt;
    
    // Auto Translation
    if (autoTranslate && !overridePrompt) {
      setIsTranslating(true);
      finalPrompt = await translatePrompt(targetPrompt);
      setIsTranslating(false);
    }

    // Apply Style Preset (Improved for Flux/Pollinations)
    const styleSuffix = PRESET_STYLES.find(s => s.id === selectedStyle)?.prompt || '';
    // If strength is not 1, we can adjust how many words we use or how we emphasize it
    // For now, let's keep it simple: just append if strength > 0.5
    let promptWithStyle = finalPrompt;
    if (styleStrength > 0.5) {
      promptWithStyle += styleSuffix;
    }

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
    
    params.append('guidance', guidance.toString());
    params.append('steps', steps.toString());
    if (referenceImageUrl.trim()) params.append('strength', strength.toString());
    params.append('format', outputFormat);
    
    if (isVideoModel) {
      params.append('duration', duration.toString());
      params.append('audio', useAudio.toString());
      params.append('videoAspectRatio', aspectRatio);
      params.append('motion_bucket_id', motionBucketId.toString());
      params.append('fps', fps.toString());
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
              
              <div className="flex bg-stone-100 dark:bg-stone-950 p-1.5 rounded-2xl border border-stone-100 dark:border-stone-800">
                <button 
                  onClick={() => setSubView('image')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    subView === 'image' ? "bg-white dark:bg-stone-800 text-gold-600 shadow-sm" : "text-stone-400"
                  )}
                >
                  <ImageIcon size={14} /> Artwork
                </button>
                <button 
                  onClick={() => setSubView('video')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    subView === 'video' ? "bg-white dark:bg-stone-800 text-gold-600 shadow-sm" : "text-stone-400"
                  )}
                >
                  <Video size={14} /> Video AI
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Feather size={14} className="text-gold-500" /> Deskripsi Imajinasi
                  </label>
                  <div className="flex items-center gap-3">
                    {analysisSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-black text-green-500 flex items-center gap-1 mr-auto"
                      >
                        <Sparkles size={12} /> PROMPT GENERATED FROM IMAGE
                      </motion.div>
                    )}
                    <button 
                      onClick={handleRandomize}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-gold-500 hover:text-white transition-all"
                      title="Randomize Prompt"
                    >
                      <Dices size={12} /> RANDOM
                    </button>
                    <button 
                      onClick={handleEnhancePrompt}
                      disabled={!prompt.trim() || isEnhancing}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black transition-all",
                        "bg-gold-500/10 text-gold-600 hover:bg-gold-500 hover:text-white disabled:opacity-30"
                      )}
                    >
                      {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      ENHANCE
                    </button>
                    <button 
                      onClick={() => setAutoTranslate(!autoTranslate)}
                      className={cn(
                        "flex items-center gap-1.5 text-[9px] font-black transition-colors",
                        autoTranslate ? "text-blue-500" : "text-stone-300"
                      )}
                    >
                      <Languages size={12} /> {autoTranslate ? 'ID→EN: ON' : 'ID→EN: OFF'}
                    </button>
                  </div>
                </div>
                <div className="relative group/input">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={subView === 'video' ? "Deskripsikan gerakan video yang Anda inginkan..." : "Apa yang ingin Anda ciptakan hari ini?"}
                    className="w-full h-36 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-3xl p-6 text-[15px] resize-none focus:ring-4 focus:ring-gold-500/5 outline-none transition-all pr-12"
                  />
                  {prompt && (
                    <button 
                      onClick={() => setPrompt('')}
                      className="absolute top-4 right-4 p-2.5 text-stone-400 hover:text-white hover:bg-red-500 bg-stone-100 dark:bg-stone-800 rounded-xl transition-all shadow-sm z-10"
                      title="Hapus Prompt"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  {isTranslating && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-stone-900/60 backdrop-blur-[1px] rounded-3xl flex items-center justify-center gap-3">
                      <Loader2 size={20} className="animate-spin text-blue-500" />
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Translating...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between px-4 py-2 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800/50">
                  <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-gold-500" />
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">AI Text Engine</span>
                  </div>
                  <select 
                    value={selectedTextModel}
                    onChange={(e) => setSelectedTextModel(e.target.value)}
                    className="bg-transparent text-[10px] font-bold text-stone-600 dark:text-stone-300 outline-none cursor-pointer hover:text-gold-600 transition-colors"
                  >
                    {textModels.map(m => (
                      <option key={m.name} value={m.name} className="bg-white dark:bg-stone-900">
                        {(m.name || 'Model').charAt(0).toUpperCase() + (m.name || '').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Reference Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block px-1 flex items-center gap-2">
                    <ImagePlus size={12} /> Image Reference (URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text"
                        value={referenceImageUrl}
                        onChange={(e) => setReferenceImageUrl(e.target.value)}
                        placeholder="Tempel URL atau unggah gambar..."
                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-2xl px-5 py-3.5 text-xs font-medium outline-none focus:ring-2 focus:ring-gold-500/20 transition-all"
                      />
                      {referenceImageUrl && (
                        <button 
                          onClick={() => setReferenceImageUrl('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <label className="cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              setReferenceImageUrl(base64);
                              handleAnalyzeImage(base64); // Auto-analyze on upload
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="p-3.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-500 group-hover:bg-gold-500 group-hover:text-white transition-all">
                        <Upload size={18} />
                      </div>
                    </label>
                  </div>
                  {referenceImageUrl && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-100 dark:border-stone-800">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 bg-white">
                        <img src={referenceImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                      <span className="text-[10px] font-bold text-stone-400 truncate flex-1">{referenceImageUrl}</span>
                      <button 
                        onClick={() => handleAnalyzeImage()}
                        disabled={isAnalyzing}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-stone-300 text-white text-[9px] font-black rounded-lg transition-all flex items-center gap-2"
                      >
                        {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        Analyze
                      </button>
                      <button 
                        onClick={() => {
                          setReferenceImageUrl("");
                          setAnalysisSuccess(false);
                        }}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                        title="Hapus Gambar"
                      >
                        <Trash2 size={14} />
                      </button>
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
                    {filteredModels.map(m => (
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
                    <option value="16:9">16:9 Wide</option>
                    <option value="9:16">9:16 Portrait (Reels)</option>
                    <option value="4:5">4:5 Instagram</option>
                    <option value="3:2">3:2 Classic</option>
                    <option value="21:9">21:9 Ultrawide</option>
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
                        <div className="flex flex-wrap gap-2">
                           {NEGATIVE_SHORTCUTS.map(s => (
                             <button 
                               key={s.label}
                               onClick={() => setNegativePrompt(prev => prev ? `${prev}, ${s.value}` : s.value)}
                               className="px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md text-[8px] font-bold text-stone-500 transition-colors"
                             >
                               + {s.label}
                             </button>
                           ))}
                           {negativePrompt && (
                             <button onClick={() => setNegativePrompt('')} className="px-2 py-1 text-[8px] font-bold text-red-500 hover:underline">Clear</button>
                           )}
                        </div>
                      </div>

                      {selectedStyle !== 'none' && (
                        <div className="space-y-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Style Strength</label>
                            <span className="text-[10px] font-bold text-blue-600">{Math.round(styleStrength * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="2" step="0.1" 
                            value={styleStrength} onChange={(e) => setStyleStrength(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full appearance-none accent-blue-500 cursor-pointer" 
                          />
                          <p className="text-[8px] text-stone-400 italic">Seberapa kuat pengaruh gaya artistik yang dipilih.</p>
                        </div>
                      )}


                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block px-1 flex items-center gap-2">
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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Guidance Scale</label>
                            <span className="text-[10px] font-bold text-gold-600">{guidance}</span>
                          </div>
                          <input 
                            type="range" min="1" max="20" step="0.5" 
                            value={guidance} onChange={(e) => setGuidance(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full appearance-none accent-gold-500 cursor-pointer" 
                          />
                          <p className="text-[8px] text-stone-400 italic">Nilai lebih tinggi = Lebih patuh pada teks.</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Inference Steps</label>
                            <span className="text-[10px] font-bold text-gold-600">{steps}</span>
                          </div>
                          <input 
                            type="range" min="10" max="50" step="1" 
                            value={steps} onChange={(e) => setSteps(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full appearance-none accent-gold-500 cursor-pointer" 
                          />
                          <p className="text-[8px] text-stone-400 italic">Langkah lebih banyak = Lebih detail, tapi lebih lama.</p>
                        </div>
                      </div>

                      {referenceImageUrl && (
                        <div className="space-y-3 p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Ref Image Strength</label>
                            <span className="text-[10px] font-bold text-gold-600">{Math.round(strength * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.01" 
                            value={strength} onChange={(e) => setStrength(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full appearance-none accent-gold-500 cursor-pointer" 
                          />
                          <p className="text-[8px] text-stone-400 italic">Seberapa mirip hasil akhir dengan gambar referensi.</p>
                        </div>
                      )}

                      <div className="space-y-4 border-t border-stone-100 dark:border-stone-800 pt-4">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block px-1">Output Format</label>
                        <div className="flex gap-2">
                           {['png', 'jpg'].map(fmt => (
                             <button 
                               key={fmt}
                               onClick={() => setOutputFormat(fmt as any)}
                               className={cn(
                                 "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                 outputFormat === fmt ? "bg-stone-900 text-white border-stone-900" : "bg-stone-50 dark:bg-stone-950 border-stone-100 dark:border-stone-800 text-stone-400"
                               )}
                             >
                               {fmt}
                             </button>
                           ))}
                        </div>
                      </div>

                      {isVideoModel && (
                        <div className="space-y-6 border-t border-stone-100 dark:border-stone-800 pt-6">
                           <div className="space-y-3">
                              <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Motion Bucket ID</label>
                                <span className="text-[10px] font-bold text-gold-600">{motionBucketId}</span>
                              </div>
                              <input 
                                type="range" min="0" max="255" step="1" 
                                value={motionBucketId} onChange={(e) => setMotionBucketId(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full appearance-none accent-gold-500 cursor-pointer" 
                              />
                              <p className="text-[8px] text-stone-400 italic">Nilai lebih tinggi = Gerakan lebih intens.</p>
                           </div>
                           <div className="space-y-3">
                              <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">FPS (Smoothness)</label>
                                <span className="text-[10px] font-bold text-gold-600">{fps}</span>
                              </div>
                              <input 
                                type="range" min="8" max="24" step="1" 
                                value={fps} onChange={(e) => setFps(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full appearance-none accent-gold-500 cursor-pointer" 
                              />
                              <p className="text-[8px] text-stone-400 italic">Frame per detik. Nilai lebih tinggi = Video lebih mulus.</p>
                           </div>
                        </div>
                      )}
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

          <div className="lg:col-span-7 space-y-8" ref={resultRef}>
            <div className="bg-white dark:bg-stone-900 rounded-[3rem] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center relative bg-stone-50 dark:bg-stone-950/50">
                <AnimatePresence mode="wait">
                  {generatedUrl ? (
                    <motion.div key={generatedUrl} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative group">
                      {currentMetadata?.type === 'video' ? (
                        <video src={generatedUrl} controls autoPlay loop className="w-full h-full object-contain" />
                      ) : (
                        <img src={generatedUrl} alt="Result" className="w-full h-full object-contain" />
                      )}
                      <div className="absolute top-4 right-4 flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
                        <button 
                          onClick={() => setZoomImage(generatedUrl)} 
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/90 backdrop-blur text-stone-900 flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-white transition-all"
                          title="Zoom"
                        >
                          <Maximize2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDownload(generatedUrl, currentMetadata?.type || 'image')} 
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/90 backdrop-blur text-stone-900 flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-white transition-all"
                          title="Download"
                        >
                          <Download size={20} />
                        </button>
                        <button 
                          onClick={() => toggleFavorite(currentMetadata!)} 
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl backdrop-blur flex items-center justify-center shadow-lg transition-all", 
                            favorites.some(f => f.url === generatedUrl) ? "bg-red-500 text-white" : "bg-white/90 text-stone-900 hover:bg-red-50"
                          )}
                          title="Favorite"
                        >
                          <Heart size={20} fill={favorites.some(f => f.url === generatedUrl) ? "white" : "none"} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 text-stone-300 dark:text-stone-800 p-10 w-full max-w-sm">
                      <div className="relative">
                        {isVideoModel ? <Video size={80} className={isGenerating ? "animate-pulse text-gold-500/20" : ""} /> : <ImageIcon size={80} className={isGenerating ? "animate-pulse text-gold-500/20" : ""} />}
                        {isGenerating && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -inset-4 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"
                          />
                        )}
                      </div>
                      <div className="space-y-4 w-full text-center">
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] block">
                          {isGenerating ? "Sedang Memproses Karya..." : "Studio Siap Digunakan"}
                        </span>
                        {isGenerating && (
                          <div className="space-y-2">
                             <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                               <motion.div 
                                 className="h-full bg-gold-500"
                                 initial={{ width: 0 }}
                                 animate={{ width: `${generationProgress}%` }}
                               />
                             </div>
                             <span className="text-[10px] font-black text-gold-600 dark:text-gold-500">{generationProgress}%</span>
                          </div>
                        )}
                      </div>
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
                  <button onClick={() => setZoomImage(item.url)} className="p-3 bg-white rounded-xl text-stone-900 hover:bg-gold-500 hover:text-white transition-all"><Maximize2 size={18} /></button>
                  <button onClick={() => handleDownload(item.url, item.type)} className="p-3 bg-white rounded-xl text-stone-900 hover:bg-gold-500 hover:text-white transition-all"><Download size={18} /></button>
                  <button onClick={() => {
                    setPrompt(item.originalPrompt);
                    setSelectedModel(item.model);
                    setView('create');
                  }} className="px-4 py-2 bg-white text-stone-900 rounded-full font-black text-[9px] tracking-widest hover:bg-gold-500 hover:text-white transition-all">REUSE</button>
                </div>
                {item.type === 'video' && <div className="absolute top-2 left-2 p-1 bg-black/50 rounded text-[8px] text-white font-bold uppercase tracking-widest flex items-center gap-1"><Play size={8} /> Video</div>}
              </div>
            ))}
          </div>
        </div>
      )}
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
              
              {zoomImage.includes('type=video') || (currentMetadata?.type === 'video' && zoomImage === generatedUrl) ? (
                <video src={zoomImage} controls autoPlay loop className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" />
              ) : (
                <img src={zoomImage} alt="Zoomed result" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain" />
              )}

              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-4">
                <button 
                  onClick={() => handleDownload(zoomImage, (zoomImage.includes('type=video') || currentMetadata?.type === 'video') ? 'video' : 'image')}
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
