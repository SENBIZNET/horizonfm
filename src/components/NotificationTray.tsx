import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Megaphone, Tv, Info } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const NotificationTray = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'breaking': return <Megaphone className="text-brand-primary" size={18} />;
      case 'live': return <Tv className="text-brand-secondary" size={18} />;
      default: return <Info className="text-white/40" size={18} />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full hover:bg-white/5 transition-colors relative"
      >
        <Bell size={20} className={unreadCount > 0 ? "text-brand-primary" : "text-white/70"} />
        {unreadCount > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-primary rounded-full border-2 border-[#0c0c0e]" 
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-[calc(100vw-2rem)] sm:w-96 glass rounded-3xl border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                <h3 className="font-display font-bold">Notifications</h3>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{unreadCount} non lues</span>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/20">
                      <Bell size={24} />
                    </div>
                    <p className="text-sm text-white/40">Aucune notification pour le moment.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      className={`p-5 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 ${!notif.read ? 'bg-brand-primary/5' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={`text-sm font-semibold ${!notif.read ? 'text-white' : 'text-white/60'}`}>{notif.title}</p>
                        <p className="text-xs text-white/40 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-white/20 pt-1">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 bg-white/2 text-center border-t border-white/5">
                  <button className="text-xs font-bold text-brand-primary hover:underline uppercase tracking-widest">
                    Voir toutes les alertes
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
