import { motion } from 'motion/react';
import { User, Mail, Calendar, Settings, LogOut, Shield, Bell, Share2, Bookmark, Heart, History, Tv, Newspaper, LogIn, Star, PenTool, LayoutGrid } from 'lucide-react';
import { logout, db } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, UserRole } from '../types';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'sonner';
import { MOCK_AUTH_KEY } from '../lib/mockAuth';

const Profile = ({ user, role: appRole }: { user: FirebaseUser | null, role?: UserRole | null }) => {
  const { requestPushPermission } = useNotifications();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.displayName || '');
  const [editedBio, setEditedBio] = useState("Passionné par l'actualité tech et grand fan de l'émission \"L'info Décryptée\". Je regarde principalement Horizon News.");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedName(user.displayName || '');
    }
    const fetchProfile = async () => {
      if (!user) return;
      
      // If mock user, use the role from user object
      if (user.uid.startsWith('mock-')) {
        setProfile({
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          role: (user as any).role,
          createdAt: new Date().toISOString()
        });
        return;
      }

      setLoadingProfile(true);
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
          <User size={40} />
        </div>
        <div className="space-y-4">
           <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold text-slate-900">Connectez-vous</h1>
              <p className="text-slate-500 max-w-sm">Veuillez vous connecter pour accéder à votre profil personnalisé JOSEY TV.</p>
           </div>
           <Link 
             to="/login"
             className="flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform mx-auto"
           >
             <LogIn size={20} />
             <span>Se connecter</span>
           </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      if (user.uid.startsWith('mock-')) {
        // Handle mock user update
        const storedMockUser = localStorage.getItem(MOCK_AUTH_KEY);
        if (storedMockUser) {
          const mockData = JSON.parse(storedMockUser);
          const updatedMock = { ...mockData, displayName: editedName };
          localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(updatedMock));
          // Refresh local state
          setProfile(prev => prev ? { ...prev, displayName: editedName } : null);
          toast.success("Profil mis à jour (Mock)");
        }
      } else {
        // Handle real Firebase user update
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, {
          displayName: editedName,
        });
        toast.success("Profil mis à jour avec succès !");
      }
      setIsEditing(false);
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const stats = [
    { label: 'Favoris', count: '12', icon: Heart },
    { label: 'Sauvegardés', count: '45', icon: Bookmark },
    { label: 'Heures Direct', count: '124', icon: History },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Profile */}
      <header className="relative p-6 lg:p-12 rounded-3xl lg:rounded-[3.5rem] overflow-hidden border border-slate-200 group shadow-xl bg-white">
         <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/5" />
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 lg:gap-10">
            <div className="relative">
               <div className="w-24 h-24 lg:w-40 lg:h-40 rounded-full p-1 lg:p-2 border-2 border-brand-primary/30 group-hover:border-brand-primary transition-all duration-500">
                  <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full rounded-full object-cover border-2 lg:border-4 border-white" />
               </div>
               <div className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-brand-primary flex items-center justify-center text-white border-2 lg:border-4 border-white shadow-lg">
                  <Settings size={12} />
               </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3 lg:space-y-4 w-full">
               <div className="space-y-1">
                  {isEditing ? (
                    <input 
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-900 bg-slate-50 border-none rounded-xl p-2 w-full max-w-md focus:ring-2 focus:ring-brand-primary"
                      placeholder="Nom complet"
                    />
                  ) : (
                    <h1 className="text-2xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-900">{profile?.displayName || user.displayName}</h1>
                  )}
                  <p className="text-slate-400 text-sm lg:text-lg flex items-center justify-center md:justify-start gap-2">
                    <Mail size={14} />
                    {user.email}
                  </p>
               </div>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 lg:gap-4">
                  {(profile?.role === 'admin' || profile?.role === 'manager') && (
                    <span className="bg-[#1d2742] text-white text-[8px] lg:text-[10px] font-bold px-3 lg:px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                      <Star size={12} fill="currentColor" className="text-[#ffbe0b]" />
                      Directeur Général
                    </span>
                  )}
                  {profile?.role === 'redchef' && (
                    <span className="bg-brand-primary text-white text-[8px] lg:text-[10px] font-bold px-3 lg:px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                      <PenTool size={12} />
                      Rédacteur en Chef
                    </span>
                  )}
                  {profile?.role === 'writer' && (
                    <span className="bg-[#3f51b5] text-white text-[8px] lg:text-[10px] font-bold px-3 lg:px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                      <LayoutGrid size={12} />
                      Professionnel
                    </span>
                  )}
                  {profile?.role === 'technician' && (
                    <span className="bg-emerald-600 text-white text-[8px] lg:text-[10px] font-bold px-3 lg:px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                      <Settings size={12} />
                      Technicien Média
                    </span>
                  )}
                  {(!profile?.role || profile?.role === 'user') && (
                    <span className="bg-slate-100 text-slate-600 text-[8px] lg:text-[10px] font-bold px-2 lg:px-3 py-1 rounded-full uppercase tracking-widest">Membre Premium</span>
                  )}
                  <span className="text-slate-400 text-[10px] lg:text-xs flex items-center gap-2 font-medium">
                    <Calendar size={12}/> Inscrit en Mai 2024
                  </span>
               </div>
               
               {isEditing ? (
                 <textarea 
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="text-slate-600 text-sm lg:text-base w-full max-w-lg bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-brand-primary"
                  rows={3}
                 />
               ) : (
                 <p className="text-slate-600 text-sm lg:text-base max-w-lg leading-relaxed px-4 md:px-0">
                    {editedBio}
                 </p>
               )}
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto mt-4 lg:mt-0">
               {isEditing ? (
                 <div className="flex flex-col gap-3">
                   <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold hover:scale-105 transition-transform text-sm lg:text-base shadow-xl disabled:opacity-50"
                   >
                      {isSaving ? "Enregistrement..." : "Enregistrer"}
                   </button>
                   <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm lg:text-base"
                   >
                      Annuler
                   </button>
                 </div>
               ) : (
                 <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold hover:scale-105 transition-transform text-sm lg:text-base shadow-xl"
                 >
                    Modifier le profil
                 </button>
               )}
               <button 
                onClick={logout}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-500/10 hover:text-red-500 px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold border border-slate-200 transition-all text-slate-600 text-sm lg:text-base shadow-sm"
              >
                  <LogOut size={18} />
                  Se déconnecter
               </button>
            </div>
         </div>
      </header>

      {/* Stats and Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-[2rem] p-8 space-y-4 border border-slate-200 text-center group hover:bg-slate-50 transition-all bg-white shadow-sm">
             <div className="w-14 h-14 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400 group-hover:text-brand-primary transition-colors">
                <stat.icon size={28} />
             </div>
             <div>
                <p className="text-4xl font-display font-black group-hover:text-brand-primary transition-colors text-slate-900">{stat.count}</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
             </div>
          </div>
        ))}
      </section>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-slate-900">
               <Shield size={24} className="text-brand-primary" />
               Confidentialité & Sécurité
            </h2>
            <div className="glass rounded-[2rem] p-4 divide-y divide-slate-100 bg-white border border-slate-200 shadow-sm">
                {[
                  { label: 'Profil public', desc: 'Permettre aux autres de voir vos favoris', icon: User, active: true },
                  { label: 'Historique de visionnage', desc: 'Enregistrer vos activités sur la plateforme', icon: History, active: true },
                  { label: 'Partage de données', desc: 'Optimiser l\'expérience via l\'analyse', icon: Share2, active: false }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-6 group">
                     <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-primary">
                           <item.icon size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-slate-900">{item.label}</p>
                           <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                     </div>
                     <div className={`w-12 h-6 rounded-full p-1 transition-colors ${item.active ? 'bg-brand-primary' : 'bg-slate-200'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.active ? 'translate-x-6' : ''}`} />
                     </div>
                  </div>
                ))}
            </div>
         </div>

         <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3 text-slate-900">
               <Bell size={24} className="text-brand-primary" />
               Notifications
            </h2>
            <div className="glass rounded-[2rem] p-8 space-y-6 bg-white border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm">Gérez vos alertes pour ne jamais manquer un direct ou une news importante.</p>
                <div className="space-y-4">
                   <button 
                    onClick={requestPushPermission}
                    className="w-full flex items-center justify-center gap-3 bg-brand-primary text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                   >
                     <Bell size={20} />
                     Activer les notifications Push
                   </button>
                   <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                         <Tv size={20} />
                      </div>
                      <div className="flex-1">
                         <p className="font-bold text-sm text-slate-900">Directs TV</p>
                         <p className="text-[10px] text-slate-400">L'info Décryptée, Talk Show...</p>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-brand-primary" />
                   </div>
                   <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                         <Newspaper size={20} />
                      </div>
                      <div className="flex-1">
                         <p className="font-bold text-sm text-slate-900">Breaking News</p>
                         <p className="text-[10px] text-slate-400">Alertes temps réel mondiales</p>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-brand-primary" />
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
