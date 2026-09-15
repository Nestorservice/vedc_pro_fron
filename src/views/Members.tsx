import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Edit, Trash2, Users as UsersIcon } from 'lucide-react';
import { Card, Button, Input, Badge, Modal, Skeleton, EmptyState } from '../components/ui';
import { api } from '../services/api';
import type { Personne } from '../services/mockData';

export function Members() {
  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Personne | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await api.personnes.list({ page, search });
    setPersonnes(result.data);
    setTotal(result.total);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(total / 8);

  const statusVariant = (s: string) => {
    switch (s) {
      case 'actif': return 'success';
      case 'transfere': return 'info';
      case 'inactif': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Gestion des Membres</h3>
          <p className="text-sm text-slate-500 mt-0.5">{total} membres enregistres</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} />
          Nouveau Membre
        </Button>
      </div>

      {/* Search & Filters */}
      <Card padding={false}>
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou prenom..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Membre</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Territoire</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Adhesion</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div></div></td>
                    <td className="px-6 py-4 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : personnes.length === 0 ? (
                <tr><td colSpan={5}><EmptyState title="Aucun membre trouve" description="Modifiez vos criteres de recherche ou ajoutez un nouveau membre." icon={<UsersIcon size={24} />} /></td></tr>
              ) : (
                personnes.map(person => (
                  <tr key={person.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <span className="text-xs font-semibold text-slate-600">{person.prenom[0]}{person.nom[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{person.prenom} {person.nom}</p>
                          <p className="text-xs text-slate-500">{person.sexe === 'M' ? 'Homme' : 'Femme'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-slate-600">{person.territoire_nom}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-slate-500">{new Date(person.date_adhesion).toLocaleDateString('fr-FR')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant(person.statut) as 'success' | 'info' | 'danger'}>{person.statut}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === person.id ? null : person.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-all duration-200"
                      >
                        <MoreHorizontal size={16} className="text-slate-500" />
                      </button>
                      {activeDropdown === person.id && (
                        <div className="absolute right-6 top-12 z-10 bg-white rounded-lg shadow-lg border border-slate-100 py-1 w-40 animate-fade-in">
                          <button onClick={() => { setSelectedPerson(person); setActiveDropdown(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-all duration-200">
                            <Eye size={14} /> Voir
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-all duration-200">
                            <Edit size={14} /> Modifier
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200">
                            <Trash2 size={14} /> Archiver
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Page {page} sur {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={14} />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nouveau Membre">
        <CreatePersonForm onSuccess={() => { setShowCreate(false); fetchData(); }} />
      </Modal>

      {/* View Modal */}
      <Modal open={!!selectedPerson} onClose={() => setSelectedPerson(null)} title="Dossier Membre">
        {selectedPerson && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-700">{selectedPerson.prenom[0]}{selectedPerson.nom[0]}</span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-800">{selectedPerson.prenom} {selectedPerson.nom}</h4>
                <p className="text-sm text-slate-500">{selectedPerson.sexe === 'M' ? 'Homme' : 'Femme'} - {selectedPerson.situation_matrimoniale || 'Non renseigne'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500">Date de naissance</p><p className="text-sm font-medium text-slate-700">{new Date(selectedPerson.date_naissance).toLocaleDateString('fr-FR')}</p></div>
              <div><p className="text-xs text-slate-500">Territoire</p><p className="text-sm font-medium text-slate-700">{selectedPerson.territoire_nom}</p></div>
              <div><p className="text-xs text-slate-500">Date d'adhesion</p><p className="text-sm font-medium text-slate-700">{new Date(selectedPerson.date_adhesion).toLocaleDateString('fr-FR')}</p></div>
              <div><p className="text-xs text-slate-500">Telephone</p><p className="text-sm font-medium text-slate-700">{selectedPerson.telephone1 || 'Non renseigne'}</p></div>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Badge variant={statusVariant(selectedPerson.statut) as 'success' | 'info' | 'danger'}>Statut: {selectedPerson.statut}</Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function CreatePersonForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ nom: '', prenom: '', sexe: 'M' as 'M' | 'F', date_naissance: '', telephone1: '', situation_matrimoniale: 'celibataire' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.nom.trim()) errs.nom = 'Le nom est requis';
    if (!form.prenom.trim()) errs.prenom = 'Le prenom est requis';
    if (!form.date_naissance) errs.date_naissance = 'La date de naissance est requise';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await api.personnes.create(form);
    setSubmitting(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} error={errors.nom} placeholder="Ex: Mbarga" />
        <Input label="Prenom" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} error={errors.prenom} placeholder="Ex: Jean-Pierre" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Sexe</label>
          <select value={form.sexe} onChange={e => setForm({ ...form, sexe: e.target.value as 'M' | 'F' })} className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
            <option value="M">Masculin</option>
            <option value="F">Feminin</option>
          </select>
        </div>
        <Input label="Date de naissance" type="date" value={form.date_naissance} onChange={e => setForm({ ...form, date_naissance: e.target.value })} error={errors.date_naissance} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Telephone" value={form.telephone1} onChange={e => setForm({ ...form, telephone1: e.target.value })} placeholder="+237 6XX XXX XXX" />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Situation matrimoniale</label>
          <select value={form.situation_matrimoniale} onChange={e => setForm({ ...form, situation_matrimoniale: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200">
            <option value="celibataire">Celibataire</option>
            <option value="marie">Marie(e)</option>
            <option value="divorce">Divorce(e)</option>
            <option value="veuf">Veuf/Veuve</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onSuccess}>Annuler</Button>
        <Button type="submit" loading={submitting}>Creer le membre</Button>
      </div>
    </form>
  );
}
