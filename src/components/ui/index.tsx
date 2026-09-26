import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', children, loading, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] focus:ring-[#2563EB] shadow-sm hover:shadow-md',
    secondary: 'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] focus:ring-[#E2E8F0]',
    ghost: 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus:ring-[#E2E8F0]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444] shadow-sm',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-[#F1F5F9] shadow-sm ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', type = 'text', ...props }: InputProps) {
  const getAutoComplete = () => {
    const labelText = label?.toLowerCase() || props.name?.toLowerCase() || '';
    if (labelText.includes('email') || labelText.includes('courriel')) return 'email';
    if (labelText.includes('mot de passe') || labelText.includes('password')) return 'current-password';
    if (labelText.includes('nom')) return 'family-name';
    if (labelText.includes('prenom') || labelText.includes('prénom')) return 'given-name';
    if (labelText.includes('telephone') || labelText.includes('téléphone')) return 'tel';
    if (labelText.includes('username') || labelText.includes('utilisateur')) return 'username';
    if (type === 'password') return 'current-password';
    if (type === 'email') return 'email';
    return 'off';
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-[#0F172A]">{label}</label>}
      <input
        type={type}
        autoComplete={getAutoComplete()}
        className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${
          error ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[#F1F5F9] text-[#475569]',
    success: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    warning: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
    danger: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
    info: 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-pulse rounded-xl ${className}`} />;
}

export function EmptyState({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-4 text-[#94A3B8]">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#0F172A] mb-1">{title}</h3>
      <p className="text-sm text-[#64748B] text-center max-w-sm">{description}</p>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-[#F1F5F9] w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <h3 className="text-lg font-semibold text-[#0F172A]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
