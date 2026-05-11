import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, TrendingUp, ChevronRight, Facebook, Twitter, Youtube, Instagram, Linkedin } from 'lucide-react';
import { newsService } from '../services/newsService';
import { NewsItem } from '../types';
import { Link } from 'react-router-dom';

export const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await newsService.getLatestNews(10);
      setNews(data);
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length > 1) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % news.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [news.length]);

  if (news.length === 0) return null;

  const current = news[index];

  return (
    <div className="hidden lg:flex bg-slate-900 text-white h-12 overflow-hidden items-center relative z-[60] lg:rounded-t-[2.5rem]">
      {/* Label */}
      <div className="bg-red-600 h-full px-4 lg:px-8 flex items-center gap-2 shrink-0 relative z-10 shadow-[5px_0_15px_rgba(0,0,0,0.3)]">
        <TrendingUp size={16} className="text-white animate-pulse" />
        <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">Dernière Heure</span>
      </div>

      {/* Content */}
      <div className="flex-1 h-full relative overflow-hidden px-4 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="h-full flex items-center justify-between gap-4"
          >
            <Link 
              to={`/news/${current.id}`}
              className="flex items-center gap-3 group"
            >
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest px-2 py-0.5 border border-brand-primary/30 rounded shrink-0">
                {current.category}
              </span>
              <p className="text-xs lg:text-sm font-medium truncate max-w-[250px] md:max-w-md lg:max-w-2xl group-hover:text-brand-primary transition-colors">
                {current.title}
              </p>
            </Link>
            
            <Link 
              to="/news"
              className="hidden md:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Voir tout <ChevronRight size={14} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Social Media Links */}
      <div className="flex items-center gap-4 px-4 lg:px-8 border-l border-white/10 h-full bg-slate-900/50 relative z-10 shrink-0">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
          <Facebook size={16} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
          <Twitter size={16} />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
          <Youtube size={16} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
          <Instagram size={16} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
          <Linkedin size={16} />
        </a>
      </div>
    </div>
  );
};
