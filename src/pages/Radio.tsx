import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Mic2, Radio as RadioIcon, Heart, Share2, Headphones, TrendingUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { RegionSelector } from '../components/RegionSelector';

const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [selectedRegion, setSelectedRegion] = useState('Conakry');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const regionData: Record<string, { url: string, color: string, frequency: number }> = {
    'Conakry': { url: "http://stream.zeno.fm/utf24ggk4reuv", color: "#ff1c24", frequency: 103.3 },
    'Kankan': { url: "http://stream.zeno.fm/utf24ggk4reuv", color: "#6c5ce7", frequency: 98.4 },
    'Kindia': { url: "http://stream.zeno.fm/utf24ggk4reuv", color: "#00b894", frequency: 105.2 }
  };

  const currentStream = regionData[selectedRegion].url;
  const themeColor = regionData[selectedRegion].color;
  const activeFrequency = regionData[selectedRegion].frequency;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = currentStream;
      audioRef.current.load();
      audioRef.current.play().catch(e => {
        if (e.name !== 'AbortError') console.error("Playback error:", e);
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
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') console.error("Playback error:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col pt-4 lg:pt-12 px-0 lg:px-12 pb-12 gap-0 lg:gap-12 relative overflow-x-hidden">
      <audio ref={audioRef} src={currentStream} crossOrigin="anonymous" />
      
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full blur-[100px] lg:blur-[160px] opacity-10 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: themeColor }}
      />

      {/* Mobile Header / Tabs */}
      <div className="block lg:hidden px-4 space-y-6 mb-4">
        <div className="flex flex-col items-center text-center space-y-2">
           <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-slate-600 text-[8px] font-black uppercase tracking-widest">Horizon Direct</span>
           </div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
             Horizon <span className="text-brand-primary">Direct</span>
           </h1>
        </div>

        <div className="flex justify-center items-center gap-8 py-2 border-b border-slate-100">
          {['Conakry', 'Kankan'].map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`relative py-2 text-sm font-black tracking-widest uppercase transition-all ${
                selectedRegion === region 
                ? 'text-slate-900' 
                : 'text-slate-300 hover:text-slate-400'
              }`}
            >
              {region}
              {selectedRegion === region && (
                <motion.div 
                  layoutId="mobile-region-underline" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start px-0 lg:px-0">
        {/* Left Side: Station Identity & Region - Hidden on Mobile */}
        <div className="hidden lg:block w-full lg:w-72 space-y-8 relative z-10">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-slate-900/10 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Live Studio</span>
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase">
              Horizon <span className="text-brand-primary">Direct</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              La voix de la démocratie et de l'espoir, diffusant en direct de Guinée.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Choisir le réseau</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.keys(regionData).map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl transition-all border ${
                    selectedRegion === region 
                    ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/20' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        selectedRegion === region ? 'bg-white/10' : 'bg-slate-50'
                      }`}
                    >
                      <RadioIcon size={16} className={selectedRegion === region ? 'text-white' : 'text-slate-400'} />
                    </div>
                    <span className={`font-bold text-sm tracking-tight ${selectedRegion === region ? 'text-white' : 'text-slate-700'}`}>
                      {region}
                    </span>
                  </div>
                  {selectedRegion === region && (
                    <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  )}
                  <span className={`text-[10px] font-mono ${selectedRegion === region ? 'text-white/40' : 'text-slate-400'}`}>
                    {regionData[region].frequency} FM
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: The Immersive Player */}
        <div className="flex-1 w-full relative group">
          <div className="relative bg-slate-900 rounded-none lg:rounded-[3.5rem] p-6 lg:p-10 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.4)] border-y lg:border border-white/5 overflow-hidden">
            {/* Visualizer Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end gap-1 px-8 pb-4">
                {[...Array(30)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      height: isPlaying ? [5, 40, 15, 50, 20] : 2
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.2 + Math.random(), 
                      delay: i * 0.05 
                    }}
                    className="flex-1 bg-white rounded-t-full"
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8">
              {/* Disc / Vinyl Player - Reduced Size */}
              <div className="relative w-40 h-40 lg:w-56 lg:h-56">
                <motion.div 
                  animate={{ 
                    rotate: isPlaying ? 360 : 0 
                  }}
                  transition={{ 
                    rotate: { repeat: isPlaying ? Infinity : 0, duration: 8, ease: "linear" }
                  }}
                  className="w-full h-full rounded-full bg-slate-800 p-1.5 shadow-2xl relative border-[8px] border-slate-950 flex items-center justify-center group/disc"
                >
                  {/* Inner vinyl rings */}
                  <div className="absolute inset-0 rounded-full border-[1px] border-white/5 opacity-50 m-3" />
                  <div className="absolute inset-0 rounded-full border-[1px] border-white/5 opacity-50 m-6" />
                  <div className="absolute inset-0 rounded-full border-[1px] border-white/5 opacity-50 m-9" />
                  
                  {/* Center Label */}
                  <div className="w-1/3 h-1/3 rounded-full bg-white relative z-10 p-2 shadow-inner overflow-hidden">
                    <img 
                      src="/uploads/Capture d'écran 2026-05-03 170510.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Play/Pause Overlay on Disc */}
                  <button 
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors rounded-full z-20 group"
                  >
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform flex items-center justify-center text-slate-900 shadow-xl"
                    >
                      {isPlaying ? <Pause fill="currentColor" size={18} /> : <Play fill="currentColor" size={18} className="ml-0.5" />}
                    </motion.div>
                  </button>
                </motion.div>
              </div>

              {/* Player UI - Condensed */}
              <div className="w-full max-w-md space-y-6 text-center">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                    <span className="text-white text-[9px] font-black uppercase tracking-[0.4em]">Signal {isPlaying ? 'Actif' : 'Prêt'}</span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                    {activeFrequency}<span className="text-brand-primary">.FM</span>
                  </h2>
                  <div className="flex items-center justify-center gap-4 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] border-t border-white/5 pt-2 mt-2">
                    <span className="flex items-center gap-1.5"><Headphones size={12} /> STEREO</span>
                    <span className="flex items-center gap-1.5"><Mic2 size={12} /> LIVE</span>
                  </div>
                </div>

                {/* Main Controls Console - Condensed */}
                <div className="flex items-center justify-center gap-6">
                   <button className="text-white/20 hover:text-white transition-colors"><SkipBack size={24} /></button>
                   <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white flex items-center justify-center shadow-lg text-slate-900 group relative"
                   >
                     <div className="absolute inset-0 rounded-full border-2 border-slate-900/5 group-hover:scale-110 transition-transform" />
                     {isPlaying ? (
                       <Pause fill="currentColor" size={24} className="relative z-10" />
                     ) : (
                       <Play fill="currentColor" size={24} className="relative z-10 ml-1" />
                     )}
                   </motion.button>
                   <button className="text-white/20 hover:text-white transition-colors"><SkipForward size={24} /></button>
                </div>

                {/* Volume & Mixer- Like Footer */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                   <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center text-[8px] font-black text-white/20 uppercase tracking-widest">
                        <span>Output Level</span>
                        <span>{Math.round(volume * 100)}%</span>
                      </div>
                      <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                        <input 
                          type="range" min="0" max="1" step="0.01" value={volume} 
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                        />
                        <motion.div 
                          className="h-full bg-white/40 rounded-full"
                          animate={{ width: `${volume * 100}%` }}
                        />
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all">
                        <Heart size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all">
                        <Share2 size={14} />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Recently Played / Schedule - Hidden on Mobile */}
        <div className="hidden lg:block w-full lg:w-80 space-y-10 relative z-10">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-brand-primary" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">À suivre</h3>
              </div>
              <div className="space-y-3">
                {[
                  { time: '12:00', title: 'Grand Journal', host: 'Alpha Barry' },
                  { time: '14:30', title: 'Horizon Sport', host: 'Idrissa Sylla' },
                  { time: '16:00', title: 'Voix des Jeunes', host: 'Binto Keita' },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 group hover:shadow-lg transition-all">
                    <div className="text-[10px] font-mono font-black text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-md">{item.time}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium tracking-wide">Animé par {item.host}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary/20 blur-[40px] rounded-full" />
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Nouvelle Appli</p>
                <h4 className="text-xl font-black leading-tight">EMPORTEZ LA RADIO PARTOUT</h4>
                <p className="text-white/40 text-xs leading-relaxed">Téléchargez l'application Horizon FM sur mobile.</p>
                <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-xl">
                  Installer l'app
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Podcasts Section - Hidden on Mobile as requested */}
      <div className="hidden lg:block space-y-12 pb-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-black text-3xl text-slate-900 tracking-tight flex items-center gap-3">
              <Headphones className="text-brand-primary" size={32} />
              PODCASTS
            </h3>
            <p className="text-slate-500 text-sm">Écoutez vos émissions favorites à tout moment</p>
          </div>
          <button className="text-brand-primary font-bold text-sm hover:underline">Voir tout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "L'Invité du Matin", duration: "15:20", category: "POLITIQUE", author: "Moussa Camara", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=300" },
            { title: "Horizon Sport : Le Débrief", duration: "45:00", category: "SPORT", author: "Alpha Diallo", image: "https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=300" },
            { title: "Tech & Futur en Guinée", duration: "24:15", category: "TECH", author: "Fanta Keita", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=300" },
          ].map((podcast, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest block mb-1">{podcast.category}</span>
                <h4 className="font-display font-bold text-slate-900 text-lg truncate group-hover:text-brand-primary transition-colors">{podcast.title}</h4>
                <p className="text-slate-400 text-xs truncate">Par {podcast.author}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                <Play size={14} fill="currentColor" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Radio;
