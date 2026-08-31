import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type = 'success', title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-brand-400" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-slate-900/95',
    error: 'border-rose-500/40 bg-slate-900/95',
    info: 'border-brand-500/40 bg-slate-900/95',
  };

  return (
    <div className={clsx('fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-scaleUp max-w-md', borders[type])}>
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <h5 className="text-sm font-bold text-white">{title}</h5>
        {message && <p className="mt-0.5 text-xs text-slate-300">{message}</p>}
      </div>
      <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
