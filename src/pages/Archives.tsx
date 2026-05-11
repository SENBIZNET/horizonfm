import { motion, AnimatePresence } from 'motion/react';
import { Play, Filter, Grid, List as ListIcon, Clock, ChevronDown, Monitor, Music, Search, X } from 'lucide-react';
import { useState } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';

const Archives = () => {
  const [selectedVideo, setSelectedVideo] = useState<{src: string, title: string} | null>(null);

  const sections = [
    { title: 'Émissions TV', type: 'video', icon: Monitor, videos: [
      { id: '1', title: "Le grand débat : Quel avenir pour la zone CFA ?", genre: "Débat", year: "2024", duration: "52:10", src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumb: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800" },
      { id: '2', title: "Horizon News : Édition spéciale investiture", genre: "Information", year: "2024", duration: "35:45", src: "https://www.youtube.com/watch?v=kJQP7kiw5Fk", thumb: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800" },
      { id: '3', title: "Culture & Musique : L'héritage de Mory Kanté", genre: "Culture", year: "2023", duration: "48:20", src: "https://www.youtube.com/watch?v=Yp69IAt9RWA", thumb: "https://images.unsplash.com/photo-1514525253361-bee8d40d0497?auto=format&fit=crop&q=80&w=800" },
      { id: '4', title: "Économie : Les mines, moteur de la Guinée ?", genre: "Éco", year: "2024", duration: "42:15", src: "https://www.youtube.com/watch?v=jNQXAC9IVRw", thumb: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=800" },
    ]},
    { title: 'Documentaires', type: 'video', icon: Monitor, videos: [
      { id: '5', title: "Syli National : L'épopée de 1976", genre: "Sport", year: "2023", duration: "1:15:00", src: "https://www.youtube.com/watch?v=ScMzIvxBSi4", thumb: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800" },
      { id: '6', title: "Les forêts sacrées du Fouta Djallon", genre: "Nature", year: "2024", duration: "55:30", src: "https://www.youtube.com/watch?v=V-_O7nl0Ii0", thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800" },
      { id: '7', title: "Conakry : Hier et Aujourd'hui", genre: "Histoire", year: "2022", duration: "45:00", src: "https://www.youtube.com/watch?v=9bZkp7q19f0", thumb: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=800" },
      { id: '8', title: "L'artisanat guinéen en péril ?", genre: "Société", year: "2024", duration: "38:20", src: "https://www.youtube.com/watch?v=L_jWHffIx5E", thumb: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&q=80&w=800" },
    ]},
  ];

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-xl"
          >
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-[110]"
            >
              <X size={24} />
            </button>
            <div className="w-full max-w-6xl space-y-4 lg:space-y-6">
              <div className="aspect-video w-full overflow-hidden rounded-2xl lg:rounded-[2.5rem] bg-black shadow-2xl">
                 <VideoPlayer src={selectedVideo.src} />
              </div>
              <h2 className="text-xl lg:text-3xl font-display font-bold text-white px-2 tracking-tight">{selectedVideo.title}</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="space-y-6 lg:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-5xl font-display font-black tracking-tighter text-slate-900 uppercase">Archives Horizon</h1>
            <p className="text-slate-500 font-sans text-sm lg:text-base">Explorez des décennies d'histoire, de débats et de culture guinéenne.</p>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button className="p-2 rounded-lg bg-brand-primary text-white shadow-lg shadow-brand-primary/20"><Grid size={18}/></button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><ListIcon size={18}/></button>
            </div>
            <button className="flex items-center gap-2 bg-white hover:bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 text-xs lg:text-sm font-bold transition-all text-slate-900 shadow-sm">
              <Filter size={18} />
              Filtrer
              <ChevronDown size={14} className="opacity-40" />
            </button>
          </div>
        </div>
      </header>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-2 lg:gap-4 overflow-x-auto no-scrollbar pb-2">
         {['Tout', 'Émissions TV', 'Documentaires', 'Podcasts', 'Politique', 'Sport', 'Culture', 'Économie', 'Cinéma'].map((cat, i) => (
           <button key={cat} className={`px-6 lg:px-8 py-3 rounded-full border transition-all whitespace-nowrap text-xs lg:text-sm font-bold uppercase tracking-widest ${i === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-primary/40 hover:bg-slate-50'}`}>
             {cat}
           </button>
         ))}
      </div>

      {/* Archive Sections */}
      <div className="space-y-16">
        {sections.map((section, idx) => (
          <section key={section.title} className="space-y-8">
             <div className="flex items-center justify-between border-l-4 border-brand-primary pl-4">
                <h2 className="text-xl lg:text-2xl font-display font-black flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                   {section.title}
                   <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-mono">{section.videos.length}</span>
                </h2>
                <div className="flex gap-2">
                   <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-400">
                      <ChevronDown className="rotate-90" size={18} />
                   </button>
                   <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-400">
                      <ChevronDown className="-rotate-90" size={18} />
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.videos.map((video) => (
                  <motion.div 
                    key={video.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedVideo({
                      src: video.src,
                      title: video.title
                    })}
                    className="group cursor-pointer space-y-4"
                  >
                     <div className="aspect-[16/9] rounded-2xl lg:rounded-[2rem] border border-slate-200 overflow-hidden relative shadow-lg bg-slate-100">
                        <img src={video.thumb} alt={video.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-brand-primary/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-500">
                           <div className="w-14 h-14 rounded-full bg-white text-brand-primary flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                              <Play fill="currentColor" size={24} className="ml-1" />
                           </div>
                        </div>
                        <div className="absolute top-4 left-4 bg-brand-primary/90 backdrop-blur-md px-2 py-1 rounded text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/10">
                           YOUTUBE
                        </div>
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/10 shadow-xl">
                           <Clock size={12} className="text-brand-primary" />
                           {video.duration}
                        </div>
                     </div>
                     <div className="space-y-1.5 px-2">
                        <h3 className="text-sm lg:text-base font-display font-black leading-tight group-hover:text-brand-primary transition-colors line-clamp-2 text-slate-900 uppercase tracking-tight">{video.title}</h3>
                        <p className="text-[10px] lg:text-xs text-slate-400 uppercase tracking-widest font-black">
                          <span className="text-brand-primary">{video.genre}</span> • {video.year}
                        </p>
                     </div>
                  </motion.div>
                ))}
             </div>
          </section>
        ))}
      </div>

      {/* Pagination Mock */}
      <div className="flex items-center justify-center pt-8">
         <button className="px-12 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-bold transition-all shadow-sm">
            Charger plus de contenus
         </button>
      </div>
    </div>
  );
};

export default Archives;
