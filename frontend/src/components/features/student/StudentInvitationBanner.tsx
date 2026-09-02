import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { classService } from '../../../services/classService';
import { BellRing, Check, X, Loader2 } from 'lucide-react';
import { Toast } from '../../common/Toast';

export const StudentInvitationBanner: React.FC = () => {
  const { token } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; title: string; message?: string } | null>(null);

  const fetchInvitations = async () => {
    if (!token) return;
    try {
      const list = await classService.getMyInvitations(token);
      setInvitations(list);
    } catch (err) {
      console.error('Error fetching invitations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [token]);

  const handleRespond = async (enrollmentId: string, action: 'ACCEPT' | 'REJECT') => {
    if (!token) return;
    setRespondingId(enrollmentId);
    try {
      await classService.respondToInvitation(token, enrollmentId, action);
      // Remove from list
      setInvitations((prev) => prev.filter((inv) => inv.id !== enrollmentId));
    } catch (err: any) {
      setToast({ type: 'error', title: 'Xəta', message: err.message || 'Xəta baş verdi.' });
    } finally {
      setRespondingId(null);
    }
  };

  if (isLoading || invitations.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {invitations.map((inv) => (
        <div
          key={inv.id}
          className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-brand-950/90 border border-brand-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Yeni Qrup Dəvəti
                </span>
                <span className="text-xs text-slate-400">• {inv.class.language} ({inv.class.level})</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">
                Müəllim <span className="text-brand-300">{inv.class.teacher?.name}</span> sizi{' '}
                <span className="text-white underline decoration-brand-500">{inv.class.name}</span> qrupuna dəvət etdi.
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Qəbul etdikdən sonra həmin qrupun dərsləri və lüğət bazası sizin panelinizdə açılacaq.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => handleRespond(inv.id, 'REJECT')}
              disabled={respondingId === inv.id}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              İmtina Et
            </button>
            <button
              onClick={() => handleRespond(inv.id, 'ACCEPT')}
              disabled={respondingId === inv.id}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 border border-emerald-400/30 transition-all flex items-center gap-1.5"
            >
              {respondingId === inv.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Qəbul Et
            </button>
          </div>
        </div>
      ))}
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};
