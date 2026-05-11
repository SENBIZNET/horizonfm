import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Calendar, TrendingUp, Info, Radio as RadioIcon, Home as HomeIcon, Tv, Newspaper, ChevronLeft, ChevronRight, Headphones, Youtube as YoutubeIcon, Video, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsService } from '../services/newsService';
import { NewsItem } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RegionSelector } from '../components/RegionSelector';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamUrl = "http://stream.zeno.fm/utf24ggk4reuv";

  const mobileSlides = [
    { id: 1, url: "/uploads/mobile slide1.png" },
    { id: 2, url: "/uploads/mobile slide2.png" },
    { id: 3, url: "/uploads/mobile slid 3.png" },
  ];

  // Auto-advance mobile slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMobileSlide((prev) => (prev + 1) % mobileSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [mobileSlides.length]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await newsService.getLatestNews(12);
        const publishedNews = news.filter(item => item.status === 'published' || !item.status);
        setLatestNews(publishedNews);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedPodcast, setSelectedPodcast] = useState<{title: string, author: string, image: string, duration: string, audioUrl: string} | null>(null);
  const [isPodcastPlaying, setIsPodcastPlaying] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Conakry');
  const podcastAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (selectedPodcast) {
      setIsPodcastPlaying(true);
      if (podcastAudioRef.current) {
        podcastAudioRef.current.play().catch(err => console.error("Podcast play error:", err));
      }
    } else {
      setIsPodcastPlaying(false);
      if (podcastAudioRef.current) {
        podcastAudioRef.current.pause();
      }
    }
  }, [selectedPodcast]);

  const togglePodcastPlay = () => {
    if (!podcastAudioRef.current) return;
    if (isPodcastPlaying) {
      podcastAudioRef.current.pause();
    } else {
      podcastAudioRef.current.play();
    }
    setIsPodcastPlaying(!isPodcastPlaying);
  };

  const featuredSlides = [
    {
      id: 'official-banner',
      thumbnailUrl: "/uploads/slide1.png",
      title: "HORIZON MEDIAS",
      category: "Média de la démocratie et de l'Espoir",
      link: "/radio",
      buttonText: "Écouter en Direct"
    },
    {
      id: 'fete-banner',
      thumbnailUrl: "/uploads/fete.png",
      title: "VIVEZ VOTRE PASSION",
      category: "Événements",
      link: "/archives",
      buttonText: "Voir plus"
    },
    {
      id: 'joie-banner',
      thumbnailUrl: "/uploads/joie.png",
      title: "LA JOIE DE VIVRE",
      category: "Culture",
      link: "/news",
      buttonText: "Découvrir"
    },
    {
      id: 'guinee-banner',
      thumbnailUrl: "/uploads/guinee2.png",
      title: "NOTRE BELE GUINÉE",
      category: "Patrimoine",
      link: "/news",
      buttonText: "Explorez"
    }
  ];

  // Auto-advance slider
  useEffect(() => {
    if (featuredSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredSlides.length]);

  const regionData: Record<string, { url: string, color: string }> = {
    'Conakry': { url: "http://stream.zeno.fm/utf24ggk4reuv", color: "#ffbe0b" },
    'Kankan': { url: "http://stream.zeno.fm/utf24ggk4reuv", color: "#6c5ce7" },
    'Kindia': { url: "http://stream.zeno.fm/utf24ggk4reuv", color: "#00b894" }
  };

  const currentStream = regionData[selectedRegion].url;
  const themeColor = regionData[selectedRegion].color;

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = currentStream;
      audioRef.current.load();
      audioRef.current.play().catch(e => {
        if (e.name !== 'AbortError') {
          console.error("Playback error on region change:", e);
        }
      });
    }
  }, [selectedRegion]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = currentStream;
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Playback error:", error);
      }
      setIsPlaying(false);
    }
  };
  return (
    <div className="lg:space-y-12 h-screen lg:h-auto overflow-hidden lg:overflow-visible">
      
      {/* Mobile Special Slider */}
      <section className="block lg:hidden relative h-screen w-full overflow-hidden bg-slate-900 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMobileSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src={mobileSlides[currentMobileSlide].url} 
              alt={`Mobile Slide ${currentMobileSlide + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
        
        {/* Mobile Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {mobileSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMobileSlide(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentMobileSlide === index ? 'w-8 bg-brand-primary shadow-[0_0_10px_rgba(255,190,11,0.5)]' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Quick Links Nav - Mobile Overlay - Restored and Fixed position */}
        <div className="fixed bottom-10 left-0 right-0 flex justify-center items-center gap-4 z-50 px-6">
          <Link to="/" className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all active:scale-90 shadow-2xl">
            <HomeIcon size={28} />
          </Link>
          <Link to="/radio" className="w-16 h-16 rounded-2xl bg-brand-primary border border-white/20 flex items-center justify-center text-white transition-all active:scale-90 shadow-2xl">
            <RadioIcon size={28} />
          </Link>
          <Link to="/live" className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all active:scale-90 shadow-2xl">
            <Tv size={28} />
          </Link>
          <Link to="/news" className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all active:scale-90 shadow-2xl">
            <Newspaper size={28} />
          </Link>
        </div>
      </section>

      {/* Hero Section - Featured Slider */}
      <section className="hidden lg:block relative h-[calc(100dvh-4rem)] lg:h-[550px] lg:rounded-3xl rounded-none lg:overflow-hidden overflow-hidden group lg:border border-white/10 border-none bg-slate-950">
        <AnimatePresence mode="wait">
          {newsLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900 animate-pulse"
            />
          ) : (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img 
                src={featuredSlides[currentSlide]?.thumbnailUrl || "/uploads/fffd.jpg"} 
                alt={featuredSlides[currentSlide]?.title || "Featured"} 
                className="w-full h-full object-cover transition-transform duration-[10000ms] scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 lg:bottom-10 lg:left-12 lg:translate-x-0">
          {featuredSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentSlide === index ? 'w-8 bg-brand-primary' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Slider Arrows */}
        {featuredSlides.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-20 lg:hidden group-hover:flex">
            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length)}
              className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-primary transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredSlides.length)}
              className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-primary transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
        
        <div className="absolute bottom-12 lg:bottom-16 left-6 lg:left-12 right-6 lg:right-12 flex flex-col lg:flex-row lg:items-end gap-8 z-10 pointer-events-none">
          {/* Column 1: Text Content */}
          <div className="flex-1 lg:flex-[3] space-y-4 lg:space-y-6 pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {featuredSlides[currentSlide] ? (
                  <div className="space-y-4 lg:space-y-6 max-w-4xl">
                    {featuredSlides[currentSlide].id !== 'official-banner' && (
                      <div className="inline-flex items-center gap-2 bg-brand-primary text-white text-[10px] lg:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-lg">
                        <TrendingUp size={14} />
                        EN VEDETTE • {featuredSlides[currentSlide].category}
                      </div>
                    )}
                    <h1 className="font-display font-extrabold leading-[1.1] text-white space-y-2 lg:space-y-4">
                      <span className="text-3xl lg:text-7xl block drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] line-clamp-3 uppercase tracking-tighter bg-black/20 backdrop-blur-sm lg:bg-transparent px-4 lg:px-0 py-2 lg:py-0 rounded-2xl">
                        {featuredSlides[currentSlide].title}
                      </span>
                      {featuredSlides[currentSlide].id === 'official-banner' && (
                        <div className="space-y-1 lg:space-y-2">
                          <span className="text-xl lg:text-3xl block text-white bg-brand-primary/95 backdrop-blur-md px-4 lg:px-6 py-1 lg:py-2 rounded-xl shadow-xl w-fit uppercase tracking-tighter">
                            Média de la Démocratie
                          </span>
                          <span className="text-xl lg:text-3xl block text-white bg-brand-primary/95 backdrop-blur-md px-4 lg:px-6 py-1 lg:py-2 rounded-xl shadow-xl w-fit uppercase tracking-tighter font-black">
                            et de l'Espoir
                          </span>
                        </div>
                      )}
                    </h1>
                    {/* Button removed as requested */}
                  </div>
                ) : (
                  <div className="space-y-4 lg:space-y-6 max-w-5xl">
                    <h1 className="font-display font-extrabold leading-tight text-white">
                      <span className="text-4xl lg:text-7xl bg-black/50 backdrop-blur-md lg:bg-black/40 px-6 lg:px-8 rounded-2xl inline-block mb-3 lg:mb-4 shadow-2xl border border-white/5">
                        HORIZON MEDIAS:
                      </span> 
                      <br />
                      <span className="text-xl lg:text-6xl text-white bg-brand-primary/90 backdrop-blur-md px-6 lg:px-8 rounded-2xl py-2 lg:py-3 shadow-2xl inline-block mb-2 lg:mb-4 uppercase tracking-tighter">
                        Média de la démocratie
                      </span>
                      <br />
                      <span className="text-xl lg:text-6xl text-white bg-brand-primary/90 backdrop-blur-md px-6 lg:px-8 rounded-2xl py-2 lg:py-3 shadow-2xl inline-block uppercase tracking-tighter font-black">
                        et de l'Espoir
                      </span>
                    </h1>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Quick Links Nav - Hidden on Desktop as requested */}
          </div>

          {/* Column 2: Radio Player (1/4 on Large screens) */}
          <div className="hidden lg:block lg:flex-1 min-w-[300px] space-y-4 pointer-events-auto">
             <div className="px-2">
               <RegionSelector 
                 selectedRegion={selectedRegion} 
                 onRegionChange={setSelectedRegion} 
                 variant="dark"
               />
             </div>
             <audio ref={audioRef} src={currentStream} crossOrigin="anonymous" />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden group/radio"
             >
                {/* Visualizer Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end gap-1 px-4">
                    {[...Array(20)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ 
                          height: isPlaying ? [10, 40, 15, 60, 20] : 4
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1 + Math.random(), 
                          delay: i * 0.05 
                        }}
                        className="flex-1 bg-white/20 rounded-t-full"
                      />
                    ))}
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-5">
                  <motion.div 
                    animate={{ 
                      rotate: isPlaying ? 360 : 0,
                    }}
                    transition={{ 
                      rotate: { repeat: isPlaying ? Infinity : 0, duration: 12, ease: "linear" }
                    }}
                    className="w-20 h-20 rounded-2xl bg-white p-2 shadow-2xl relative group-hover/radio:scale-110 transition-transform duration-500"
                  >
                    <img 
                      src="/uploads/Capture d'écran 2026-05-03 170510.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                    {isPlaying && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-slate-900 animate-pulse" />
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-600 animate-pulse' : 'bg-white/20'}`} />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{isPlaying ? 'Live on air' : 'Standby'}</span>
                    </div>
                    <h3 className="font-display font-black text-white text-xl uppercase tracking-tight">Horizon FM</h3>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">La voix de l'espoir</p>
                  </div>
                </div>
                
                <div className="relative z-10 space-y-4">
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono text-white/30 uppercase">Signal Monitor</span>
                      <span className="text-[9px] font-mono text-brand-primary">103.3 MHz</span>
                    </div>
                    <div className="flex gap-1 h-3">
                      {[...Array(12)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ 
                            opacity: isPlaying ? [0.3, 1, 0.3] : 0.2,
                            scaleY: isPlaying ? [1, 1.4, 1] : 1
                          }}
                          transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }}
                          className={`flex-1 rounded-sm ${i > 9 ? 'bg-red-500' : 'bg-brand-primary'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlay}
                      className="flex-1 h-16 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/40"
                      style={{ 
                        backgroundColor: isPlaying ? '#ffffff' : themeColor,
                        color: isPlaying ? '#0f172a' : '#0f172a'
                      }}
                    >
                      {isPlaying ? (
                        <>
                          <Pause fill="currentColor" size={20} />
                          Mettre en Pause
                        </>
                      ) : (
                        <>
                          <Play fill="currentColor" size={20} className="ml-1" />
                          Écouter en Direct
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between px-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-white/30">
                    <Headphones size={12} />
                    {selectedRegion.toUpperCase()} NETWORK
                  </div>
                  <Link 
                    to="/radio" 
                    className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    Ouvrir le Studio
                  </Link>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Sections */}
      <div className="hidden lg:block px-4 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Recent News - 3/4 Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-slate-900 tracking-tight">
                <TrendingUp className="text-brand-primary" />
                À la Une
              </h2>
              <Link to="/news" className="text-sm text-brand-primary hover:underline font-semibold tracking-wide">
                Tout voir
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!newsLoading && latestNews.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-500 font-medium">Aucun article disponible pour le moment.</p>
                </div>
              )}
              {newsLoading ? (
                [1, 2, 3, 6].map((i) => (
                  <div key={i} className="bg-slate-50 animate-pulse rounded-3xl h-[300px]" />
                ))
              ) : (
                latestNews.slice(0, 6).map((article) => (
                  <Link 
                    key={article.id}
                    to={`/news/${article.id}`}
                    className="bg-white rounded-3xl border border-slate-100 hover:border-brand-primary/20 transition-all flex flex-col group shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="w-full h-48 shrink-0 bg-slate-100 relative overflow-hidden">
                      <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] text-brand-primary font-black uppercase tracking-widest shadow-sm">
                            {article.category}
                          </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3 flex flex-col flex-1">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {article.publishedAt?.toDate ? formatDistanceToNow(article.publishedAt.toDate(), { addSuffix: true, locale: fr }) : "récemment"}
                      </div>
                      <h3 className="font-display font-bold text-base leading-snug group-hover:text-brand-primary transition-colors text-slate-900 line-clamp-2 uppercase">
                         {article.title}
                      </h3>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <span>{article.viewCount > 1000 ? `${(article.viewCount/1000).toFixed(1)}k` : article.viewCount} vues</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                          <Play size={14} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - Podcasts - 1/4 Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-slate-900 tracking-tight">
                <Headphones className="text-brand-primary" size={24} />
                NOS PODCASTS
              </h2>
            </div>
            
            <div className="space-y-4">
              {[
                { title: "L'INVITÉ DU MATIN", duration: "15:20", author: "Moussa Camara", image: "https://images.unsplash.com/photo-1478737270239-2fccd27ee086?auto=format&fit=crop&q=80&w=300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
                { title: "HORIZON SPORT", duration: "45:00", author: "Alpha Diallo", image: "https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
                { title: "TECH EN GUINÉE", duration: "24:15", author: "Fanta Keita", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
                { title: "VOIX DES FEMMES", duration: "32:10", author: "Mariam Sylla", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
                { title: "TRADITIONS", duration: "18:45", author: "Ibrahima Sory", image: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?auto=format&fit=crop&q=80&w=300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
                { title: "POLITIQUE HORIZON", duration: "42:30", author: "Abdoulaye Diallo", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" }
              ].map((podcast, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedPodcast(podcast)}
                  className="flex items-center gap-3 p-3 bg-[#1d2742] border border-white/10 rounded-2xl hover:shadow-lg hover:shadow-black/20 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-white text-sm truncate group-hover:text-brand-primary transition-colors uppercase">{podcast.title}</h4>
                    <p className="text-white/60 text-[10px] truncate">Par {podcast.author}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Play size={12} fill="currentColor" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Promo Card */}
            <div className="bg-[#1d2742] rounded-3xl p-6 text-white relative overflow-hidden group shadow-lg shadow-black/20">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                <RadioIcon size={80} />
              </div>
              <div className="relative z-10 space-y-4">
                 <h3 className="font-display font-black text-xl leading-tight">ÉCOUTEZ HORIZON FM PARTOUT</h3>
                 <p className="text-white/80 text-xs">Téléchargez notre application mobile pour ne rien rater.</p>
                 <div className="flex flex-wrap gap-2">
                   <button className="bg-white text-[#1d2742] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform">
                     Play Store
                   </button>
                   <button className="bg-white text-[#1d2742] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform">
                     App Store
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section - Full Width Dark Background */}
      <div className="hidden lg:block mt-24 mb-12 bg-slate-950 rounded-[3rem] py-16 px-12 relative overflow-hidden group/video-section">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full -mr-48 -mt-48 transition-all duration-1000 group-hover/video-section:bg-brand-primary/20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full -ml-48 -mb-48" />

        <div className="relative z-10 space-y-12">
           <div className="flex items-center justify-between">
              <h2 className="text-4xl font-display font-black flex items-center gap-6 text-white tracking-tight">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <YoutubeIcon className="text-brand-primary" size={40} />
                </div>
                NOS VIDEOS
              </h2>
              <div className="flex gap-4">
                 <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-90">
                   <ChevronLeft size={24} />
                 </button>
                 <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-90">
                   <ChevronRight size={24} />
                 </button>
              </div>
           </div>
 
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { title: "HORIZON FM - LE CLUB DE LA PRESSE", thumbnail: "https://img.youtube.com/vi/fRjPaasxKOE/maxresdefault.jpg", duration: "12:45", id: "fRjPaasxKOE" },
                { title: "Gnalèn - Ans-T Crazy (Official Video)", thumbnail: "https://img.youtube.com/vi/aYthgMYT4k4/maxresdefault.jpg", duration: "25:30", id: "aYthgMYT4k4" },
                { title: "Ans-T Crazy - C'est Ma Vie (Official Video)", thumbnail: "https://img.youtube.com/vi/wc6gS68xKeY/maxresdefault.jpg", duration: "18:20", id: "wc6gS68xKeY" },
                { title: "Sia Tolno - African Women (Official Video)", thumbnail: "https://img.youtube.com/vi/cPYMCpp2hRg/maxresdefault.jpg", duration: "15:10", id: "cPYMCpp2hRg" },
                { title: "Ans-T Crazy - J'en peux plus (Official Video)", thumbnail: "https://img.youtube.com/vi/CVbipre85ao/maxresdefault.jpg", duration: "04:30", id: "CVbipre85ao" },
                { title: "Ans-T Crazy - 10 ans de carrière (Live)", thumbnail: "https://img.youtube.com/vi/Swya0HBVtgE/maxresdefault.jpg", duration: "52:15", id: "Swya0HBVtgE" },
                { title: "Ans-T Crazy - Genre Genre (Official Video)", thumbnail: "https://img.youtube.com/vi/qOo9kbKoxes/maxresdefault.jpg", duration: "03:50", id: "qOo9kbKoxes" },
                { title: "Sia Tolno - Eh Ya (Official Video)", thumbnail: "https://img.youtube.com/vi/0NT20CZP1ys/maxresdefault.jpg", duration: "04:10", id: "0NT20CZP1ys" },
                { title: "Ans-T Crazy - 1, 2, 3 (Official Video)", thumbnail: "https://img.youtube.com/vi/V79BIW_PwV4/maxresdefault.jpg", duration: "03:22", id: "V79BIW_PwV4" },
                { title: "Sia Tolno - Manu (Official Video)", thumbnail: "https://img.youtube.com/vi/GMyyFHf-IgY/maxresdefault.jpg", duration: "04:45", id: "GMyyFHf-IgY" }
              ].map((video, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedVideoId(video.id)}
                  className="group cursor-pointer bg-white/5 border border-white/20 p-4 rounded-[2.5rem] hover:bg-white/10 hover:border-white/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black"
                >
                  <div className="aspect-video rounded-[1.8rem] overflow-hidden relative shadow-sm mb-5">
                     <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-brand-primary text-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-2xl flex items-center justify-center">
                           <Play fill="white" size={28} className="ml-1" />
                        </div>
                     </div>
                     <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-xl border border-white/10">
                        {video.duration}
                     </div>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="font-display font-bold text-white group-hover:text-brand-primary transition-colors line-clamp-2 leading-tight text-sm tracking-wide uppercase">
                      {video.title}
                    </h3>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 bg-slate-950/90 backdrop-blur-sm"
            onClick={() => setSelectedVideoId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideoId(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-brand-primary transition-colors"
              >
                <X size={20} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Podcast Player Modal */}
      <AnimatePresence>
        {selectedPodcast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 bg-slate-950/90 backdrop-blur-sm"
            onClick={() => setSelectedPodcast(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl p-8 space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPodcast(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="aspect-square w-full rounded-3xl overflow-hidden shadow-xl">
                 <img src={selectedPodcast.image} alt={selectedPodcast.title} className="w-full h-full object-cover" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-display font-black text-slate-900 leading-tight uppercase">
                  {selectedPodcast.title}
                </h3>
                <p className="text-slate-500 font-medium">Par {selectedPodcast.author}</p>
              </div>

              <div className="space-y-4">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-brand-primary"
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 font-mono">
                  <span>08:45</span>
                  <span>{selectedPodcast.duration}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8">
                 <audio ref={podcastAudioRef} src={selectedPodcast.audioUrl} />
                 <button className="text-slate-300 hover:text-brand-primary transition-colors">
                   <ChevronLeft size={32} />
                 </button>
                 <button 
                  onClick={togglePodcastPlay}
                  className="w-20 h-20 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-xl shadow-brand-primary/20 hover:scale-105 transition-transform"
                 >
                   {isPodcastPlaying ? (
                    <Pause fill="currentColor" size={32} />
                   ) : (
                    <Play fill="currentColor" size={32} className="ml-1" />
                   )}
                 </button>
                 <button className="text-slate-300 hover:text-brand-primary transition-colors">
                   <ChevronRight size={32} />
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer - Desktop Only */}
      <footer className="hidden lg:block border-t border-slate-200 pt-12 pb-12 mt-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
          <div className="space-y-6 max-w-sm">
            <img src="/uploads/HORIZON TV-3.png" alt="Logo" className="h-12 w-auto object-contain" />
            <p className="text-slate-500 text-sm leading-relaxed">
              Horizon News est votre source d'information continue, de culture et de divertissement. 
              Retrouvez-nous en direct sur toutes nos plateformes numériques.
            </p>
            <div className="flex items-center gap-4">
               {['facebook', 'twitter', 'youtube', 'instagram'].map((social) => (
                 <a key={social} href={`#${social}`} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-all">
                   <span className="sr-only">{social}</span>
                   <div className="w-4 h-4 bg-current rounded-sm opacity-50" />
                 </a>
               ))}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/" className="hover:text-brand-primary transition-colors">Accueil</Link></li>
                <li><Link to="/radio" className="hover:text-brand-primary transition-colors">Radio en direct</Link></li>
                <li><Link to="/live" className="hover:text-brand-primary transition-colors">Télévision</Link></li>
                <li><Link to="/news" className="hover:text-brand-primary transition-colors">Actualités</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#contact" className="hover:text-brand-primary transition-colors">Nous contacter</a></li>
                <li><a href="#faq" className="hover:text-brand-primary transition-colors">FAQ</a></li>
                <li><a href="#ads" className="hover:text-brand-primary transition-colors">Publicité</a></li>
                <li><a href="#help" className="hover:text-brand-primary transition-colors">Aide</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Légal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#privacy" className="hover:text-brand-primary transition-colors">Confidentialité</a></li>
                <li><a href="#terms" className="hover:text-brand-primary transition-colors">Conditions</a></li>
                <li><a href="#cookies" className="hover:text-brand-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Horizon News. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Serveur Opérationnel
            </span>
            <span>Version 1.2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
