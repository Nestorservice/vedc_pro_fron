import { useState, useEffect } from 'react';
import { ScrollText, Search } from 'lucide-react';
import { Card, Badge, Skeleton, EmptyState } from '../components/ui';
import { api } from '../services/api';
import type { JournalEntry } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AuditLog() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [actions, setActions] = useState<{ action: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([api.journal.list(), api.journal.getActions()]).then(([e, a]) => {
      setEntries(e); setActions(a); setLoading(false);
    });
  }, []);

  const filtered = entries.filter(e =>
    e.action.toLowerCase().includes(search.toLowerCase()) ||
    e.utilisateur.toLowerCase().includes(search.toLowerCase()) ||
    e.details.toLowerCase().includes(search.toLowerCase())
  );

  const actionVariant = (action: string): 'success' | 'info' | 'warning' | 'danger' | 'default' => {
    if (action.includes('CREATE')) return 'success';
    if (action.includes('UPDATE')) return 'info';
    if (action.includes('DELETE')) return 'danger';
    if (action.includes('LOGIN')) return 'warning';
    return 'default';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card><Skeleton className="h-64 w-full" /></Card>
        <Card><Skeleton className="h-96 w-full" /></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Journal d'Audit</h3>
        <p className="text-sm text-slate-500 mt-0.5">Historique complet des actions du systeme</p>
      </div>

      {/* Actions Chart */}
      <Card>
        <h4 className="text-sm font-semibold text-slate-800 mb-1">Repartition des Actions</h4>
        <p className="text-xs text-slate-500 mb-4">Volume par type d'action</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={actions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="action" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} angle={-15} textAnchor="end" height={50} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
            <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Search */}
      <Card padding={false}>
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrer les entrees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <Badge variant="info">{filtered.length} entrees</Badge>
        </div>

        {/* Entries */}
        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <EmptyState title="Aucune entree" description="Aucune entree ne correspond a votre recherche." icon={<ScrollText size={24} />} />
          ) : (
            filtered.map(entry => (
              <div key={entry.id} className="px-6 py-4 hover:bg-slate-50/50 transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge variant={actionVariant(entry.action)}>{entry.action}</Badge>
                    <span className="text-sm font-medium text-slate-700 truncate">{entry.details}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                    <span className="hidden md:inline">{entry.ressource}</span>
                    <span>{entry.utilisateur}</span>
                    <span>{new Date(entry.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
