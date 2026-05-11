import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown,
  ChevronRight,
  Home, 
  Tv, 
  Radio as RadioIcon, 
  Library, 
  Newspaper, 
  User, 
  Search, 
  Bell, 
  Settings,
  LogOut,
  Play,
  Share2,
  Bookmark,
  Menu,
  X,
  RotateCcw,
  MessageSquare,
  Phone,
  Smartphone,
  Download,
  Facebook,
  Youtube,
  Music2,
  MessageCircle,
  Calendar,
  PenTool,
  Shield,
  LogIn
} from 'lucide-react';
import { Toaster } from 'sonner';
import { auth, logout, db } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { MOCK_AUTH_KEY, MockUser } from './lib/mockAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationTray } from './components/NotificationTray';
import { seedInitialData } from './lib/seed';
import { UserRole } from './types';
import { AnimatedBackground } from './components/AnimatedBackground';
import { NewsTicker } from './components/NewsTicker';

// Pages
const HomePage = React.lazy(() => import('./pages/Home'));
const LivePage = React.lazy(() => import('./pages/Live'));
const RadioPage = React.lazy(() => import('./pages/Radio'));
const ArchivesPage = React.lazy(() => import('./pages/Archives'));
const NewsPage = React.lazy(() => import('./pages/News'));
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetail'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
const ProgrammePage = React.lazy(() => import('./pages/Programme'));
const LoginPage = React.lazy(() => import('./pages/Login'));
const WriterDashboard = React.lazy(() => import('./pages/WriterDashboard'));
const EditorDashboard = React.lazy(() => import('./pages/EditorDashboard'));
const ManagerDashboard = React.lazy(() => import('./pages/ManagerDashboard'));
const TechnicianDashboard = React.lazy(() => import('./pages/TechnicianDashboard'));

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Check for mock user first (for demo purposes)
    const storedMockUser = localStorage.getItem(MOCK_AUTH_KEY);
    if (storedMockUser) {
      try {
        const mockData: MockUser = JSON.parse(storedMockUser);
        setUser(mockData as any);
        setRole(mockData.role);
        setLoading(false);
      } catch (e) {
        localStorage.removeItem(MOCK_AUTH_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      // Seed initial data if needed (runs in both dev and prod auth states)
      seedInitialData().catch(err => console.error("Seeding error:", err));

      if (u) {
        // If we have a Firebase user, it takes precedence over mock user
        localStorage.removeItem(MOCK_AUTH_KEY);
        
        // Sync user to firestore
        const userDoc = doc(db, 'users', u.uid);
        const snap = await getDoc(userDoc);
        let currentRole: UserRole = 'user' as any;

        if (!snap.exists()) {
          const admins = ['tamaguette82@gmail.com', 'oumoudiallo@horizonmedias.net'];
          currentRole = admins.includes(u.email?.toLowerCase() || '') ? 'manager' : 'user' as any;
          await setDoc(userDoc, {
            uid: u.uid,
            displayName: u.displayName || 'Utilisateur',
            email: u.email,
            photoURL: u.photoURL,
            role: currentRole,
            createdAt: new Date().toISOString(),
          });
        } else {
          currentRole = snap.data().role;
        }
        setRole(currentRole);
        setUser(u);
      } else if (!localStorage.getItem(MOCK_AUTH_KEY)) {
        setUser(null);
        setRole(null);
      }
      
      // Only stop loading if we're not currently processing a mock user or u is resolved
      if (u || !localStorage.getItem(MOCK_AUTH_KEY)) {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Auth Guard Component
  function AuthGuard({ children, requiredRole }: { 
    children: React.ReactNode, 
    requiredRole?: UserRole | UserRole[]
  }) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!role || !roles.includes(role)) {
        return <Navigate to="/" replace />;
      }
    }

    return <>{children}</>;
  }

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <motion.div 
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        <img src="/uploads/HORIZON TV-3.png" alt="Loading Logo" className="h-20 w-auto object-contain" />
      </motion.div>
    </div>
  );

  return (
    <Router>
      <Toaster position="top-center" richColors />
      <NotificationProvider>
        <Layout user={user} role={role}>
          <React.Suspense fallback={<div className="p-8 text-slate-900 font-black uppercase tracking-widest text-center animate-pulse">Chargement en cours...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/radio" element={<RadioPage />} />
              <Route path="/archives" element={<ArchivesPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<ArticleDetailPage />} />
              
              {/* Specific Login Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/auth/login" element={<LoginPage mode="admin" />} />
              <Route path="/redchef/auth/login" element={<LoginPage mode="redchef" />} />
              <Route path="/auteur/auth/login" element={<LoginPage mode="writer" />} />
              
              <Route path="/profile" element={
                <AuthGuard>
                  <ProfilePage user={user} role={role} />
                </AuthGuard>
              } />
              
              <Route path="/programme" element={<ProgrammePage />} />
              
              {/* Role Based Dashboards */}
              <Route path="/writer" element={
                <AuthGuard requiredRole={['writer', 'redchef', 'manager']}>
                  <WriterDashboard user={user} />
                </AuthGuard>
              } />
              <Route path="/editor" element={
                <AuthGuard requiredRole={['redchef', 'manager']}>
                  <EditorDashboard user={user} />
                </AuthGuard>
              } />
              <Route path="/admin" element={
                <AuthGuard requiredRole="manager">
                  <ManagerDashboard user={user} />
                </AuthGuard>
              } />
              <Route path="/technician" element={
                <AuthGuard requiredRole={['technician', 'manager']}>
                  <TechnicianDashboard user={user} />
                </AuthGuard>
              } />
            </Routes>
          </React.Suspense>
        </Layout>
      </NotificationProvider>
    </Router>
  );
}

