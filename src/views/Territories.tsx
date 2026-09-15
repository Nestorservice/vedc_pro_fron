import { useState, useEffect } from 'react';
import { MapPin, Plus, ChevronRight, FolderTree } from 'lucide-react';
import { Card, Button, Badge, Modal, Skeleton, EmptyState } from '../components/ui';
import { api } from '../services/api';
import type { Territoire } from '../services/mockData';

export function Territories() {
  const [territoires, setTerritoires] = useState<Territoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Territoire | null>(null);

  useEffect(() => {
    api.territoires.list().then(d => { setTerritoires(d); setLoading(false); });
  }, []);

  const niveauLabel = (n: string) => {
    const labels: Record<string, string> = { pays: 'Pays', region: 'Region', departement: 'Departement', district: 'District', eglise_locale: 'Eglise Locale', circonscription: 'Circonscription' };
    return labels[n] || n;
  };

  const niveauColor = (n: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = { pays: 'danger', region: 'warning', departement: 'info', district: 'success', eglise_locale: 'default', circonscription: 'info' };
    return colors[n] || 'default';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Structure Territoriale</h3>
          <p className="text-sm text-slate-500 mt-0.5">Hierarchie sur 6 niveaux</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Nouveau Territoire
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree View */}
        <Card className="lg:col-span-1">
          <h4 className="text-sm font-semibold text-slate-800 mb-4">Arborescence</h4>
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : (
            <div className="space-y-1">
              {territoires.filter(t => !t.parent_id).map(t => (
                <TerritoireNode key={t.id} territoire={t} all={territoires} depth={0} selected={selected} onSelect={setSelected} niveauLabel={niveauLabel} />
              ))}
            </div>
          )}
        </Card>

        {/* Detail View */}
        <Card className="lg:col-span-2">
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <MapPin size={20} className="text-blue-600" />
                </div>
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
                <div><p className="text-xs text-slate-500">Cree le</p><p className="text-sm font-medium text-slate-700">{new Date(selected.created_at).toLocaleDateString('fr-FR')}</p></div>
                <div><p className="text-xs text-slate-500">Parent</p><p className="text-sm font-medium text-slate-700">{selected.parent_id ? territoires.find(t => t.id === selected.parent_id)?.nom || '-' : 'Aucun (racine)'}</p></div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-3">Sous-territoires</h5>
                <div className="space-y-2">
                  {territoires.filter(t => t.parent_id === selected.id).map(child => (
                    <div key={child.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-all duration-200 cursor-pointer" onClick={() => setSelected(child)}>
                      <div className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{child.nom}</span>
                      </div>
                      <Badge variant={niveauColor(child.niveau)}>{niveauLabel(child.niveau)}</Badge>
                    </div>
                  ))}
                  {territoires.filter(t => t.parent_id === selected.id).length === 0 && (
                    <p className="text-sm text-slate-500 py-2">Aucun sous-territoire</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState title="Selectionnez un territoire" description="Cliquez sur un territoire dans l'arborescence pour voir ses details." icon={<FolderTree size={24} />} />
          )}
        </Card>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouveau Territoire">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowCreate(false); }}>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Nom du territoire</label>
            <input className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" placeholder="Ex: Douala III" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Niveau</label>
              <select className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
                <option value="region">Region</option>
                <option value="departement">Departement</option>
                <option value="district">District</option>
                <option value="eglise_locale">Eglise Locale</option>
                <option value="circonscription">Circonscription</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Code</label>
              <input className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200" placeholder="Ex: DLA-3" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button type="submit">Creer</Button>
          </div>
        </form>
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
      <button
        onClick={() => onSelect(territoire)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <MapPin size={14} className={isSelected ? 'text-blue-500' : 'text-slate-400'} />
        <span className="truncate">{territoire.nom}</span>
        <span className="ml-auto text-[10px] text-slate-400">{niveauLabel(territoire.niveau)}</span>
      </button>
      {children.map(child => (
        <TerritoireNode key={child.id} territoire={child} all={all} depth={depth + 1} selected={selected} onSelect={onSelect} niveauLabel={niveauLabel} />
      ))}
    </div>
  );
}
