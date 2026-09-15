import { useState, useEffect } from 'react';
import { User, Globe, Bell, Shield, Database, Save, Check, Download, Smartphone } from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { useToast } from '../components/ui/Toast';

type SettingsTab = 'profile' | 'api' | 'notifications' | 'security' | 'pwa';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
    // Check if installable
    window.addEventListener('beforeinstallprompt', () => setCanInstall(true));
  }, []);

  const handleInstall = async () => {
    try {
      const deferredPrompt = await new Promise<any>(resolve => {
        window.addEventListener('beforeinstallprompt', resolve, { once: true });
      });
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setCanInstall(false);
      addToast('success', 'Application installee');
    } catch {
      addToast('info', 'Utilisez le menu du navigateur pour installer');
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: User },
    { id: 'api' as const, label: 'Connexion API', icon: Globe },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Securite', icon: Shield },
    { id: 'pwa' as const, label: 'Application', icon: Smartphone },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Page Title */}
      <div className="border-b-2 border-black pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight">Parametres</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mt-2">Configuration du compte et de l'application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs */}
        <div className="lg:col-span-1 space-y-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold uppercase tracking-wide border-l-4 transition-all duration-150 ${
                  activeTab === tab.id ? 'border-black bg-black text-white' : 'border-transparent text-black hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <div className="space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b-2 border-black">
                  <div className="w-20 h-20 border-2 border-black flex items-center justify-center">
                    <span className="text-2xl font-black">{user?.nom_complet?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-wide">{user?.nom_complet || 'Administrateur National'}</h4>
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mt-1">{user?.email || 'admin@vedc.cm'}</p>
                    <Badge className="mt-3">{user?.role ? user.role.replace(/_/g, ' ') : 'super_admin'}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Nom complet" defaultValue={user?.nom_complet || 'Administrateur National'} />
                  <Input label="Email" defaultValue={user?.email || 'admin@vedc.cm'} type="email" />
                  <Input label="Telephone" defaultValue="+237 6XX XXX XXX" />
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider">Langue</label>
                    <select className="w-full px-4 py-3 text-sm border-2 border-black focus:outline-none focus:border-gray-600 transition-all duration-150">
                      <option>Francais</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-8 border-t-2 border-black">
                  <Button onClick={handleSave}>
                    {saved ? <><Check size={16} /> Enregistre</> : <><Save size={16} /> Enregistrer</>}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-black uppercase tracking-wide">Configuration API</h4>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-2">Parametres de connexion au serveur VEDC</p>
                </div>
                <div className="space-y-6">
                  <Input label="URL de l'API" defaultValue="https://railway.app/api/v1" />
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider">Mode de donnees</label>
                    <select className="w-full px-4 py-3 text-sm border-2 border-black focus:outline-none focus:border-gray-600 transition-all duration-150">
                      <option>API de production</option>
                      <option>API de developpement</option>
                    </select>
                  </div>
                  <div className="p-6 border-2 border-black">
                    <div className="flex items-center gap-3">
                      <Database size={18} />
                      <span className="text-sm font-bold uppercase tracking-wide">Connexion etablie</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-2">Derniere verification: il y a 2 minutes</p>
                  </div>
                </div>
                <div className="flex justify-end pt-8 border-t-2 border-black">
                  <Button onClick={handleSave}>
                    {saved ? <><Check size={16} /> Enregistre</> : <><Save size={16} /> Tester & Enregistrer</>}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-black uppercase tracking-wide">Preferences de Notification</h4>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-2">Configurez les alertes et notifications</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Nouveaux transferts en attente', desc: 'Notification quand un transfert necessite votre validation', enabled: true },
                    { label: 'Inscription de nouveaux membres', desc: 'Alerte lors de la creation de fiches membres', enabled: true },
                    { label: 'Promotions de serviteurs', desc: 'Notification des changements de grade', enabled: false },
                    { label: 'Rapports hebdomadaires', desc: 'Resume automatique chaque lundi', enabled: true },
                    { label: 'Alertes de securite', desc: 'Connexions suspectes ou echecs d\'authentification', enabled: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 border-2 border-black hover:bg-gray-50 transition-all duration-150">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide">{item.label}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                      </div>
                      <button className={`w-12 h-6 border-2 border-black relative transition-all duration-150 ${item.enabled ? 'bg-black' : 'bg-white'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 transition-all duration-150 ${item.enabled ? 'right-0.5 bg-white' : 'left-0.5 bg-black'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-8 border-t-2 border-black">
                  <Button onClick={handleSave}>
                    {saved ? <><Check size={16} /> Enregistre</> : <><Save size={16} /> Enregistrer</>}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-black uppercase tracking-wide">Securite du Compte</h4>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-2">Gestion du mot de passe et des sessions</p>
                </div>
                <div className="space-y-6">
                  <Input label="Mot de passe actuel" type="password" placeholder="Entrer votre mot de passe actuel" />
                  <Input label="Nouveau mot de passe" type="password" placeholder="Minimum 12 caracteres" />
                  <Input label="Confirmer le nouveau mot de passe" type="password" placeholder="Confirmer" />
                </div>
                <div className="p-6 border-2 border-black">
                  <h5 className="text-sm font-bold uppercase tracking-wide mb-4">Sessions actives</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border-2 border-black">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-black" />
                        <span className="text-sm font-bold">Navigateur actuel</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Maintenant</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-8 border-t-2 border-black">
                  <Button onClick={handleSave}>
                    {saved ? <><Check size={16} /> Mis a jour</> : <><Save size={16} /> Changer le mot de passe</>}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'pwa' && (
            <Card>
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-black uppercase tracking-wide">Application Progressive</h4>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-2">Installation et configuration PWA</p>
                </div>

                {isInstalled ? (
                  <div className="p-8 border-2 border-black text-center">
                    <div className="w-16 h-16 border-2 border-black flex items-center justify-center mx-auto mb-6">
                      <Check size={28} />
                    </div>
                    <h5 className="text-lg font-black uppercase tracking-wide mb-2">Application Installee</h5>
                    <p className="text-sm text-gray-600">VEDC est installee sur votre appareil et disponible hors ligne.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-8 border-2 border-black">
                      <div className="flex items-start gap-6">
                        <div className="w-14 h-14 border-2 border-black flex items-center justify-center shrink-0">
                          <Download size={24} />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-black uppercase tracking-wide mb-2">Installer VEDC</h5>
                          <p className="text-sm text-gray-600 mb-4">Installez l'application sur votre appareil pour un acces rapide et une experience native.</p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black" /> Acces hors ligne aux donnees en cache</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black" /> Notifications push</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black" /> Experience native sur mobile et desktop</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black" /> Chargement instantane</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {canInstall && (
                      <Button onClick={handleInstall} className="w-full" size="lg">
                        <Download size={18} /> Installer l'application
                      </Button>
                    )}

                    {!canInstall && !isInstalled && (
                      <div className="p-6 border-2 border-black bg-gray-50">
                        <p className="text-sm font-bold uppercase tracking-wide text-center">
                          Utilisez le menu de votre navigateur pour installer l'application
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 border-2 border-black">
                  <h5 className="text-sm font-bold uppercase tracking-wide mb-4">Informations Techniques</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-bold uppercase tracking-wider text-xs text-gray-600">Version</span><p className="font-bold mt-1">1.0.0</p></div>
                    <div><span className="font-bold uppercase tracking-wider text-xs text-gray-600">Service Worker</span><p className="font-bold mt-1">Actif</p></div>
                    <div><span className="font-bold uppercase tracking-wider text-xs text-gray-600">Cache</span><p className="font-bold mt-1">vedc-cache-v1</p></div>
                    <div><span className="font-bold uppercase tracking-wider text-xs text-gray-600">Display Mode</span><p className="font-bold mt-1">Standalone</p></div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
