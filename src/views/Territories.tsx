import { useState, useEffect } from 'react';
import { MapPin, Plus, ChevronRight, FolderTree, AlertCircle } from 'lucide-react';
import { Card, Button, Badge, Modal, Skeleton, EmptyState } from '../components/ui';
import { api, ApiError, CorsError, NetworkError } from '../services/api';
import type { Territoire, TerritoireArbre, NiveauTerritoire } from '../services/types';
import { useToast } from '../components/ui/Toast';

export function Territories() {
  const [territoires, setTerritoires] = useState<Territoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Territoire | null>(null);
  const { addToast } = useToast();

  useEffect(() => { loadTerritoires(); }, []);

  const loadTerritoires = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.territoires.list();
      setTerritoires(result.donnees);
    } catch (err) {
      if (err instanceof CorsError) { setError('Connexion CORS restreintee.'); addToast('warning', 'CORS', err.message); }
      else if (err instanceof NetworkError) { setError('Serveur inaccessible.'); addToast('error', 'Reseau', err.message); }
      else if (err instanceof ApiError) { setError(err.message); addToast('error', 'API', err.message); }
    } finally { setLoading(false); }
  };

  const niveauLabel = (n: string) => {
    const labels: Record<string, string> = { pays: 'Pays', region: 'Region', departement: 'Departement', district: 'District', eglise_locale: 'Eglise Locale', circonscription: 'Circonscription' };
    return labels[n] || n;
  };

  const niveauColor = (n: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = { pays: 'danger', region: 'warning', departement: 'info', district: 'success', eglise_locale: 'default', circonscription: 'info' };
    return colors[n] || 'default';
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="border-b-2 border-black pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight">Territoires</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mt-2">Hierarchie sur 6 niveaux</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={loadTerritoires} className="text-xs font-medium text-red-600 hover:text-red-800 underline">Reessayer</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h4 className="text-sm font-semibold text-slate-800 mb-4">Arborescence</h4>
          {loading ? (
            <div className="space-y-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          ) : (
            <div className="space-y-1">
              {territoires.filter(t => !t.parent_id).map(t => (
                <TerritoireNode key={t.id} territoire={t} all={territoires} depth={0} selected={selected} onSelect={setSelected} niveauLabel={niveauLabel} />
              ))}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center"><MapPin size={20} className="text-blue-600" /></div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-slate-800">{selected.nom}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={niveauColor(selected.niveau)}>{niveauLabel(selected.niveau)}</Badge>
                    <Badge variant={selected.actif ? 'success' : 'danger'}>{selected.actif ? 'Actif' : 'Inactif'}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div><p className="text-xs text-slate-500">Code</p><p className="text-sm font-medium text-slate-700">{selected.code}</p></div>
                <div><p className="text-xs text-slate-500">ID</p><p className="text-sm font-medium text-slate-700">{selected.id}</p></div>
                <div><p className="text-xs text-slate-500">Cree le</p><p className="text-sm font-medium text-slate-700">{selected.cree_le.slice(0, 10)}</p></div>
                <div><p className="text-xs text-slate-500">Parent</p><p className="text-sm font-medium text-slate-700">{selected.parent_nom || 'Aucun (racine)'}</p></div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-3">Sous-territoires</h5>
                <div className="space-y-2">
                  {territoires.filter(t => t.parent_id === selected.id).map(child => (
                    <div key={child.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all duration-200 cursor-pointer" onClick={() => setSelected(child)}>
                      <div className="flex items-center gap-2"><ChevronRight size={14} className="text-slate-400" /><span className="text-sm font-medium text-slate-700">{child.nom}</span></div>
                      <Badge variant={niveauColor(child.niveau)}>{niveauLabel(child.niveau)}</Badge>
                    </div>
                  ))}
                  {territoires.filter(t => t.parent_id === selected.id).length === 0 && <p className="text-sm text-slate-500 py-2">Aucun sous-territoire</p>}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState title="Selectionnez un territoire" description="Cliquez sur un territoire dans l'arborescence pour voir ses details." icon={<FolderTree size={24} />} />
          )}
        </Card>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouveau Territoire">
        <CreateTerritoireForm onSuccess={() => { setShowCreate(false); loadTerritoires(); addToast('success', 'Territoire cree'); }} />
      </Modal>
    </div>
  );
}

function TerritoireNode({ territoire, all, depth, selected, onSelect, niveauLabel }: {
  territoire: Territoire; all: Territoire[]; depth: number; selected: Territoire | null; onSelect: (t: Territoire) => void; niveauLabel: (n: string) => string;
}) {
  const children = all.filter(t => t.parent_id === territoire.id);
  const isSelected = selected?.id === territoire.id;
  return (
    <div>
      <button onClick={() => onSelect(territoire)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}>
        <MapPin size={14} className={isSelected ? 'text-blue-500' : 'text-slate-400'} />
        <span className="truncate">{territoire.nom}</span>
        <span className="ml-auto text-[10px] text-slate-400">{niveauLabel(territoire.niveau)}</span>
      </button>
      {children.map(child => <TerritoireNode key={child.id} territoire={child} all={all} depth={depth + 1} selected={selected} onSelect={onSelect} niveauLabel={niveauLabel} />)}
    </div>
  );
}

function CreateTerritoireForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ nom: '', niveau: 'district' as NiveauTerritoire, code: '', parent_id: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.territoires.create({ nom: form.nom, niveau: form.niveau, code: form.code, parent_id: form.parent_id || undefined });
      onSuccess();
    } catch { /* handled by parent */ }
    finally { setSubmitting(false); }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Nom du territoire</label>
        <input className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" placeholder="Ex: Douala III" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Niveau</label>
          <select className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" value={form.niveau} onChange={e => setForm({ ...form, niveau: e.target.value as NiveauTerritoire })}>
            <option value="region">Region</option><option value="departement">Departement</option><option value="district">District</option><option value="eglise_locale">Eglise Locale</option><option value="circonscription">Circonscription</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Code</label>
          <input className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" placeholder="Ex: DLA-3" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onSuccess}>Annuler</Button>
        <Button type="submit" loading={submitting}>Creer</Button>
      </div>
    </form>
  );
}
