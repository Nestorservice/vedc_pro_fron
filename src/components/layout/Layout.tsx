import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Users, MapPin, Shield, ArrowRightLeft,
  BarChart3, ScrollText, UserCog, Settings, Menu, X, LogOut, Bell
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
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const currentNav = navItems.find(n => n.id === currentView);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#F1F5F9] fixed h-screen">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-[#F1F5F9]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center shadow-sm">
            <span className="text-lg font-bold text-white">V</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-[#0F172A]">VEDC</h1>
            <p className="text-xs text-[#94A3B8]">Système d'Information</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB] shadow-sm'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#2563EB]' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#F1F5F9]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.nom_complet?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0F172A] truncate">{user?.nom_complet || 'Administrateur'}</p>
              <p className="text-xs text-[#94A3B8] truncate">{user?.role ? user.role.replace(/_/g, ' ') : 'Super Admin'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-all duration-300"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#F1F5F9] z-40">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center">
              <span className="text-base font-bold text-white">V</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[#0F172A]">VEDC</h1>
              <p className="text-xs text-[#94A3B8]">{currentNav?.label}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl hover:bg-[#F1F5F9] transition-all duration-300"
          >
            <Menu size={20} className="text-[#0F172A]" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl animate-slide-in">
            <div className="flex items-center justify-between px-6 h-16 border-b border-[#F1F5F9]">
              <h2 className="text-lg font-semibold text-[#0F172A]">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl hover:bg-[#F1F5F9] transition-all duration-300">
                <X size={20} className="text-[#0F172A]" />
              </button>
            </div>
            <nav className="py-6 px-3 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#2563EB]'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Desktop Top Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 h-20 bg-white border-b border-[#F1F5F9] sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-semibold text-[#0F172A]">{currentNav?.label || 'Dashboard'}</h2>
            <p className="text-sm text-[#94A3B8] mt-0.5">Bienvenue, {user?.nom_complet?.split(' ')[0] || 'Administrateur'}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl hover:bg-[#F1F5F9] transition-all duration-300 relative">
              <Bell size={20} className="text-[#64748B]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F5F9] z-40 safe-area-bottom">
        <div className="grid grid-cols-5 gap-0">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 ${
                  isActive
                    ? 'text-[#2563EB]'
                    : 'text-[#94A3B8]'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
