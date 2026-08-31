import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Sparkles, ShieldCheck } from 'lucide-react';

export const DemoHeader: React.FC = () => {
  const { role, switchRole, user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border-b border-brand-500/20 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md z-40 relative">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
        </span>
        <span className="font-semibold text-brand-300">LernNo Workspace</span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <span className="hidden sm:inline text-slate-400">
          LoggedIn: <strong className="text-white">{user?.name}</strong> ({role.toString().toUpperCase()})
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-medium text-[11px] hidden md:inline">Quick Role Switcher:</span>
        <div className="inline-flex p-0.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <button
            onClick={() => switchRole('teacher')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              role === 'teacher'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Teacher
          </button>
          <button
            onClick={() => switchRole('student')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              role === 'student'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Student
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              role === 'admin'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};
