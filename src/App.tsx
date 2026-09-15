import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
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
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

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
      <AppContent />
    </AuthProvider>
  );
}
