import { useState } from 'react';
import { BarChart3, Download, FileText, Users, MapPin, ArrowRightLeft, Shield } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockDashboard } from '../services/mockData';

const reports = [
  { id: 'dashboard', label: 'Tableau de bord', description: 'Chiffres cles de la page d\'accueil', icon: BarChart3 },
  { id: 'effectifs', label: 'Effectifs par territoire', description: 'Repartition des membres par district', icon: Users },
  { id: 'demographie', label: 'Composition demographique', description: 'Analyse par sexe, age, situation', icon: FileText },
  { id: 'mouvements', label: 'Mouvements mensuels', description: 'Entrees et transferts par mois', icon: ArrowRightLeft },
  { id: 'serviteurs', label: 'Serviteurs par grade', description: 'Repartition et evolution des grades', icon: Shield },
  { id: 'territoires', label: 'Carte territoriale', description: 'Hierarchie et couverture', icon: MapPin },
];

export function Reports() {
  const [selectedReport, setSelectedReport] = useState('dashboard');

  const data = mockDashboard;

  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  const renderReport = () => {
    switch (selectedReport) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Mouvements Mensuels</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.mouvements_mensuels}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                    <Line type="monotone" dataKey="entrees" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="sorties" stroke="#94A3B8" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <h4 className="text-sm font-semibold text-slate-800 mb-4">Effectifs Top Districts</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.effectifs_par_territoire}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="territoire" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} angle={-20} textAnchor="end" height={60} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                    <Bar dataKey="effectif" radius={[4, 4, 0, 0]} barSize={32}>
                      {data.effectifs_par_territoire.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card>
              <h4 className="text-sm font-semibold text-slate-800 mb-4">Synthese Globale</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{data.total_membres.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">Membres total</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-700">{data.total_serviteurs.toLocaleString()}</p>
                  <p className="text-xs text-indigo-600 mt-1">Serviteurs</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-700">{data.total_territoires}</p>
                  <p className="text-xs text-emerald-600 mt-1">Territoires actifs</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-700">{data.croissance_annuelle}%</p>
                  <p className="text-xs text-amber-600 mt-1">Croissance annuelle</p>
                </div>
              </div>
            </Card>
          </div>
        );
      case 'demographie':
        return (
          <Card>
            <h4 className="text-sm font-semibold text-slate-800 mb-4">Repartition Demographique</h4>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.repartition_sexe} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="valeur" strokeWidth={0} label={({ nom, valeur }) => `${nom}: ${valeur}`}>
                    {data.repartition_sexe.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        );
      default:
        return (
          <Card>
            <div className="flex flex-col items-center justify-center py-16">
              <BarChart3 size={40} className="text-slate-300 mb-4" />
              <p className="text-sm text-slate-500">Rapport "{reports.find(r => r.id === selectedReport)?.label}" en cours de generation</p>
              <Button variant="secondary" className="mt-4" size="sm">
                <Download size={14} /> Telecharger PDF
              </Button>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Rapports & Exports</h3>
          <p className="text-sm text-slate-500 mt-0.5">Catalogue des rapports exportables</p>
        </div>
        <Button variant="secondary">
          <Download size={16} /> Exporter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report List */}
        <div className="lg:col-span-1 space-y-2">
          {reports.map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedReport(r.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  selectedReport === r.id ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-white border border-slate-100 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} className={selectedReport === r.id ? 'text-blue-400' : 'text-slate-400'} />
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className={`text-xs mt-0.5 ${selectedReport === r.id ? 'text-slate-300' : 'text-slate-400'}`}>{r.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          {renderReport()}
        </div>
      </div>
    </div>
  );
}
