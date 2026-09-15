import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/ui/Toast';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './views/Dashboard';
import { Members } from './views/Members';
import { Territories } from './views/Territories';
import { Servants } from './views/Servants';
import { Transfers } from './views/Transfers';
import { Reports } from './views/Reports';
import { AuditLog } from './views/AuditLog';
import { UsersView } from './views/Users';
import { SettingsView } from './views/Settings';
import { Login } from './views/Login';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F172A] flex items-center justify-center">
            <span className="text-xl font-bold text-white">V</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-sm text-slate-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'members': return <Members />;
      case 'territories': return <Territories />;
      case 'servants': return <Servants />;
      case 'transfers': return <Transfers />;
      case 'reports': return <Reports />;
      case 'audit': return <AuditLog />;
      case 'users': return <UsersView />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
