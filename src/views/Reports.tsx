import { useState, useEffect } from 'react';
import { BarChart3, Download, FileText, Users, MapPin, ArrowRightLeft, Shield, AlertCircle } from 'lucide-react';
import { Card, Button, Badge, Skeleton } from '../components/ui';
import { api, ApiError, CorsError, NetworkError } from '../services/api';
import type { TableauDeBord, RapportMouvements, RepartitionGrade, EffectifParTerritoire, DescriptionRapport } from '../services/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '../components/ui/Toast';

const reportCategories = [
  { id: 'dashboard', label: 'Tableau de bord', description: 'Chiffres cles de la page d\'accueil', icon: BarChart3 },
  { id: 'effectifs', label: 'Effectifs par territoire', description: 'Repartition des membres par district', icon: Users },
  { id: 'demographie', label: 'Composition demographique', description: 'Analyse par sexe, age, situation', icon: FileText },
  { id: 'mouvements', label: 'Mouvements mensuels', description: 'Entrees et transferts par mois', icon: ArrowRightLeft },
  { id: 'serviteurs', label: 'Serviteurs par grade', description: 'Repartition et evolution des grades', icon: Shield },
  { id: 'territoires', label: 'Carte territoriale', description: 'Hierarchie et couverture', icon: MapPin },
];

export function Reports() {
  const [selectedReport, setSelectedReport] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<TableauDeBord | null>(null);
  const [mouvements, setMouvements] = useState<RapportMouvements | null>(null);
  const [statsGrade, setStatsGrade] = useState<RepartitionGrade[]>([]);
  const [effectifs, setEffectifs] = useState<EffectifParTerritoire[]>([]);
  const { addToast } = useToast();

  useEffect(() => { loadReportData(selectedReport); }, [selectedReport]);

  const loadReportData = async (reportId: string) => {
    setLoading(true); setError(null);
    try {
      switch (reportId) {
        case 'dashboard': {
          const res = await api.rapports.getDashboard();
          setDashboard(res.donnees);
          break;
        }
        case 'mouvements': {
          const res = await api.rapports.getMouvements();
          setMouvements(res.donnees);
          break;
        }
        case 'serviteurs': {
          const res = await api.serviteurs.getStats();
          setStatsGrade(res.donnees);
          break;
        }
        case 'effectifs': {
          const res = await api.rapports.getEffectifs();
          setEffectifs(res.donnees.territoires);
          break;
        }
      }
    } catch (err) {
      if (err instanceof CorsError) { setError('CORS: connexion restreintee.'); addToast('warning', 'CORS', err.message); }
      else if (err instanceof NetworkError) { setError('Serveur inaccessible.'); addToast('error', 'Reseau', err.message); }
      else if (err instanceof ApiError) { setError(err.message); addToast('error', 'API', err.message); }
    } finally { setLoading(false); }
  };

  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  const renderReport = () => {
    if (loading) return <Card><Skeleton className="h-64 w-full" /></Card>;
    if (error) return (
      <Card>
        <div className="flex flex-col items-center justify-center py-16">
          <AlertCircle size={32} className="text-red-400 mb-3" />
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <Button variant="secondary" size="sm" onClick={() => loadReportData(selectedReport)}>Reessayer</Button>
        </div>
      </Card>
    );

    switch (selectedReport) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {dashboard ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg"><p className="text-2xl font-bold text-blue-700">{dashboard.total_membres.toLocaleString()}</p><p className="text-xs text-blue-600 mt-1">Membres total</p></div>
                  <div className="p-4 bg-indigo-50 rounded-lg"><p className="text-2xl font-bold text-indigo-700">{dashboard.total_serviteurs.toLocaleString()}</p><p className="text-xs text-indigo-600 mt-1">Serviteurs</p></div>
                  <div className="p-4 bg-emerald-50 rounded-lg"><p className="text-2xl font-bold text-emerald-700">{dashboard.total_territoires}</p><p className="text-xs text-emerald-600 mt-1">Territoires actifs</p></div>
                  <div className="p-4 bg-amber-50 rounded-lg"><p className="text-2xl font-bold text-amber-700">{dashboard.croissance_annuelle}%</p><p className="text-xs text-amber-600 mt-1">Croissance annuelle</p></div>
                </div>
                <Card>
                  <h4 className="text-sm font-semibold text-slate-800 mb-4">Resume</h4>
                  <p className="text-sm text-slate-600">Le systeme compte {dashboard.total_membres.toLocaleString()} membres repartis sur {dashboard.total_territoires} territoires, avec {dashboard.transferts_en_attente} transferts en attente de validation.</p>
                </Card>
              </>
            ) : <div className="text-center py-8 text-sm text-slate-400">Aucune donnee disponible</div>}
          </div>
        );
      case 'mouvements':
        return (
          <Card>
            <h4 className="text-sm font-semibold text-slate-800 mb-4">Mouvements Mensuels {mouvements?.annee ? `(${mouvements.annee})` : ''}</h4>
            {mouvements?.mouvements && mouvements.mouvements.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mouvements.mouvements}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  <Line type="monotone" dataKey="entrees" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="sorties" stroke="#94A3B8" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="transferts" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="text-center py-8 text-sm text-slate-400">Aucune donnee de mouvement</div>}
          </Card>
        );
      case 'serviteurs':
        return (
          <Card>
            <h4 className="text-sm font-semibold text-slate-800 mb-4">Serviteurs par Grade</h4>
            {statsGrade.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsGrade}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="nombre" radius={[4, 4, 0, 0]} barSize={40}>
                    {statsGrade.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="text-center py-8 text-sm text-slate-400">Aucune donnee</div>}
          </Card>
        );
      case 'effectifs':
        return (
          <Card>
            <h4 className="text-sm font-semibold text-slate-800 mb-4">Effectifs par Territoire</h4>
            {effectifs.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={effectifs.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="territoire_nom" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} angle={-20} textAnchor="end" height={60} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="effectif" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="text-center py-8 text-sm text-slate-400">Aucune donnee d'effectif</div>}
          </Card>
        );
      default:
        return (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <BarChart3 size={40} className="text-slate-300 mb-4" />
              <p className="text-sm text-slate-500">Rapport "{reportCategories.find(r => r.id === selectedReport)?.label}"</p>
              <Button variant="secondary" className="mt-4" size="sm"><Download size={14} /> Exporter PDF</Button>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="border-b-2 border-black pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Rapports</h1>
          <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mt-2">Catalogue des rapports exportables</p>
        </div>
        <Button variant="secondary"><Download size={16} /> Exporter</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {reportCategories.map(r => {
            const Icon = r.icon;
            return (
              <button key={r.id} onClick={() => setSelectedReport(r.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${selectedReport === r.id ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-white border border-slate-100 text-slate-700 hover:bg-slate-50'}`}>
                <Icon size={16} className={selectedReport === r.id ? 'text-blue-400' : 'text-slate-400'} />
                <div><p className="text-sm font-medium">{r.label}</p><p className={`text-xs mt-0.5 ${selectedReport === r.id ? 'text-slate-300' : 'text-slate-400'}`}>{r.description}</p></div>
              </button>
            );
          })}
        </div>
        <div className="lg:col-span-3">{renderReport()}</div>
      </div>
    </div>
  );
}
