import { useState, useEffect } from 'react';
import { UserCog, Plus, Shield, Eye, Key } from 'lucide-react';
import { Card, Button, Badge, Modal, Skeleton, EmptyState, Input } from '../components/ui';
import { api } from '../services/api';
import type { Utilisateur } from '../services/mockData';

export function UsersView() {
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showPermissions, setShowPermissions] = useState<Utilisateur | null>(null);
  const [showReset, setShowReset] = useState<Utilisateur | null>(null);

  useEffect(() => {
    api.utilisateurs.list().then(d => { setUsers(d); setLoading(false); });
  }, []);

  const roleLabel = (r: string) => {
    const labels: Record<string, string> = { super_admin: 'Super Admin', admin_national: 'Admin National', admin_regional: 'Admin Regional', admin_local: 'Admin Local', lecteur: 'Lecteur' };
    return labels[r] || r;
  };

  const roleVariant = (r: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = { super_admin: 'danger', admin_national: 'warning', admin_regional: 'info', admin_local: 'success', lecteur: 'default' };
    return variants[r] || 'default';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card><Skeleton className="h-96 w-full" /></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Gestion des Utilisateurs</h3>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} comptes applicatifs</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Nouveau Compte
        </Button>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Derniere Connexion</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <span className="text-xs font-semibold text-slate-600">{u.nom_complet.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{u.nom_complet}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant={roleVariant(u.role)}>{roleLabel(u.role)}</Badge></td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-slate-500">{new Date(u.derniere_connexion).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.actif ? 'success' : 'danger'}>{u.actif ? 'Actif' : 'Inactif'}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setShowPermissions(u)} className="p-2 rounded-lg hover:bg-slate-100 transition-all duration-200" title="Permissions">
                        <Shield size={14} className="text-slate-500" />
                      </button>
                      <button onClick={() => setShowReset(u)} className="p-2 rounded-lg hover:bg-slate-100 transition-all duration-200" title="Reinitialiser mot de passe">
                        <Key size={14} className="text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="Aucun utilisateur" description="Aucun compte enregistre." icon={<UserCog size={24} />} /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouveau Compte">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowCreate(false); }}>
          <Input label="Nom complet" placeholder="Ex: Jean Mbarga" />
          <Input label="Email" type="email" placeholder="Ex: jean@vedc.cm" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <select className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
              <option value="lecteur">Lecteur</option>
              <option value="admin_local">Admin Local</option>
              <option value="admin_regional">Admin Regional</option>
              <option value="admin_national">Admin National</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <Input label="Mot de passe initial" type="password" placeholder="Minimum 12 caracteres" />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button type="submit">Creer le compte</Button>
          </div>
        </form>
      </Modal>

      {/* Permissions Modal */}
      <Modal open={!!showPermissions} onClose={() => setShowPermissions(null)} title={`Permissions - ${showPermissions?.nom_complet || ''}`}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Permissions associees au role <Badge variant={roleVariant(showPermissions?.role || '')}>{roleLabel(showPermissions?.role || '')}</Badge></p>
          <div className="space-y-2">
            {['LECTURE_MEMBRES', 'ECRITURE_MEMBRES', 'GESTION_TERRITOIRES', 'GESTION_SERVITEURS', 'VALIDER_TRANSFERTS', 'VOIR_NOTES_SENSIBLES', 'GESTION_UTILISATEURS', 'EXPORT_RAPPORTS'].map(perm => (
              <div key={perm} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <span className="text-sm font-mono text-slate-700">{perm}</span>
                <div className="w-9 h-5 rounded-full bg-emerald-500 relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={!!showReset} onClose={() => setShowReset(null)} title="Reinitialiser le mot de passe">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Entrer un nouveau mot de passe pour <strong>{showReset?.nom_complet}</strong></p>
          <Input label="Nouveau mot de passe" type="password" placeholder="Minimum 12 caracteres" />
          <Input label="Confirmer" type="password" placeholder="Confirmer le mot de passe" />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setShowReset(null)}>Annuler</Button>
            <Button onClick={() => setShowReset(null)}>Reinitialiser</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
