import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', children, loading, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold uppercase tracking-wide transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-30 disabled:cursor-not-allowed border';
  const variants = {
    primary: 'bg-black text-white border-black hover:bg-white hover:text-black focus:ring-black',
    secondary: 'bg-white text-black border-black hover:bg-black hover:text-white focus:ring-black',
    ghost: 'text-black border-transparent hover:border-black focus:ring-black',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600 focus:ring-red-600',
  };
  const sizes = {
    sm: 'px-4 py-2 text-xs gap-2',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-3',
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
    <div className={`bg-white border border-black ${padding ? 'p-8' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-black">{label}</label>}
      <input
        className={`w-full px-4 py-3 text-sm border-2 bg-white transition-all duration-150 focus:outline-none focus:border-black ${
          error ? 'border-red-600' : 'border-black'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-bold text-red-600 uppercase tracking-wide mt-1">{error}</p>}
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
    default: 'bg-white text-black border-black',
    success: 'bg-black text-white border-black',
    warning: 'bg-red-600 text-white border-red-600',
    danger: 'bg-red-600 text-white border-red-600',
    info: 'bg-white text-black border-black',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton-pulse bg-[#F2F4F7] ${className}`} />;
}

export function EmptyState({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 border-2 border-black flex items-center justify-center mb-6 text-black">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-black mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-sm text-gray-600 text-center max-w-md">{description}</p>
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
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative bg-white border-2 border-black w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between px-8 py-6 border-b-2 border-black">
          <h3 className="text-lg font-bold uppercase tracking-wide text-black">{title}</h3>
          <button onClick={onClose} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
