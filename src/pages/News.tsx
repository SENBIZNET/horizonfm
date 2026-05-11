import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Newspaper, TrendingUp, Search, Calendar, ChevronRight, Share2, Bookmark, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsService } from '../services/newsService';
import { NewsItem } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { seedInitialData } from '../lib/seed';

const News = () => {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const categories = ['Tout', 'Guinée', 'Afrique', 'International', 'Sport', 'Culture', 'Économie'];
  const [activeCategory, setActiveCategory] = useState('Tout');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        // Map UI categories to database categories if needed, or just use them as is
        let dbCategory: string | undefined = undefined;
        if (activeCategory === 'Guinée') dbCategory = 'GUINEE';
        if (activeCategory === 'Afrique') dbCategory = 'ACTUALITE AFRICAINE';
        if (activeCategory === 'International') dbCategory = 'INTERNATIONAL';
        
        // Fetch all news
        const news = await newsService.getLatestNews(50); 
        
        // If empty, try to seed
        if (news.length === 0 && activeCategory === 'Tout') {
          await seedInitialData();
          const refreshedNews = await newsService.getLatestNews(50);
          setLatestNews(refreshedNews);
          return;
        }

        // Filter by published status or no status (legacy)
        const publishedNews = news.filter(item => 
          item.status === 'published' || !item.status
        );
        
        const filtered = activeCategory === 'Tout' 
          ? publishedNews 
          : publishedNews.filter(item => {
              const cat = item.category.toUpperCase();
              if (activeCategory === 'Guinée') return cat === 'GUINEE';
              if (activeCategory === 'Afrique') return cat === 'ACTUALITE AFRICAINE';
              if (activeCategory === 'International') return cat === 'INTERNATIONAL';
              // Fallback for others if they exist in DB
              return cat === activeCategory.toUpperCase();
            });

        setLatestNews(filtered);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, [activeCategory]);
  
  const featuredArticle = latestNews[0];
  const trendingArticles = latestNews.slice(1, 4);
  const feedArticles = latestNews.slice(4);

  const handleManualSeed = async () => {
    try {
      setNewsLoading(true);
      await newsService.getLatestNews(1); // just to trigger
      const news = await newsService.getLatestNews(12);
      if (news.length === 0) {
          // If still empty and we are admin, seed might not have run or failed
          // seedInitialData is imported from lib/seed
      }
      window.location.reload(); // Refresh to show new data
    } catch (err) {
      console.error(err);
    } finally {
      setNewsLoading(false);
    }
  };
  
  return (
    <div className="space-y-8 lg:space-y-12 pb-20">
      <header className="space-y-6 lg:space-y-8 px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-4 lg:pt-0">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-900">HORIZON News</h1>
            <p className="text-slate-500 font-sans text-sm lg:text-base">L'actualité en temps réel décryptée par nos rédactions.</p>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-xl lg:rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-4 lg:px-6 py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat ? 'bg-brand-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Featured Articles Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 gap-0">
        {!newsLoading && latestNews.length === 0 && (
          <div className="lg:col-span-12 py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
             < Newspaper className="mx-auto h-12 w-12 text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-900">Aucun article trouvé</h3>
             <p className="text-slate-500 mt-2">Revenez plus tard pour les dernières actualités.</p>
             <button 
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-full font-bold text-sm shadow-lg shadow-brand-primary/20"
             >
                Actualiser la page
             </button>
          </div>
        )}
        
        {newsLoading ? (
            <div className="lg:col-span-8 bg-slate-50 animate-pulse rounded-[2.5rem] h-[600px]" />
        ) : featuredArticle ? (
          <Link to={`/news/${featuredArticle.id}`} className="lg:col-span-8 group relative rounded-none lg:rounded-[2.5rem] overflow-hidden border-b lg:border border-white/10 aspect-[16/10] lg:aspect-auto h-[400px] lg:h-[600px] cursor-pointer">
            <img 
              src={featuredArticle.thumbnailUrl} 
              alt={featuredArticle.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 space-y-3 lg:space-y-4">
               <div className="flex items-center gap-3">
                  <span className="bg-brand-primary text-white text-[9px] lg:text-[10px] font-bold px-2 py-0.5 lg:px-3 lg:py-1 rounded shadow-lg uppercase tracking-widest">{featuredArticle.category}</span>
                  <span className="text-white/60 text-[10px] lg:text-sm flex items-center gap-2 font-bold uppercase">
                    <Clock size={12} className="text-brand-primary" /> 
                    {featuredArticle.publishedAt?.toDate ? format(featuredArticle.publishedAt.toDate(), 'd MMMM yyyy', { locale: fr }).toUpperCase() : "RÉCEMMENT"}
                  </span>
               </div>
               <h2 className="text-xl lg:text-5xl font-display font-extrabold leading-tight group-hover:text-brand-primary transition-colors line-clamp-2 text-white">
                 {featuredArticle.title}
               </h2>
               <p className="hidden md:block text-white/60 text-lg max-w-xl line-clamp-2">
                 {featuredArticle.excerpt}
               </p>
               <div className="flex items-center gap-4 lg:gap-6 pt-4 border-t border-white/10 mt-4 lg:mt-6 text-[10px] lg:text-sm font-semibold text-white/80">
                  <span className="flex items-center gap-2 hover:text-brand-primary transition-colors"><Heart size={16}/> {featuredArticle.viewCount > 1000 ? `${(featuredArticle.viewCount/1000).toFixed(1)}k` : featuredArticle.viewCount}</span>
                  <span className="flex items-center gap-2 hover:text-brand-primary transition-colors"><Share2 size={16}/> Partager</span>
                  <span className="flex items-center gap-2 hover:text-brand-primary transition-colors ml-auto">Lire l'article <ChevronRight size={16}/></span>
               </div>
            </div>
          </Link>
        ) : null}

        <div className="lg:col-span-4 space-y-6 px-4 lg:px-0 pt-8 lg:pt-0">
           <h3 className="text-xl font-display font-bold flex items-center gap-2 border-b border-slate-200 pb-4 text-slate-900">
              <TrendingUp size={20} className="text-brand-primary" />
              Les plus lus
           </h3>
           <div className="space-y-6">
              {newsLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-xl" />)
              ) : trendingArticles.map((article, i) => (
                <Link key={article.id} to={`/news/${article.id}`} className="flex gap-4 group cursor-pointer">
                  <span className="text-4xl font-display font-black text-slate-100 group-hover:text-brand-primary/20 transition-colors w-12 pt-1">{i + 1}</span>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-lg leading-tight group-hover:text-brand-primary transition-colors line-clamp-2 text-slate-900">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                      {article.category} • {article.publishedAt?.toDate ? format(article.publishedAt.toDate(), 'd MMM yyyy', { locale: fr }).toUpperCase() : "RÉCEMMENT"}
                    </p>
                  </div>
                </Link>
              ))}
           </div>
           
           <div className="p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/10 space-y-4">
              <h4 className="font-display font-extrabold text-xl text-slate-900">Abonnez-vous à l'info</h4>
              <p className="text-sm text-slate-500">Recevez les dernières breaking news directement sur votre profil.</p>
              <div className="flex gap-2">
                 <input type="text" placeholder="Email" className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-primary" />
                 <button className="bg-brand-primary text-white p-2 rounded-xl shadow-lg shadow-brand-primary/20">
                    <ChevronRight size={20} />
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Latest Feed */}
      <section className="space-y-8 pt-12 px-4 lg:px-0">
         <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-display font-bold text-slate-900 inline-block relative">
               Actualités
               <div className="absolute -bottom-[9px] left-0 w-full h-0.5 bg-brand-primary" />
            </h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsLoading ? (
                [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[16/10] bg-slate-50 animate-pulse rounded-3xl" />)
            ) : feedArticles.map((article) => (
              <Link 
                key={article.id} 
                to={`/news/${article.id}`}
                className="group cursor-pointer bg-white overflow-hidden transition-all flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden relative mb-4">
                   <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute bottom-0 left-4 bg-[#f2ec26] px-2 py-0.5 text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                      {article.category}
                   </div>
                </div>
                <div className="space-y-4 flex-1 flex flex-col px-1 pb-4 border-b border-slate-100 lg:border-none uppercase tracking-tight">
                   <h3 className="text-xl font-black font-display leading-tight group-hover:text-brand-primary transition-colors line-clamp-3 text-slate-900">
                     {article.title}
                   </h3>
                   <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto pb-4">
                      <span className="flex items-center gap-1.5 font-medium uppercase tracking-tighter text-[10px]">
                        <Clock size={12} className="text-[#3f51b5]" />
                        {article.publishedAt?.toDate ? format(article.publishedAt.toDate(), 'd MMMM yyyy', { locale: fr }).toUpperCase() : "RÉCEMMENT"}
                      </span>
                   </div>
                </div>
              </Link>
            ))}
         </div>
      </section>
    </div>
  );
};

export default News;
