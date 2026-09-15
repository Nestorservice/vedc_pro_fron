import { useState, useEffect } from 'react';
import { Shield, Award, TrendingUp, Users as UsersIcon, AlertCircle } from 'lucide-react';
import { Card, Badge, Skeleton, EmptyState } from '../components/ui';
import { api, ApiError, CorsError, NetworkError } from '../services/api';
import type { Serviteur, RepartitionGrade } from '../services/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../components/ui/Toast';

export function Servants() {
  const [serviteurs, setServiteurs] = useState<Serviteur[]>([]);
  const [stats, setStats] = useState<RepartitionGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true); setError(null);
    try {
      const [sRes, stRes] = await Promise.all([api.serviteurs.list(), api.serviteurs.getStats()]);
      setServiteurs(sRes.donnees);
      setStats(stRes.donnees);
    } catch (err) {
      if (err instanceof CorsError) { setError('CORS: connexion restreintee.'); addToast('warning', 'CORS', err.message); }
      else if (err instanceof NetworkError) { setError('Serveur inaccessible.'); addToast('error', 'Reseau', err.message); }
      else if (err instanceof ApiError) { setError(err.message); addToast('error', 'API', err.message); }
    } finally { setLoading(false); }
  };

  const gradeColor = (g: string): 'success' | 'info' | 'warning' | 'danger' | 'default' => {
    const colors: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'default'> = { pasteur: 'danger', ancien: 'warning', diacre: 'info', evangliste: 'success', missionnaire: 'info', monitor: 'default' };
    return colors[g.toLowerCase()] || 'default';
  };

  if (loading) return <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <Card key={i}><Skeleton className="h-20 w-full" /></Card>)}</div><Card><Skeleton className="h-64 w-full" /></Card></div>;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="border-b-2 border-black pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight">Serviteurs</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mt-2">{serviteurs.length} serviteurs enregistres</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
          <AlertCircle size={16} className="text-red-500 shrink-0" /><p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={loadData} className="text-xs font-medium text-red-600 hover:text-red-800 underline">Reessayer</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><Shield size={18} className="text-indigo-600" /></div><div><p className="text-2xl font-bold text-slate-800">{serviteurs.length}</p><p className="text-xs text-slate-500">Serviteurs actifs</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Award size={18} className="text-amber-600" /></div><div><p className="text-2xl font-bold text-slate-800">{stats.length}</p><p className="text-xs text-slate-500">Grades distincts</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><TrendingUp size={18} className="text-emerald-600" /></div><div><p className="text-2xl font-bold text-slate-800">{stats.reduce((a, b) => a + b.nombre, 0)}</p><p className="text-xs text-slate-500">Total repertorie</p></div></div></Card>
      </div>

      <Card>
        <h4 className="text-sm font-semibold text-slate-800 mb-1">Repartition par Grade</h4>
        <p className="text-xs text-slate-500 mb-4">Distribution des serviteurs</p>
        {stats.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
              <Bar dataKey="nombre" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="flex items-center justify-center h-60 text-sm text-slate-400">Aucune donnee disponible</div>}
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Serviteur</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Territoire</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Promotion</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
            </tr></thead>
            <tbody>
              {serviteurs.map(s => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"><span className="text-xs font-semibold text-indigo-700">{s.personne_nom[0]}{s.personne_prenom?.[0] || ''}</span></div><span className="text-sm font-medium text-slate-800">{s.personne_nom} {s.personne_prenom}</span></div></td>
                  <td className="px-6 py-4"><Badge variant={gradeColor(s.grade)}>{s.grade}</Badge></td>
                  <td className="px-6 py-4 hidden md:table-cell"><span className="text-sm text-slate-600">{s.territoire_nom}</span></td>
                  <td className="px-6 py-4 hidden lg:table-cell"><span className="text-sm text-slate-500">{s.date_promotion.slice(0, 10)}</span></td>
                  <td className="px-6 py-4"><Badge variant={s.statut === 'actif' ? 'success' : 'danger'}>{s.statut}</Badge></td>
                </tr>
              ))}
              {serviteurs.length === 0 && <tr><td colSpan={5}><EmptyState title="Aucun serviteur" description="Aucun serviteur enregistre." icon={<UsersIcon size={24} />} /></td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
