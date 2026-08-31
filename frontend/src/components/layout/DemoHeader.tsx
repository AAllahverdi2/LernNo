import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const DemoHeader: React.FC = () => {
  const { role, user } = useAuth();

  return (
    <div className="bg-slate-950 border-b border-slate-800/80 px-6 py-2.5 text-xs flex items-center justify-between gap-3 shadow-md z-30 relative">
      <div className="flex items-center gap-2.5 text-slate-300">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-extrabold text-white">LernNo AI Platform</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400 font-medium">
          Daxil olan istifadəçi: <strong className="text-white font-bold">{user?.name}</strong> ({user?.email})
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider border ${
            role === 'admin'
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              : role === 'teacher'
              ? 'bg-brand-500/10 text-brand-300 border-brand-500/30'
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
          }`}
        >
          {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />}
          {role === 'teacher' && <UserCheck className="w-3.5 h-3.5 text-brand-400" />}
          {role === 'student' && <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
          {role} Workspace
        </span>
      </div>
    </div>
  );
};
