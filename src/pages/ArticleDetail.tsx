import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Clock, Share2, Bookmark, Heart, MessageCircle, TrendingUp, Eye } from 'lucide-react';
import { newsService } from '../services/newsService';
import { NewsItem } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await newsService.getArticleById(id);
        if (data) {
          setArticle(data);
          // Fetch recommendations (randomly other latest news for now)
          const latest = await newsService.getLatestNews(4);
          setRecommendations(latest.filter(item => item.id !== id));
        } else {
          navigate('/news');
        }
      } catch (err) {
        console.error("Failed to fetch article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse p-4 lg:p-0">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
        <div className="h-[400px] bg-slate-100 rounded-[2.5rem]" />
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-6 bg-slate-200 rounded-lg w-full" />
          <div className="h-6 bg-slate-200 rounded-lg w-2/3" />
        </div>
      </div>
    );
  }

  if (!article) return null;

  const publishDate = article.publishedAt?.toDate ? article.publishedAt.toDate() : new Date(article.publishedAt);

  return (
    <div className="max-w-6xl mx-auto lg:py-12 pb-24">
      {/* Back Button */}
      <Link 
        to="/news" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-primary mb-8 px-4 lg:px-0 transition-colors font-bold text-sm"
      >
        <ArrowLeft size={18} />
        Retour aux actualités
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-8 space-y-8 px-4 lg:px-0">
          <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 relative group">
            <img 
              src={article.thumbnailUrl} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">
              {article.category}
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-display font-black leading-[1.1] text-slate-900 tracking-tighter uppercase">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-y border-slate-100 py-6">
              <div className="flex items-center gap-2 font-bold">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={16} />
                </div>
                <span>{article.authorName || "Rédaction Horizon"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-300" />
                <time>{format(publishDate, 'PPP', { locale: fr })}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-slate-300" />
                <span>Lecture 5 min</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Eye size={18} className="text-slate-300" />
                <span>{article.viewCount?.toLocaleString() || 0} vues</span>
              </div>
            </div>
          </div>

          <div className="prose prose-slate lg:prose-xl max-w-none prose-headings:font-display prose-headings:font-black prose-headings:tracking-tighter prose-p:leading-relaxed prose-p:text-slate-600">
             <div className="font-display text-xl lg:text-2xl font-bold text-slate-900 mb-8 italic border-l-4 border-brand-primary pl-6 leading-relaxed">
               {article.excerpt}
             </div>
             <div 
               className="font-sans text-lg editor-content"
               dangerouslySetInnerHTML={{ __html: article.content }}
             />
          </div>

          {/* Engagement */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-12">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-primary/10 text-brand-primary font-bold hover:bg-brand-primary hover:text-white transition-all">
                <Heart size={20} />
                <span>124</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">
                <MessageCircle size={20} />
                <span>18</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-primary transition-all">
                <Bookmark size={20} />
              </button>
              <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-primary transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12 px-4 lg:px-0">
          <div className="bg-slate-50 rounded-[2rem] p-8 space-y-6">
            <h3 className="text-xl font-display font-black uppercase tracking-tighter flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-primary" />
              À lire aussi
            </h3>
            <div className="space-y-6">
              {recommendations.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/news/${item.id}`}
                  className="group flex gap-4"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest">{item.category}</span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-3">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/news" className="block text-center py-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl text-sm font-bold transition-all mt-4">
              Voir tout
            </Link>
          </div>

          <div className="bg-[#1d2742] rounded-[2rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-3xl rounded-full translate-x-12 -translate-y-12" />
            <div className="relative space-y-4">
              <h3 className="text-2xl font-display font-black leading-tight uppercase tracking-tighter">Ne manquez rien du Syli National</h3>
              <p className="text-slate-300 text-sm">Abonnez-vous à notre newsletter pour recevoir les dernières infos.</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="votre@email.com" 
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-all"
                />
                <button className="w-full bg-brand-primary text-white py-3.5 rounded-xl text-sm font-bold shadow-xl shadow-brand-primary/20 active:scale-95 transition-all">
                  S'abonner
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticleDetail;