function Layout({ children, user, role }: { children: React.ReactNode, user: FirebaseUser | null, role: UserRole | null }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const loginProfiles = [
    { name: 'Directeur Général', email: 'Oumoud.dg@horizonmedias.net', role: 'manager' },
    { name: 'Rédacteur en Chef', email: 'redchef@horizonmedias.net', role: 'redchef' },
    { name: 'Professionnel (Journaliste)', email: 'journaliste1@horizonmedias.net', role: 'writer' },
    { name: 'Technicien Média', email: 'technicien@horizonmedias.net', role: 'technician' },
  ];

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show after a small delay to not annoy the user immediately
      setTimeout(() => setShowInstallPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const navItems = [
    { name: 'ACCUEIL', path: '/', icon: Home },
    { name: 'RADIO', path: '/radio', icon: RadioIcon },
    { name: 'TV', path: '/live', icon: Tv },
    { name: 'NEWS', path: '/news', icon: Newspaper },
    { name: 'PROGRAMME', path: '/programme', icon: Calendar },
    { name: 'REPLAY', path: '/archives', icon: RotateCcw },
    { name: 'CONTACT', path: '/contact', icon: MessageSquare },
  ];

  const adminNavItems = [];
  if (role === 'writer' || role === 'redchef' || role === 'manager') {
    adminNavItems.push({ name: 'RÉDACTION', path: '/writer', icon: PenTool as any });
  }
  if (role === 'redchef' || role === 'manager') {
    adminNavItems.push({ name: 'ÉDITION', path: '/editor', icon: Library as any });
  }
  if (role === 'manager') {
    adminNavItems.push({ name: 'ADMIN', path: '/admin', icon: Shield as any });
  }
  if (role === 'technician' || role === 'manager') {
    adminNavItems.push({ name: 'TECH', path: '/technician', icon: Settings as any });
  }

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0f] flex items-center lg:items-start justify-center p-0 lg:p-4">
      <AnimatedBackground />
      <div className="flex min-h-[100dvh] w-full lg:max-w-[1600px] bg-white/95 backdrop-blur-xl lg:rounded-[2.5rem] lg:my-8 text-slate-900 flex-col shadow-2xl lg:border lg:border-white/10 relative overflow-hidden">
        <NewsTicker />
        {/* Header - Fixed at Top */}
        <header className={`h-16 lg:h-24 border-b border-slate-200 flex items-center px-4 lg:px-12 bg-white/95 backdrop-blur-md sticky top-0 z-50 shrink-0 ${location.pathname === '/' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center gap-8 w-full mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/uploads/HORIZON TV-3.png" alt="Logo" className="h-10 lg:h-14 w-auto object-contain" />
          </Link>

          {/* Center Navigation - Desktop Only */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all duration-300 group ${
                    active 
                    ? 'text-brand-primary' 
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    active 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-110' 
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                  }`}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    active ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-0.5'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Search Area */}
          <div className="flex items-center gap-4 lg:gap-8 flex-1 lg:flex-none justify-end">
            
            {/* Desktop Search */}
            <div className="hidden lg:block w-64 xl:w-80 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 focus:bg-white transition-all font-sans"
              />
            </div>

            {/* Contact Info - Desktop Only */}
            <div className="hidden lg:flex items-center gap-6 border-l border-slate-100 pl-6 h-10">
              <a href="tel:622379171" className="flex flex-col items-center group">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                  <Smartphone size={16} />
                </div>
                <span className="text-[10px] font-black text-slate-500 mt-1 group-hover:text-slate-900 transition-colors uppercase tracking-widest">622 37 91 71</span>
              </a>
              <a href="https://wa.me/224627695518" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-all">
                  <MessageCircle size={16} />
                </div>
                <span className="text-[10px] font-black text-slate-500 mt-1 group-hover:text-slate-900 transition-colors uppercase tracking-widest">627 69 55 18</span>
              </a>
            </div>

            <div className="flex items-center gap-1 lg:gap-5">
              <NotificationTray />
              
              <div className="hidden lg:block w-px h-6 bg-slate-200 mx-1" />
              

              {/* User Profile / Login Dropdown - Desktop */}
              <div className="hidden lg:block relative">
                {user ? (
                  <Link 
                    to="/profile"
                    className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                  >
                    <img src={user.photoURL || ''} alt="" className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
                  </Link>
                ) : (
                  <div className="relative">
                    <button 
                      onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                      className="w-10 h-10 flex items-center justify-center bg-[#1d2742] text-white rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-[#1d2742]/10 active:scale-95"
                    >
                      <LogIn size={20} />
                    </button>

                    <AnimatePresence>
                      {isLoginDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsLoginDropdownOpen(false)} 
                          />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 p-3"
                          >
                            <div className="px-4 py-3 mb-2">
                              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Choisir un profil</h3>
                            </div>
                            <div className="space-y-1">
                              {loginProfiles.map((p) => (
                                <Link
                                  key={p.email}
                                  to={`/login?email=${encodeURIComponent(p.email)}`}
                                  onClick={() => setIsLoginDropdownOpen(false)}
                                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                                >
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                    p.role === 'manager' ? 'bg-indigo-50 text-indigo-600' :
                                    p.role === 'redchef' ? 'bg-red-50 text-red-600' :
                                    p.role === 'writer' ? 'bg-amber-50 text-amber-600' :
                                    'bg-emerald-50 text-emerald-600'
                                  }`}>
                                    <User size={18} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900 leading-tight">{p.name}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">{p.email}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-50">
                              <Link 
                                to="/login"
                                onClick={() => setIsLoginDropdownOpen(false)}
                                className="flex items-center justify-center gap-2 py-3 w-full text-brand-primary text-xs font-black uppercase tracking-widest hover:bg-brand-primary/5 rounded-xl transition-all"
                              >
                                Mode manuel
                              </Link>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Mobile Social & Actions */}
              <div className="flex lg:hidden items-center gap-1">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-[#ffbe0b] rounded-full text-[#1d2742] hover:scale-110 transition-all shadow-sm">
                  <Facebook size={14} fill="currentColor" />
                </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-[#ffbe0b] rounded-full text-[#1d2742] hover:scale-110 transition-all shadow-sm">
                <Youtube size={14} fill="currentColor" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-[#ffbe0b] rounded-full text-[#1d2742] hover:scale-110 transition-all shadow-sm">
                <Music2 size={14} strokeWidth={3} />
              </a>
              <a href="https://wa.me/224655565356" target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center bg-[#ffbe0b] rounded-full text-[#1d2742] hover:scale-110 transition-all shadow-sm">
                <MessageCircle size={14} fill="currentColor" />
              </a>
              
              <a 
                href="tel:+224655565356" 
                className="w-8 h-8 flex items-center justify-center bg-[#ffbe0b] rounded-full text-[#1d2742] hover:scale-110 transition-all shadow-sm"
                aria-label="Appeler"
              >
                <Phone size={14} fill="currentColor" />
              </a>

              {/* Mobile Menu Trigger */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="w-8 h-8 flex items-center justify-center bg-[#ffbe0b] rounded-full text-[#1d2742] hover:scale-110 transition-all shadow-sm active:rotate-90"
                aria-label="Menu"
              >
                <Menu size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
        <main className="flex-1 flex flex-col min-w-0 relative">
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-20 bg-[#1d2742] shadow-2xl z-[70] lg:hidden flex flex-col"
              >
                <div className="p-4 flex justify-center">
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                    aria-label="Fermer"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col items-center">
                  {/* Navigation Links - Icon Circles in Single Column */}
                  <div className="flex flex-col gap-6 items-center">
                    {navItems.map((item, index) => {
                      const Icon = item.icon;
                      const active = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex flex-col items-center justify-center p-1"
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                              active 
                              ? 'bg-[#ffbe0b] text-[#1d2742] ring-4 ring-[#ffbe0b]/20' 
                              : 'bg-[#ffbe0b]/20 text-[#ffbe0b] hover:bg-[#ffbe0b]/30'
                            }`}
                          >
                            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                          </motion.div>
                        </Link>
                      );
                    })}

                    {adminNavItems.length > 0 && <div className="w-10 h-px bg-white/10 my-2" />}

                    {adminNavItems.map((item, index) => {
                      const Icon = item.icon;
                      const active = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex flex-col items-center justify-center p-1"
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (navItems.length + index) * 0.05 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                              active 
                              ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20' 
                              : 'bg-white/10 text-white/50 hover:bg-white/20'
                            }`}
                          >
                            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className={`flex-1 w-full flex flex-col relative ${location.pathname === '/' ? 'pb-0' : 'pb-32 lg:pb-12'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`${(location.pathname === '/' || location.pathname === '/radio' || location.pathname === '/live' || location.pathname === '/news') ? 'p-0 min-h-full lg:p-8 lg:min-h-0' : 'p-4 md:p-8'} `}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Navigation - Enhanced Center Circular Design */}
        {location.pathname !== '/' && (
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 px-2 flex items-center justify-around z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            {navItems.slice(0, 5).map((item, index) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              const isMiddle = index === 2; // TV in the center

              if (isMiddle) {
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className="relative -top-5 flex flex-col items-center"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all duration-300 ${active ? 'bg-brand-primary text-white scale-110' : 'bg-white text-slate-400 border-slate-50'}`}>
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <span className={`pt-1 text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${active ? 'text-brand-primary' : 'text-slate-400'}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              }

              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className="relative flex flex-col items-center justify-center h-full flex-1 group"
                >
                  <div className={`relative p-2 transition-all duration-300 ${active ? 'text-brand-primary scale-110' : 'text-slate-400'}`}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  
                  <span className={`relative text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${active ? 'text-brand-primary' : 'text-slate-400'}`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* PWA Install Prompt */}
        <AnimatePresence>
          {showInstallPrompt && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-24 lg:bottom-10 left-6 right-6 lg:left-auto lg:right-10 lg:w-96 z-[100] bg-white rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                  <Download size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-base leading-tight">Installer HORIZON FM & TV</h4>
                  <p className="text-sm text-slate-500">Une expérience plus fluide et rapide sur votre appareil.</p>
                </div>
                <button 
                  onClick={() => setShowInstallPrompt(false)}
                  className="p-2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <button 
                onClick={handleInstallClick}
                className="w-full bg-slate-900 text-white py-3.5 rounded-2xl text-sm font-bold shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Installer maintenant
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Sliding Toggle - Desktop Only */}
        {adminNavItems.length > 0 && (
          <div className="hidden lg:flex fixed bottom-32 lg:bottom-10 left-0 z-[100] flex items-center transition-all duration-500">
            <motion.div 
              initial={false}
              animate={{ x: isAdminMenuOpen ? 0 : -20 }}
              className="flex items-center"
            >
              <button 
                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                className={`w-12 h-14 rounded-r-3xl flex items-center justify-center transition-all duration-500 shadow-2xl border-y border-r ${
                  isAdminMenuOpen 
                    ? 'bg-brand-primary text-white border-white/20' 
                    : 'bg-white text-brand-primary border-slate-200'
                }`}
              >
                <motion.div
                  animate={{ rotate: isAdminMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isAdminMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="ml-4 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 p-3 flex gap-3 overflow-hidden"
                  >
                    {adminNavItems.map((item, index) => {
                      const Icon = item.icon;
                      const active = location.pathname === item.path;
                      return (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, scale: 0.5, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link 
                            to={item.path}
                            onClick={() => setIsAdminMenuOpen(false)}
                            className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-300 group ${
                              active 
                              ? 'text-brand-primary' 
                              : 'text-slate-500 hover:text-brand-primary'
                            }`}
                          >
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                              active 
                              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/40 scale-110' 
                              : 'bg-slate-100 text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary'
                            }`}>
                              <Icon size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">
                              {item.name}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
