import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType, logout } from '../lib/firebase';
import { collection, query, onSnapshot, updateDoc, doc, Timestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { Article } from '../types';
import { BookOpen, Check, X, Eye, Trash2, Calendar, User, MessageSquare, Clock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { User as FirebaseUser } from 'firebase/auth';

interface Props {
  user: FirebaseUser | null;
}

export default function EditorDashboard({ user }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'news');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePublish = async (id: string) => {
    try {
      const articleRef = doc(db, 'news', id);
      await updateDoc(articleRef, {
        status: 'published',
        publishedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      toast.success("Article publié sur le site public !");
      if (selectedArticle?.id === id) setSelectedArticle(prev => prev ? { ...prev, status: 'published' } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `news/${id}`);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const articleRef = doc(db, 'news', id);
      await updateDoc(articleRef, {
        status: 'draft',
        updatedAt: Timestamp.now()
      });
      toast.info("Article renvoyé en brouillon pour correction.");
      if (selectedArticle?.id === id) setSelectedArticle(prev => prev ? { ...prev, status: 'draft' } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `news/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cet article définitivement ?")) return;
    try {
      await deleteDoc(doc(db, 'news', id));
      toast.error("Article supprimé.");
      if (selectedArticle?.id === id) setSelectedArticle(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `news/${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Rédaction en Chef</h1>
            <p className="text-slate-500 text-sm">Révision, correction et publication des articles.</p>
          </div>
        </div>

        <button 
          onClick={() => logout()}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-all shadow-sm"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List of Articles */}
        <div className="lg:col-span-4 space-y-4 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
          <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md py-2 z-10">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">File d'attente</h2>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                {articles.filter(a => a.status === 'pending').length} en attente
              </span>
            </div>
          </div>

          {loading ? (
            [1,2,3,4,5].map(i => <div key={i} className="h-28 bg-slate-50 animate-pulse rounded-2xl" />)
          ) : articles.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase text-xs">Aucun article à traiter</p>
            </div>
          ) : articles.map(article => (
            <button 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className={`w-full text-left p-5 rounded-2xl border transition-all ${
                selectedArticle?.id === article.id 
                ? 'bg-slate-900 border-slate-900 shadow-xl ring-4 ring-slate-100' 
                : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                  article.status === 'published' ? 'bg-green-100 text-green-700' :
                  article.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {article.status}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  {article.category}
                </span>
              </div>
              <h4 className={`font-bold leading-snug line-clamp-2 ${selectedArticle?.id === article.id ? 'text-white' : 'text-slate-900'}`}>
                {article.title}
              </h4>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100/10">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                  <User size={12} className="text-red-500" />
                  {article.authorName}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase ml-auto">
                  <Calendar size={12} />
                  {article.createdAt?.seconds 
                    ? new Date(article.createdAt.seconds * 1000).toLocaleDateString()
                    : 'Date inconnue'}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Article Review Panel */}
        <div className="lg:col-span-8">
          {selectedArticle ? (
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-full max-h-[800px]">
              {/* Review Header */}
              <div className="p-6 lg:p-10 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Révision</span>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={14} /> {selectedArticle.createdAt?.seconds 
                        ? new Date(selectedArticle.createdAt.seconds * 1000).toLocaleString()
                        : 'Date inconnue'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2 font-bold uppercase text-xs tracking-wider">
                       <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">
                          {selectedArticle.authorName.charAt(0)}
                       </div>
                       Par {selectedArticle.authorName}
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div className="font-bold uppercase text-xs tracking-wider">{selectedArticle.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => handleReject(selectedArticle.id)}
                    className="flex-1 lg:flex-none p-3 lg:px-6 lg:py-3 bg-slate-100 text-slate-900 rounded-2xl font-bold text-sm tracking-tight hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Refuser
                  </button>
                  <button 
                    onClick={() => handlePublish(selectedArticle.id)}
                    disabled={selectedArticle.status === 'published'}
                    className="flex-1 lg:flex-none p-3 lg:px-8 lg:py-3 bg-red-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    {selectedArticle.status === 'published' ? 'Déjà publié' : 'Publier'}
                  </button>
                </div>
              </div>

              {/* Review Body */}
              <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-8">
                <div className="prose prose-slate max-w-none">
                  <div 
                    className="text-xl text-slate-600 font-serif leading-relaxed editor-content"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />
                </div>
                
                {selectedArticle.thumbnailUrl && (
                  <div className="rounded-3xl overflow-hidden shadow-lg">
                    <img src={selectedArticle.thumbnailUrl} alt="Thumbnail preview" className="w-full h-auto" />
                  </div>
                )}
              </div>

              {/* Review Footer */}
              <div className="p-6 bg-slate-900 text-white/60 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                    <MessageSquare size={16} /> Ajouter un commentaire
                  </button>
                  <button className="flex items-center gap-2 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                    <Eye size={16} /> Mode aperçu
                  </button>
                </div>
                <button 
                  onClick={() => handleDelete(selectedArticle.id)}
                  className="p-2 text-white/30 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[600px] bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
               <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center text-slate-400 mb-6">
                  <BookOpen size={40} />
               </div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sélectionnez un article</h3>
               <p className="text-slate-500 max-w-sm mt-2">Cliquez sur un article dans la file d'attente à gauche pour commencer la révision.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
