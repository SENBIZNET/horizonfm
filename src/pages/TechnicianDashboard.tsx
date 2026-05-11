import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType, logout } from '../lib/firebase';
import { collection, addDoc, query, orderBy, Timestamp, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { MediaItem } from '../types';
import { Radio, Tv, Upload, Trash2, Clock, PlayCircle, Music, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { User as FirebaseUser } from 'firebase/auth';

interface Props {
  user: FirebaseUser | null;
}

export default function TechnicianDashboard({ user }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'video' | 'audio'>('audio');
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [category, setCategory] = useState('PODCAST');
  const [duration, setDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaItem));
      setMedia(data);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'media');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      toast.error("Le titre et l'URL sont obligatoires");
      return;
    }

    setIsSubmitting(true);
    try {
      const newMedia = {
        title,
        description,
        type,
        url,
        thumbnailUrl: thumbnailUrl || (type === 'audio' ? 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'),
        category,
        duration,
        publishedAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'media'), newMedia);
      toast.success("Média mis en ligne avec succès !");
      
      // Reset form
      setTitle('');
      setDescription('');
      setUrl('');
      setThumbnailUrl('');
      setDuration(0);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'media');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce média ?")) return;
    try {
      await deleteDoc(doc(db, 'media', id));
      toast.success("Média supprimé.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `media/${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
            <Radio size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Espace Technique</h1>
            <p className="text-slate-500 text-sm">Gestion des podcasts et replays vidéo.</p>
          </div>
        </div>

        <button 
          onClick={() => logout()}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-all shadow-sm"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-12 xl:col-span-5">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Upload size={24} className="text-emerald-600" />
              Mise en ligne
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('audio')}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${
                    type === 'audio' ? 'bg-emerald-50 border-emerald-600 text-emerald-600' : 'bg-slate-50 border-transparent text-slate-400'
                  }`}
                >
                  <Music size={18} />
                  Podcast
                </button>
                <button
                  type="button"
                  onClick={() => setType('video')}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${
                    type === 'video' ? 'bg-brand-primary/5 border-brand-primary text-brand-primary' : 'bg-slate-50 border-transparent text-slate-400'
                  }`}
                >
                  <PlayCircle size={18} />
                  Vidéo Replay
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Titre du média</label>
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="L'Invité du Matin - 11 Mai"
                    className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL du fichier (Source)</label>
                  <input 
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://cloud.storage/file.mp4"
                    className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Durée (Secondes)</label>
                    <input 
                      type="number"
                      value={duration}
                      onChange={e => setDuration(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-emerald-600 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Catégorie</label>
                    <input 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      placeholder="Politique, Sport..."
                      className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Traitement..." : "Publier maintenant"}
              </button>
            </form>
          </div>
        </div>

        {/* Media List */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Clock size={24} className="text-slate-400" />
              Historique des publications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-50 animate-pulse rounded-2xl" />)
            ) : media.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <Music className="mx-auto text-slate-200 h-16 w-16 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Aucun média</h3>
                <p className="text-slate-500">Commencez par mettre en ligne votre premier podcast.</p>
              </div>
            ) : media.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative">
                     <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                        {item.type === 'audio' ? <Music size={16} /> : <PlayCircle size={16} />}
                     </div>
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className="font-bold text-slate-900 truncate text-sm">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                      {item.category} • {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                    </p>
                    <p className="text-[9px] text-slate-300 mt-1">
                      Publié le {new Date(item.publishedAt?.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-4 right-4 p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
