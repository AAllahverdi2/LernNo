import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useClasses } from '../../../hooks/useClasses';
import { StudentInvitationBanner } from './StudentInvitationBanner';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  Clock,
  User,
  Flame,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { classes, isLoading } = useClasses();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Student Invitation Banner (shows pending class invitations) */}
      <StudentInvitationBanner />

      {/* Header Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Tələbə Portalı
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Salam, {user?.name || 'Tələbə'} 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Müəlliminizin sizi daxil etdiyi aktiv qruplar və təyin olunmuş lüğətlər aşağıda qeyd edilib.
          </p>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-sm shrink-0">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400 animate-bounce" />
          </div>
          <div>
            <span className="block text-[10px] text-amber-300/80 uppercase font-semibold">Öyrənmə Seriyası</span>
            <span className="text-lg">{user?.streak || 7} Günlük Aktiv 🔥</span>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-brand-400" />
              Mənim Qruplarım ({classes.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Daxil olduğunuz qrup üzrə müəllimin paylaşdığı bütün lüğətləri öyrənin.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
            Qruplar yüklənir...
          </div>
        ) : classes.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-slate-800 bg-slate-900/40">
            <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Hələ Heç Bir Qrupa Əlavə Edilməmisiniz
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Müəlliminiz sizi qrupa əlavə etdikdə və ya dəvət göndərdikdə qrupunuz burada görünəcək.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((cls: any) => (
              <Card
                key={cls.id}
                hoverEffect
                className="p-6 border-slate-800 hover:border-brand-500/50 bg-slate-900/70 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div className="space-y-4">
                  {/* Top Bar: Level & Word Count Badges */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-brand-500/20 text-brand-300 text-xs font-extrabold border border-brand-500/30">
                      {cls.level} Səviyyəsi
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700">
                      <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                      {cls.vocabularyCount || 0} söz
                    </span>
                  </div>

                  {/* Title & Language */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                      {cls.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {cls.language} ➔ Azərbaycan Dili
                    </p>
                  </div>

                  {/* Schedule & Teacher Info */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>{cls.schedule || 'Dərs qrafiki təyin edilməyib'}</span>
                    </div>
                    {cls.teacher && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Müəllim: <strong className="text-slate-200">{cls.teacher.name}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-5 mt-5 border-t border-slate-800">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="w-full justify-between"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => navigate(`/student/vocabulary?classId=${cls.id}`)}
                  >
                    Lüğətlərə Və Sözlərə Bax →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
