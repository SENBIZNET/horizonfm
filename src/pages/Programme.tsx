import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Download, Share2, PlayCircle, BellRing } from 'lucide-react';
import { schedule, ScheduleRow } from '../constants/schedule';
import { getCurrentAndNextProgram, ProgramInfo } from '../lib/scheduleUtils';
import { differenceInSeconds } from 'date-fns';

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function Programme() {
  const [progData, setProgData] = useState<{ current: ProgramInfo | null; next: ProgramInfo | null }>({ current: null, next: null });
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);

  useEffect(() => {
    const update = () => {
      const data = getCurrentAndNextProgram();
      setProgData(data);
      if (data.next) {
        setTimeLeft(differenceInSeconds(data.next.startTime, new Date()));
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  const activePrograms = schedule.map(row => ({
    time: row.time,
    title: row[activeDay.toLowerCase() as keyof ScheduleRow] as string
  })).filter(p => p.title !== '-');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Live Program Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Program */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-brand-primary/20"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <PlayCircle size={160} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">En cours de diffusion</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-4xl font-display font-black uppercase leading-tight">
                {progData.current?.title || "Musique & Animation"}
              </h2>
              <div className="flex items-center gap-2 text-white/60 font-mono text-sm font-bold">
                <Clock size={16} />
                {progData.current?.timeRange || "24/7"}
              </div>
            </div>
            <div className="pt-4 flex items-center gap-4">
               <button className="bg-white text-brand-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl active:scale-95 transition-transform flex items-center gap-2">
                 <PlayCircle size={18} fill="currentColor" />
                 ÉCOUTER LE DIRECT
               </button>
            </div>
          </div>
        </motion.div>

        {/* Next Program Countdown */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#1d2742] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-black/20"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12">
            <BellRing size={160} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffbe0b]">Prochain rendez-vous</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl lg:text-4xl font-display font-black uppercase leading-tight truncate">
                  {progData.next?.title || "A venir..."}
                </h2>
                <div className="flex items-center gap-2 text-white/40 font-mono text-sm font-bold">
                  <Clock size={16} />
                  {progData.next?.timeRange || "--"}
                </div>
              </div>
              
              {timeLeft !== null && timeLeft > 0 && (
                <div className="inline-flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ffbe0b]/60">Démarrage dans</span>
                  <div className="text-3xl font-mono font-black text-[#ffbe0b]">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Header */}
      <section className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-black uppercase tracking-widest">
            <Calendar size={14} />
            Grille des Programmes
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight">
            VOTRE PROGRAMME <span className="text-brand-primary">RADIO</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Retrouvez tous vos rendez-vous préférés sur Horizon FM. Une programmation riche et variée pour vous accompagner tout au long de la semaine.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 text-sm">
            <Download size={18} />
            Télécharger PDF
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-white text-slate-400 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
            <Share2 size={20} />
          </button>
        </div>
      </section>

      {/* Day Selector */}
      <div className="sticky top-20 z-40 bg-slate-50/80 backdrop-blur-md py-4">
        <div className="flex items-center justify-between overflow-x-auto gap-2 no-scrollbar pb-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                activeDay === day 
                  ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-brand-primary/30 hover:text-brand-primary'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activePrograms.map((program, idx) => {
          const isSpecial = program.title?.toLowerCase().includes("journal") || 
                           program.title?.toLowerCase().includes("coran") || 
                           program.title?.toLowerCase().includes("islam");
          const isLive = progData.current?.title === program.title && progData.current?.timeRange === program.time;

          return (
            <motion.div 
              key={`${activeDay}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="group h-full"
            >
              <div className={`p-8 rounded-[2.5rem] border h-full transition-all duration-500 flex flex-col justify-between ${
                isLive 
                  ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 border-transparent -translate-y-1' 
                  : isSpecial
                    ? 'bg-brand-primary/5 border-brand-primary/10 text-slate-900 hover:bg-brand-primary/10'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-brand-primary/30'
              }`}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isLive && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/80 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            EN DIRECT
                          </span>
                        )}
                        {!isLive && isSpecial && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary/60">Émission Spéciale</span>
                        )}
                      </div>
                      <h3 className={`text-xl font-display font-black uppercase tracking-tight leading-tight ${isLive ? 'text-white' : 'text-slate-900 group-hover:text-brand-primary'}`}>
                        {program.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                    <div className="flex items-center gap-2 opacity-60">
                      <Clock size={16} />
                      <span className="text-xs font-mono font-bold tracking-tighter">{program.time}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${isLive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary'}`}>
                      <PlayCircle size={24} />
                    </div>
                   <button className={`text-[10px] font-black tracking-widest uppercase py-2 px-4 rounded-xl transition-all ${isLive ? 'bg-white text-brand-primary' : 'bg-slate-900 text-white opacity-0 group-hover:opacity-100'}`}>
                     Écouter
                   </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
