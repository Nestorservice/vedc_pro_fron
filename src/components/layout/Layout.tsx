import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Users, MapPin, Shield, ArrowRightLeft,
  BarChart3, ScrollText, UserCog, Settings, Menu, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'members', label: 'Membres', icon: Users },
  { id: 'territories', label: 'Territoires', icon: MapPin },
  { id: 'servants', label: 'Serviteurs', icon: Shield },
  { id: 'transfers', label: 'Transferts', icon: ArrowRightLeft },
  { id: 'reports', label: 'Rapports', icon: BarChart3 },
  { id: 'audit', label: 'Audit', icon: ScrollText },
  { id: 'users', label: 'Utilisateurs', icon: UserCog },
  { id: 'settings', label: 'Parametres', icon: Settings },
];

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const currentNav = navItems.find(n => n.id === currentView);

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Header */}
      <header className="hidden md:block border-b-2 border-black bg-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-8 h-20">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                <span className="text-xl font-black">V</span>
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight">VEDC</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Systeme d'Information</p>
              </div>
            </div>
            <nav className="flex items-center gap-1">
              {navItems.slice(0, 6).map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-150 border-b-2 ${
                      isActive
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-600 hover:text-black hover:border-gray-400'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-2 border-2 border-black">
              <div className="w-2 h-2 bg-black" />
              <span className="text-xs font-bold uppercase tracking-wide">Connecte</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
                <span className="text-sm font-black">
                  {user?.nom_complet?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">{user?.nom_complet || 'Administrateur'}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">{user?.role ? user.role.replace(/_/g, ' ') : 'Super Admin'}</p>
              </div>
            </div>
            <button onClick={logout} className="px-4 py-2 text-xs font-bold uppercase tracking-wide border-2 border-black hover:bg-black hover:text-white transition-all duration-150">
              Deconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden border-b-2 border-black bg-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-black flex items-center justify-center">
              <span className="text-lg font-black">V</span>
            </div>
            <div>
              <h1 className="text-base font-black uppercase tracking-tight">VEDC</h1>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{currentNav?.label}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 border-2 border-black"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/90" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l-2 border-black animate-slide-in">
            <div className="flex items-center justify-between px-6 h-16 border-b-2 border-black">
              <h2 className="text-lg font-black uppercase tracking-wide">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 border-2 border-black">
                <X size={20} />
              </button>
            </div>
            <nav className="py-6">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold uppercase tracking-wide border-l-4 transition-all duration-150 ${
                      isActive
                        ? 'border-black bg-black text-white'
                        : 'border-transparent text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-black safe-area-bottom">
              <button onClick={logout} className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wide border-2 border-black hover:bg-black hover:text-white transition-all duration-150">
                Deconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-24 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black z-40 safe-area-bottom">
        <div className="grid grid-cols-5 gap-0">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-4 px-2 border-r-2 border-black last:border-r-0 transition-all duration-150 ${
                  isActive
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-bold uppercase tracking-wide mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
