import { useState } from 'react';
import { User, Globe, Bell, Shield, Database, Save, Check } from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { useToast } from '../components/ui/Toast';

type SettingsTab = 'profile' | 'api' | 'notifications' | 'security';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: User },
    { id: 'api' as const, label: 'Connexion API', icon: Globe },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Securite', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Parametres</h3>
        <p className="text-sm text-slate-500 mt-0.5">Configuration du compte et de l'application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} className={activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{user?.nom_complet?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-800">{user?.nom_complet || 'Administrateur National'}</h4>
                    <p className="text-sm text-slate-500">{user?.email || 'admin@vedc.cm'}</p>
                    <Badge variant="info" className="mt-2">{user?.role?.replace('_', ' ') || 'super_admin'}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Nom complet" defaultValue={user?.nom_complet || 'Administrateur National'} />
                  <Input label="Email" defaultValue={user?.email || 'admin@vedc.cm'} type="email" />
                  <Input label="Telephone" defaultValue="+237 6XX XXX XXX" />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Langue</label>
                    <select className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
                      <option>Francais</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button onClick={handleSave}>
                    {saved ? <><Check size={16} /> Enregistre</> : <><Save size={16} /> Enregistrer</>}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">Configuration API</h4>
                  <p className="text-xs text-slate-500">Parametres de connexion au serveur VEDC</p>
                </div>
                <div className="space-y-4">
                  <Input label="URL de l'API" defaultValue="https://vedc-api-production.up.railway.app/api/v1" />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Mode de donnees</label>
                    <select className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
                      <option>Donnees de demonstration (Mock)</option>
                      <option>API de production</option>
                      <option>API de developpement</option>
                    </select>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Connexion etablie</span>
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">Derniere verification: il y a 2 minutes</p>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button onClick={handleSave}>
                    {saved ? <><Check size={16} /> Enregistre</> : <><Save size={16} /> Tester & Enregistrer</>}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">Preferences de Notification</h4>
                  <p className="text-xs text-slate-500">Configurez les alertes et notifications</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Nouveaux transferts en attente', desc: 'Notification quand un transfert necessite votre validation', enabled: true },
                    { label: 'Inscription de nouveaux membres', desc: 'Alerte lors de la creation de fiches membres', enabled: true },
                    { label: 'Promotions de serviteurs', desc: 'Notification des changements de grade', enabled: false },
                    { label: 'Rapports hebdomadaires', desc: 'Resume automatique chaque lundi', enabled: true },
                    { label: 'Alertes de securite', desc: 'Connexions suspectes ou echecs d\'authentification', enabled: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all duration-200">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-200 ${item.enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${item.enabled ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button onClick={handleSave}>
                    {saved ? <><Check size={16} /> Enregistre</> : <><Save size={16} /> Enregistrer</>}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-1">Securite du Compte</h4>
                  <p className="text-xs text-slate-500">Gestion du mot de passe et des sessions</p>
                </div>
                <div className="space-y-4">
                  <Input label="Mot de passe actuel" type="password" placeholder="Entrer votre mot de passe actuel" />
                  <Input label="Nouveau mot de passe" type="password" placeholder="Minimum 12 caracteres" />
                  <Input label="Confirmer le nouveau mot de passe" type="password" placeholder="Confirmer" />
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-700 mb-2">Sessions actives</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm text-slate-700">Navigateur actuel</span>
                      </div>
                      <span className="text-xs text-slate-500">Maintenant</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button onClick={handleSave}>
                    {saved ? <><Check size={16} /> Mis a jour</> : <><Save size={16} /> Changer le mot de passe</>}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
