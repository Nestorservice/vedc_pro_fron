import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = {
    success: { icon: CheckCircle, color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]' },
    error: { icon: AlertCircle, color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]' },
    warning: { icon: AlertTriangle, color: 'text-[#F59E0B]', bg: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]' },
    info: { icon: Info, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]' },
  };

  const { icon: Icon, color, bg, border } = config[toast.type];

  return (
    <div className={`${bg} border ${border} rounded-2xl shadow-lg p-4 animate-fade-in flex items-start gap-3`}>
      <Icon size={18} className={`${color} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0F172A]">{toast.title}</p>
        {toast.message && <p className="text-xs text-[#64748B] mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/60 transition-all duration-300 shrink-0">
        <X size={14} className="text-[#64748B]" />
      </button>
    </div>
  );
}
