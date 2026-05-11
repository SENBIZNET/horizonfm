import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { MOCK_AUTH_KEY, getMockUserByEmail } from '../lib/mockAuth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Newspaper, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage({ mode }: { mode?: 'admin' | 'redchef' | 'writer' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
      // Mock password based on provided credentials
      setPassword('Guinee@2026');
    }
  }, [location.search]);

  const getRoleTitle = () => {
    switch (mode) {
      case 'admin': return "Espace Administration";
      case 'redchef': return "Espace Rédacteur en Chef";
      case 'writer': return "Espace Auteur";
      default: return "Portail de gestion éditoriale";
    }
  };

  const from = (location.state as any)?.from?.pathname || (
    mode === 'admin' ? '/admin' : 
    mode === 'redchef' ? '/editor' : 
    mode === 'writer' ? '/writer' : "/"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    try {
      // INTERCEPT MOCK USERS
      const mockUser = getMockUserByEmail(email);
      if (mockUser && mockUser.password === password) {
        localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(mockUser));
        toast.success(`Bienvenue, ${mockUser.displayName} !`);
        // Force reload to pick up mock user in App.tsx
        window.location.href = from;
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Content de vous revoir !");
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Auth Error:", error.code, error.message);
      
      if (error.code === 'auth/operation-not-allowed') {
        toast.error(
          "ERREUR : La connexion par Email n'est pas activée dans la console Firebase.",
          { duration: 10000, description: "Activez 'Email/Password' dans Authentication > Sign-in method sur console.firebase.google.com" }
        );
      } else if (error.code === 'auth/network-request-failed') {
        toast.error(
          "Erreur réseau ou connexion bloquée.",
          { duration: 10000, description: "Vérifiez votre connexion internet ou vos extensions navigateur (bloqueurs de pubs)." }
        );
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error("Email ou mot de passe incorrect.");
      } else {
        toast.error("Une erreur est survenue : " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 lg:p-12 space-y-8">
          {/* Logo/Brand */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl">
              <Newspaper size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Horizon Médias</h1>
            <p className="text-slate-500 text-sm font-medium">{getRoleTitle()}</p>
          </div>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nom@horizonmedias.net"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password-input" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button 
                id="submit-login"
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn size={18} />
                )}
                Connexion
              </button>
            </div>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-slate-400 font-medium italic">
              Connectez-vous avec vos identifiants Horizon Médias fournis par l'administration.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100 flex items-center justify-center gap-2">
            <Shield size={14} className="text-slate-400" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Système sécurisé Horizon GN</span>
        </div>
      </div>
    </div>
  );
}
