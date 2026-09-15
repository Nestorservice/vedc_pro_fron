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
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-12">
            <div className="w-16 h-16 border-2 border-white flex items-center justify-center mb-8">
              <span className="text-3xl font-black text-white">V</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tight">VEDC</h1>
            <p className="text-xl text-gray-400 font-light uppercase tracking-wide">Systeme d'Information</p>
            <p className="text-sm text-gray-500 mt-3 uppercase tracking-wider">La Vraie Eglise de Dieu du Cameroun</p>
          </div>
          <div className="space-y-6 mt-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-white flex items-center justify-center">
                <Lock size={16} className="text-white" />
              </div>
              <span className="text-sm text-gray-300 uppercase tracking-wide font-bold">Recensement des membres et serviteurs</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-white flex items-center justify-center">
                <Lock size={16} className="text-white" />
              </div>
              <span className="text-sm text-gray-300 uppercase tracking-wide font-bold">Hierarchie territoriale sur 6 niveaux</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-white flex items-center justify-center">
                <Lock size={16} className="text-white" />
              </div>
              <span className="text-sm text-gray-300 uppercase tracking-wide font-bold">Gestion des affectations et transferts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-12">
            <div className="w-14 h-14 border-2 border-black flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-black">V</span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">VEDC</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mt-2">Systeme d'Information</p>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tight">Connexion</h2>
            <p className="text-sm font-bold uppercase tracking-wider text-gray-600 mt-3">Accedez a votre espace de gestion</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider">Adresse email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-sm border-2 border-black focus:outline-none focus:border-gray-600 transition-all duration-150"
                  placeholder="votre@email.cm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 text-sm border-2 border-black focus:outline-none focus:border-gray-600 transition-all duration-150"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-600 transition-all duration-150"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 border-2 border-red-600 bg-red-50">
                <p className="text-sm font-bold text-red-600 uppercase tracking-wide">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              Se connecter
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t-2 border-black">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 text-center">
              Acces reserve aux comptes autorises. Toute activite est journalisee.
            </p>
          </div>

          <div className="mt-6 p-4 border-2 border-black bg-gray-50">
            <p className="text-xs font-bold uppercase tracking-wider text-center">
              <span className="text-red-600">API: railway.app</span> - Si le serveur est inaccessible, verifiez la configuration CORS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
