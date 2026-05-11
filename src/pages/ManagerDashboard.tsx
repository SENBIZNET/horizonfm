import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType, logout } from '../lib/firebase';
import { collection, query, getDocs, setDoc, doc, deleteDoc, orderBy, Timestamp } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';
import { LogOut, UserPlus, Trash2, Shield, Mail, Calendar, Search, Users, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { User as FirebaseUser } from 'firebase/auth';

interface Props {
  user: FirebaseUser | null;
}

export default function ManagerDashboard({ user }: Props) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New user form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('writer');
  const [newUid, setNewUid] = useState(''); // Normally handled by Auth, but for manual sync...
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ ...doc.data() } as UserProfile));
      setUsers(data);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName || !newUid) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsAdding(true);
    try {
      const userRef = doc(db, 'users', newUid);
      const newUserData: UserProfile = {
        uid: newUid,
        email: newEmail,
        displayName: newName,
        role: newRole,
        createdAt: Timestamp.now()
      };
      await setDoc(userRef, newUserData);
      toast.success("Utilisateur ajouté avec succès !");
      setNewEmail('');
      setNewName('');
      setNewUid('');
      fetchUsers();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${newUid}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm("Supprimer ce compte ? L'utilisateur ne pourra plus se connecter.")) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      toast.error("Compte supprimé.");
      fetchUsers();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Gestion des Comptes</h1>
            <p className="text-slate-500 text-sm">Contrôle d'accès et administration des rôles.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-all shadow-sm"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
          
          <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un membre..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full lg:w-80 bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add User Form */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 sticky top-32 space-y-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <UserPlus size={24} className="text-indigo-600" />
              Nouveau Compte
            </h2>
            
            <form onSubmit={handleAddUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">UID Firebase (Manuel)</label>
                <input 
                  value={newUid}
                  onChange={e => setNewUid(e.target.value)}
                  placeholder="ID unique de l'utilisateur"
                  className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-600"
                />
                <p className="text-[9px] text-slate-400 leading-tight italic px-1">L'UID est nécessaire pour lier le compte Firebase Auth au rôle Firestore.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label>
                <input 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adresse Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    type="email"
                    placeholder="email@horizon.gn"
                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rôle Système</label>
                <select 
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-600 appearance-none cursor-pointer"
                >
                  <option value="writer">Auteur (Rédaction)</option>
                  <option value="redchef">Rédacteur en Chef</option>
                  <option value="technician">Technicien Média</option>
                  <option value="manager">Manager (Admin)</option>
                  <option value="user">Utilisateur Standard</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={isAdding}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
              >
                {isAdding ? "Action en cours..." : "Créer le profil"}
              </button>
            </form>
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-[2rem]" />)
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <Users className="mx-auto text-slate-200 h-16 w-16 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Aucun résultat</h3>
                <p className="text-slate-500">Essayez une autre recherche.</p>
              </div>
            ) : filteredUsers.map(user => (
              <div key={user.uid} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                {/* Role Badge Background Decoration */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${
                  user.role === 'manager' ? 'bg-indigo-600' :
                  user.role === 'redchef' ? 'bg-red-600' :
                  user.role === 'technician' ? 'bg-emerald-600' :
                  user.role === 'writer' ? 'bg-amber-600' : 'bg-slate-600'
                }`} />

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-slate-400">
                        {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" /> : user.displayName.charAt(0)}
                     </div>
                     <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{user.displayName}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteUser(user.uid)}
                    className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-50 relative z-10">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    user.role === 'manager' ? 'bg-indigo-50 text-indigo-600' :
                    user.role === 'redchef' ? 'bg-red-50 text-red-600' :
                    user.role === 'technician' ? 'bg-emerald-50 text-emerald-600' :
                    user.role === 'writer' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {user.role}
                  </div>
                  
                  <div className="ml-auto flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-tight">
                    <Calendar size={10} />
                    {user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).getFullYear() : 'RECENT'}
                  </div>
                </div>

                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="w-full py-2 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
                      Détails Compte <ChevronRight size={12} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
