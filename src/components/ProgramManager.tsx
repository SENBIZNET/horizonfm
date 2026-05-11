import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getCurrentAndNextProgram, ProgramInfo } from '../lib/scheduleUtils';
import { differenceInSeconds, format } from 'date-fns';
import { Bell, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProgramManager = () => {
  const [data, setData] = useState<{ current: ProgramInfo | null; next: ProgramInfo | null }>({ current: null, next: null });
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [notified, setNotified] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<ProgramInfo | null>(null);

  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio playback blocked until user interaction'));
  };

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const nextData = getCurrentAndNextProgram();
      setData(nextData);

      if (nextData.next) {
        const seconds = differenceInSeconds(nextData.next.startTime, new Date());
        setTimeLeft(seconds);

        // Notify PRECISELY 5 minutes before (300 seconds)
        // We trigger between 299 and 301 to ensure we catch it in the 1s interval
        if (seconds <= 300 && seconds > 298 && notified !== nextData.next.title) {
          triggerNotification(nextData.next);
          setNotified(nextData.next.title);
          setShowNotification(nextData.next);
          
          // Hide visual alert after 1 minute (60 seconds)
          setTimeout(() => {
            setShowNotification(null);
          }, 60000);
        }
      } else {
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [notified]);

  const triggerNotification = (program: ProgramInfo) => {
    const message = `⚠️ Le programme "${program.title}" commence dans 5 minutes !`;
    
    // Play sound
    playNotificationSound();

    // In-app toast
    toast.info(message, {
      icon: <Bell className="text-brand-primary animate-bounce" size={18} />,
      duration: 60000, // Show for 1 minute
    });

    // Native Push (if allowed)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Horizon FM - Rappel", {
        body: message,
        icon: "/uploads/HORIZON TV-3.png"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60] lg:bottom-12 lg:right-12">
      <AnimatePresence>
        {/* Regular countdown (shown 1h before) */}
        {timeLeft !== null && timeLeft <= 3600 && !showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#1d2742]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4 min-w-[240px]"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary flex-shrink-0">
              <Clock size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-0.5">À Suivre</p>
              <h4 className="text-white text-xs font-bold truncate max-w-[150px]">{data.next?.title}</h4>
              <p className="text-white/40 text-[10px] font-mono mt-1">Dans {formatTime(timeLeft)}</p>
            </div>
          </motion.div>
        )}

        {/* High Alert Visualization (shown 5m before, for 1 minute) */}
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ 
              opacity: 1, scale: 1, y: 0,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="bg-brand-primary rounded-[2rem] p-6 shadow-[0_0_50px_rgba(108,92,231,0.5)] flex flex-col items-center gap-4 min-w-[280px] border-4 border-white/20 relative"
          >
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#ffbe0b] rounded-full flex items-center justify-center text-slate-900 shadow-xl animate-bounce">
              <Bell size={24} fill="currentColor" />
            </div>
            
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">ALERTE PROGRAMME</span>
              <h4 className="text-xl font-display font-black text-white uppercase leading-tight">
                {showNotification.title}
              </h4>
              <div className="bg-white/10 rounded-xl px-4 py-2 mt-2">
                <p className="text-white font-mono font-black text-lg">
                  {formatTime(timeLeft || 0)}
                </p>
                <p className="text-[9px] font-bold text-white/40 uppercase">Restant</p>
              </div>
            </div>

            <p className="text-white/80 text-[10px] font-medium text-center">
              Le programme commence dans quelques instants !
            </p>

            <motion.div 
              className="absolute inset-0 bg-white/20 rounded-[2rem]"
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
