import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('admin@vedc.cm');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
    } catch {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#1D4ED8]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-12">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8">
              <span className="text-3xl font-bold text-white">V</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">VEDC</h1>
            <p className="text-xl text-white/80 font-light">Système d'Information</p>
            <p className="text-sm text-white/60 mt-3">La Vraie Église de Dieu du Cameroun</p>
          </div>
          <div className="space-y-6 mt-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Lock size={16} className="text-white" />
              </div>
              <span className="text-sm text-white/90">Recensement des membres et serviteurs</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Lock size={16} className="text-white" />
              </div>
              <span className="text-sm text-white/90">Hiérarchie territoriale sur 6 niveaux</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Lock size={16} className="text-white" />
              </div>
              <span className="text-sm text-white/90">Gestion des affectations et transferts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-2xl font-bold text-white">V</span>
            </div>
            <h1 className="text-2xl font-semibold text-[#0F172A]">VEDC</h1>
            <p className="text-xs text-[#94A3B8] mt-2">Système d'Information</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#F1F5F9] p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#0F172A]">Connexion</h2>
              <p className="text-sm text-[#64748B] mt-2">Accédez à votre espace de gestion</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#0F172A]">Adresse email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all duration-300"
                    placeholder="votre@email.cm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#0F172A]">Mot de passe</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all duration-300"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-all duration-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl">
                  <p className="text-sm text-[#991B1B]">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" loading={isLoading}>
                Se connecter
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#F1F5F9]">
              <p className="text-xs text-[#94A3B8] text-center">
                Accès réservé aux comptes autorisés. Toute activité est journalisée.
              </p>
            </div>

            <div className="mt-4 p-4 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE]">
              <p className="text-xs text-[#1E40AF] text-center font-medium">
                Mode Démo Activé
              </p>
              <p className="text-xs text-[#1E40AF] text-center mt-1">
                Utilisez n'importe quel email et mot de passe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
