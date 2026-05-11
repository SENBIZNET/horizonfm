import { motion } from 'motion/react';
import { Play, Users, MessageCircle, Share2, Heart, SkipForward, SkipBack } from 'lucide-react';

import { VideoPlayer } from '../components/VideoPlayer';

const Live = () => {
  return (
    <div className="min-h-full space-y-0 lg:space-y-8">
      {/* Player Frame */}
      <section className="grid grid-cols-1 xl:grid-cols-4 lg:gap-8 gap-0">
        <div className="xl:col-span-3 space-y-6">
          <VideoPlayer 
            src="https://183.bozztv.com/ssh101/ssh101/horizontv/playlist.m3u8" 
            poster="https://images.unsplash.com/photo-1540226716919-e640d024f997?auto=format&fit=crop&q=80&w=2000"
            isLive={true}
          />

          <div className="hidden lg:flex flex-wrap items-center justify-between gap-6 p-2 lg:p-4">
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <div className="bg-brand-primary h-2 w-2 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">En Direct</span>
                  <span className="text-white/40 px-2 py-0.5 border border-white/10 rounded text-[10px]">HD</span>
               </div>
               <h1 className="text-3xl font-display font-bold">HORIZON News: Édition Spéciale Économie</h1>
               <div className="flex items-center gap-4 text-white/50 text-sm">
                  <span className="flex items-center gap-2"><Users size={16}/> 14,250 spectateurs</span>
                  <span>• Commencé à 19:00</span>
               </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl transition-all border border-white/5">
                <Heart size={20} className="text-brand-primary" />
                <span className="font-semibold">3.2k</span>
              </button>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl transition-all border border-white/5">
                <Share2 size={20} />
                <span className="font-semibold">Partager</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Live Interaction */}
        <aside className="hidden xl:flex xl:col-span-1 glass rounded-3xl lg:rounded-[2.5rem] flex flex-col overflow-hidden border border-slate-200 h-[450px] lg:h-[600px] xl:h-auto bg-white/70 shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
             <h2 className="font-display font-bold flex items-center gap-2 text-slate-900">
                <MessageCircle size={20} className="text-brand-primary" />
                Discussion en direct
             </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="flex gap-3 text-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1">
                  <span className="font-bold text-brand-primary/80">User_{i}</span>
                  <p className="text-slate-600 leading-relaxed">Incroyable analyse sur les marchés émergents ! 🔥</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Dire quelque chose..." 
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary transition-all font-sans text-slate-900"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Envoyer
              </button>
            </div>
          </div>
        </aside>
      </section>

      {/* Suggested Streams */}
      <section className="hidden lg:block space-y-6 pt-10">
         <h2 className="text-2xl font-display font-bold text-slate-900">Flux Similaires</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="group cursor-pointer space-y-3">
                 <div className="aspect-video rounded-3xl overflow-hidden relative border border-slate-200">
                    <img src={`https://picsum.photos/seed/live${i}/400/225`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-slate-900 flex items-center gap-1.5 border border-slate-200">
                       <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                       DIRECT
                    </div>
                 </div>
                 <div>
                    <h3 className="font-semibold group-hover:text-brand-primary transition-colors text-slate-900">HORIZON Sport: Championnat National</h3>
                    <p className="text-xs text-slate-400">5.2k spectateurs • Sport</p>
                 </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default Live;
