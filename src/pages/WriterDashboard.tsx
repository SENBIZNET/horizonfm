import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType, logout } from '../lib/firebase';
import { collection, addDoc, query, where, Timestamp, orderBy, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Article } from '../types';
import { PenTool, FileText, Send, Clock, CheckCircle, AlertCircle, Image as ImageIcon, Upload, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { User as FirebaseUser } from 'firebase/auth';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
  user: FirebaseUser | null;
}

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const QUILL_FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list',
  'link', 'image', 'video'
];

export default function WriterDashboard({ user }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GUINEE');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'news'),
      where('authorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'news');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailUrl(reader.result as string);
      toast.success("Image chargée !");
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content);
    setCategory(article.category);
    setThumbnailUrl(article.thumbnailUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info("Mode édition activé");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('GUINEE');
    setThumbnailUrl('');
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'pending' = 'pending') => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Veuillez remplir le titre et le contenu");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user) throw new Error("Non authentifié");

      const articleData = {
        title,
        content,
        category,
        thumbnailUrl,
        status,
        updatedAt: Timestamp.now(),
        excerpt: content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'
      };

      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), articleData);
        toast.success(status === 'draft' ? "Brouillon mis à jour !" : "Article mis à jour et soumis !");
      } else {
        const newArticle = {
          ...articleData,
          authorId: user.uid,
          authorName: user.displayName || 'Auteur',
          createdAt: Timestamp.now(),
          viewCount: 0
        };
        await addDoc(collection(db, 'news'), newArticle);
        toast.success(status === 'draft' ? "Brouillon enregistré !" : "Article créé et soumis !");
      }

      setEditingId(null);
      setTitle('');
      setContent('');
      setThumbnailUrl('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'articles');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 lg:p-8">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <PenTool size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            {editingId ? "Modifier l'article" : "Espace Auteur"}
          </h1>
          <p className="text-slate-500 text-sm">
            {editingId ? "Modifiez votre brouillon et soumettez-le à nouveau." : "Rédigez vos articles et gérez vos brouillons."}
          </p>
        </div>
        
        <button 
          onClick={() => logout()}
          className="ml-auto flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-all shadow-sm"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form className="bg-white p-6 lg:p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Titre de l'article</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Entrez un titre percutant..."
                className="w-full text-2xl font-bold bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Catégorie</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GUINEE">Guinée</option>
                  <option value="ACTUALITE AFRICAINE">Afrique</option>
                  <option value="INTERNATIONAL">International</option>
                  <option value="SPORT">Sport</option>
                  <option value="CULTURE">Culture</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Image à la une</label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        value={thumbnailUrl}
                        onChange={e => setThumbnailUrl(e.target.value)}
                        placeholder="URL de l'image..."
                        className="w-full bg-slate-50 border-none rounded-xl p-3 pl-10 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-50 text-blue-600 px-4 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-blue-100 transition-colors border border-blue-100 whitespace-nowrap"
                    >
                      <Upload size={16} />
                      Charger
                    </button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  
                  {thumbnailUrl && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden group">
                      <img 
                        src={thumbnailUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => setThumbnailUrl('')}
                          className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/40 transition-all"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Contenu de l'article</label>
              <div className="bg-slate-50 rounded-2xl overflow-hidden min-h-[400px]">
                <ReactQuill 
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Commencez à rédiger votre article..."
                  className="h-full border-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">Vous pouvez insérer des images et des vidéos directement dans le texte via la barre d'outils.</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, 'draft')}
                className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Traitement..." : (
                  <>
                    <FileText size={18} />
                    {editingId ? "Actualiser Brouillon" : "Sauver Brouillon"}
                  </>
                )}
              </button>
              
              <button 
                type="button"
                disabled={isSubmitting}
                className="px-8 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                onClick={(e) => handleSubmit(e, 'pending')}
              >
                <Send size={18} />
                {editingId ? "Soumettre corrections" : "Soumettre"}
              </button>

              {editingId && (
                <button 
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-100 transition-all"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Mes Articles</h2>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md uppercase">{articles.length} total</span>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-2xl" />)
            ) : articles.length === 0 ? (
              <div className="p-12 bg-slate-50 rounded-3xl text-center border-2 border-dashed border-slate-200">
                <FileText className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-slate-400 text-sm font-medium">Aucun brouillon</p>
              </div>
            ) : articles.map(article => (
              <div key={article.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                    article.status === 'draft' ? 'bg-amber-100 text-amber-700' : 
                    article.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {article.status}
                  </span>
                  <div className="flex items-center gap-1 text-slate-300">
                    {article.status === 'published' ? <CheckCircle size={14} /> : 
                     article.status === 'pending' ? <Clock size={14} /> : <AlertCircle size={14} />}
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                  {article.category} • {new Date(article.createdAt?.seconds * 1000).toLocaleDateString()}
                </p>
                
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  {article.status !== 'published' && (
                    <button 
                      onClick={() => startEdit(article)}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Modifier
                    </button>
                  )}
                  <div className="text-[10px] text-slate-300 font-bold">
                    ID: {article.id.substring(0, 5)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
