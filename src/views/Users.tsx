import { useState, useEffect } from 'react';
import { UserCog, Plus, Shield, Key, AlertCircle } from 'lucide-react';
import { Card, Button, Badge, Modal, Skeleton, EmptyState, Input } from '../components/ui';
import { api, ApiError, CorsError, NetworkError } from '../services/api';
import type { Compte, RoleUtilisateur } from '../services/types';
import { useToast } from '../components/ui/Toast';

export function UsersView() {
  const [users, setUsers] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showPermissions, setShowPermissions] = useState<Compte | null>(null);
  const [showReset, setShowReset] = useState<Compte | null>(null);
  const { addToast } = useToast();

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true); setError(null);
    try {
      const result = await api.utilisateurs.list();
      setUsers(result.donnees);
    } catch (err) {
      if (err instanceof CorsError) { setError('CORS: connexion restreintee.'); addToast('warning', 'CORS', err.message); }
      else if (err instanceof NetworkError) { setError('Serveur inaccessible.'); addToast('error', 'Reseau', err.message); }
      else if (err instanceof ApiError) { setError(err.message); addToast('error', 'API', err.message); }
    } finally { setLoading(false); }
  };

  const roleLabel = (r: string) => {
    const labels: Record<string, string> = { super_admin: 'Super Admin', admin_national: 'Admin National', admin_regional: 'Admin Regional', admin_local: 'Admin Local', lecteur: 'Lecteur' };
    return labels[r] || r;
  };

  const roleVariant = (r: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = { super_admin: 'danger', admin_national: 'warning', admin_regional: 'info', admin_local: 'success', lecteur: 'default' };
    return variants[r] || 'default';
  };

  if (loading) return <Card><Skeleton className="h-96 w-full" /></Card>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Gestion des Utilisateurs</h3>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} comptes applicatifs</p>
        </div>
        <Button onClick={() => setShowCreate(true)}><Plus size={16} /> Nouveau Compte</Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
          <AlertCircle size={16} className="text-red-500 shrink-0" /><p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={loadUsers} className="text-xs font-medium text-red-600 hover:text-red-800 underline">Reessayer</button>
        </div>
      )}

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilisateur</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Derniere Connexion</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <span className="text-xs font-semibold text-slate-600">{u.nom_complet.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div><p className="text-sm font-medium text-slate-800">{u.nom_complet}</p><p className="text-xs text-slate-500">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant={roleVariant(u.role)}>{roleLabel(u.role)}</Badge></td>
                  <td className="px-6 py-4 hidden md:table-cell"><span className="text-sm text-slate-500">{u.derniere_connexion ? new Date(u.derniere_connexion).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Jamais'}</span></td>
                  <td className="px-6 py-4"><Badge variant={u.actif ? 'success' : 'danger'}>{u.actif ? 'Actif' : 'Inactif'}</Badge></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setShowPermissions(u)} className="p-2 rounded-lg hover:bg-slate-100 transition-all duration-200" title="Permissions"><Shield size={14} className="text-slate-500" /></button>
                      <button onClick={() => setShowReset(u)} className="p-2 rounded-lg hover:bg-slate-100 transition-all duration-200" title="Reinitialiser mot de passe"><Key size={14} className="text-slate-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5}><EmptyState title="Aucun utilisateur" description="Aucun compte enregistre." icon={<UserCog size={24} />} /></td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouveau Compte">
        <CreateUserForm onSuccess={() => { setShowCreate(false); loadUsers(); addToast('success', 'Compte cree'); }} />
      </Modal>

      <Modal open={!!showPermissions} onClose={() => setShowPermissions(null)} title={`Permissions - ${showPermissions?.nom_complet || ''}`}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Permissions associees au role <Badge variant={roleVariant(showPermissions?.role || '')}>{roleLabel(showPermissions?.role || '')}</Badge></p>
          <div className="space-y-2">
            {['LECTURE_MEMBRES', 'ECRITURE_MEMBRES', 'GESTION_TERRITOIRES', 'GESTION_SERVITEURS', 'VALIDER_TRANSFERTS', 'VOIR_NOTES_SENSIBLES', 'GESTION_UTILISATEURS', 'EXPORT_RAPPORTS'].map(perm => (
              <div key={perm} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <span className="text-sm font-mono text-slate-700">{perm}</span>
                <div className="w-9 h-5 rounded-full bg-emerald-500 relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" /></div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

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

function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ email: '', nom_complet: '', role: 'lecteur' as RoleUtilisateur, territoire_id: '', mot_de_passe: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.utilisateurs.create(form);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) { /* error handled by toast in parent */ }
    } finally { setSubmitting(false); }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Nom complet" value={form.nom_complet} onChange={e => setForm({ ...form, nom_complet: e.target.value })} placeholder="Ex: Jean Mbarga" required />
      <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Ex: jean@vedc.cm" required />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Role</label>
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as RoleUtilisateur })} className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
          <option value="lecteur">Lecteur</option><option value="admin_local">Admin Local</option><option value="admin_regional">Admin Regional</option><option value="admin_national">Admin National</option><option value="super_admin">Super Admin</option>
        </select>
      </div>
      <Input label="ID Territoire" value={form.territoire_id} onChange={e => setForm({ ...form, territoire_id: e.target.value })} placeholder="Ex: t1" required />
      <Input label="Mot de passe initial" type="password" value={form.mot_de_passe} onChange={e => setForm({ ...form, mot_de_passe: e.target.value })} placeholder="Minimum 12 caracteres" required />
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onSuccess}>Annuler</Button>
        <Button type="submit" loading={submitting}>Creer le compte</Button>
      </div>
    </form>
  );
}
