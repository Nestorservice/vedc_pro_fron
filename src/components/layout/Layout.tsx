import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Users, MapPin, Shield, ArrowRightLeft,
  BarChart3, ScrollText, UserCog, Settings, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'members', label: 'Membres', icon: Users },
  { id: 'territories', label: 'Territoires', icon: MapPin },
  { id: 'servants', label: 'Serviteurs', icon: Shield },
  { id: 'transfers', label: 'Transferts', icon: ArrowRightLeft },
  { id: 'reports', label: 'Rapports', icon: BarChart3 },
  { id: 'audit', label: 'Journal d\'audit', icon: ScrollText },
  { id: 'users', label: 'Utilisateurs', icon: UserCog },
  { id: 'settings', label: 'Parametres', icon: Settings },
];

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-[#0F172A] text-white transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-base font-bold tracking-tight">VEDC</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Systeme d'Information</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} className={isActive ? 'text-blue-400' : ''} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {!collapsed && <span>Deconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0F172A] text-white animate-slide-in">
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
              <div>
                <h1 className="text-base font-bold tracking-tight">VEDC</h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Systeme d'Information</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <nav className="py-4 px-3 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-blue-400' : ''} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {navItems.find(n => n.id === currentView)?.label || 'Tableau de bord'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600">Connecte</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.nom_complet?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-700">{user?.nom_complet || 'Administrateur'}</p>
                <p className="text-xs text-slate-400">{user?.role ? user.role.replace(/_/g, ' ') : 'Super Admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
