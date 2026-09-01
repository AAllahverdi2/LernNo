import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useClasses } from '../../../hooks/useClasses';
import { useTranslation } from '../../../context/LanguageContext';
import { StatCard } from '../../common/StatCard';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge, LevelBadge } from '../../common/Badge';
import { Progress } from '../../common/Progress';
import {
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Plus,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { CreateClassModal } from './CreateClassModal';
import { AddVocabularyModal } from './AddVocabularyModal';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { classes, isLoading } = useClasses();
  const { openAIGenerator } = useOutletContext<{ openAIGenerator: () => void }>() || {};

  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);

  // Dynamic statistics calculated from backend classes
  const totalStudents = classes.reduce((acc: number, cls: any) => acc + (cls.studentCount || 0), 0);
  const totalWords = classes.reduce((acc: number, cls: any) => acc + (cls.vocabularyCount || 0), 0);
  const activeClassesCount = classes.length;
  
  const uniqueLevels = Array.from(
    new Set(classes.map((c: any) => c.level).filter(Boolean))
  ).join(', ');

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {t('dashboard.welcome')}, {user?.name || 'Teacher'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddWordOpen(true)}
          >
            {t('dashboard.addWord')}
          </Button>
          <Button
            variant="gradient"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={openAIGenerator}
          >
            {t('nav.generateWithAI')}
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={t('dashboard.totalStudents')}
          value={totalStudents}
          subtitle={t('dashboard.totalStudentsSub')}
          icon={<Users className="w-5 h-5" />}
          accentColor="brand"
        />
        <StatCard
          title={t('dashboard.activeClasses')}
          value={activeClassesCount}
          subtitle={uniqueLevels ? `${uniqueLevels} ${t('dashboard.activeClassesSub')}` : t('dashboard.noClassesYet')}
          icon={<GraduationCap className="w-5 h-5" />}
          accentColor="violet"
        />
        <StatCard
          title={t('dashboard.wordsTaught')}
          value={totalWords}
          subtitle={t('dashboard.wordsTaughtSub')}
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          title={t('dashboard.averageCompletion')}
          value="0%"
          subtitle={t('dashboard.averageCompletionSub')}
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      {/* Quick Actions Panel */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-indigo-950/60 border border-brand-500/30 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-300 mb-3">{t('dashboard.quickActions')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setIsAddWordOpen(true)}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-brand-500/10 text-brand-400 mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">{t('dashboard.addVocab')}</p>
            <p className="text-[11px] text-slate-400">{t('dashboard.addVocabSub')}</p>
          </button>

          <button
            onClick={openAIGenerator}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400 mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">{t('dashboard.generateAI')}</p>
            <p className="text-[11px] text-slate-400">{t('dashboard.generateAISub')}</p>
          </button>

          <button
            onClick={() => setIsCreateClassOpen(true)}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">{t('dashboard.createClass')}</p>
            <p className="text-[11px] text-slate-400">{t('dashboard.createClassSub')}</p>
          </button>

          <button
            onClick={() => navigate('/teacher/analytics')}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">{t('dashboard.viewAnalytics')}</p>
            <p className="text-[11px] text-slate-400">{t('dashboard.viewAnalyticsSub')}</p>
          </button>
        </div>
      </div>

      {/* Main Grid: Today's Lessons & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Lessons (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              {t('dashboard.myGroups')}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/classes')}>
              {t('dashboard.viewAllClasses')}
            </Button>
          </div>

          {isLoading ? (
            <Card className="p-8 text-center text-slate-400 border-slate-800">
              {t('dashboard.loadingClasses')}
            </Card>
          ) : classes.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 border-slate-800 flex flex-col items-center justify-center">
              <GraduationCap className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">{t('dashboard.noClassCreatedTitle')}</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">{t('dashboard.noClassCreatedSub')}</p>
              <Button variant="primary" size="sm" onClick={() => setIsCreateClassOpen(true)}>
                {t('dashboard.createClass')}
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.slice(0, 4).map((cls: any) => (
                <Card key={cls.id} hoverEffect className="p-5 border-slate-800/90 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <LevelBadge level={cls.level} />
                      <Badge variant="success">{t('dashboard.active')}</Badge>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{cls.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">{cls.description || cls.schedule}</p>

                    <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">{t('nav.students')}</span>
                        <strong className="text-white text-sm">{cls.studentCount || 0} {t('dashboard.studentsCount')}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">{t('nav.vocabulary')}</span>
                        <strong className="text-white text-sm">{cls.vocabularyCount || 0} {t('dashboard.wordsCount')}</strong>
                      </div>
                    </div>

                    <Progress value={cls.averageProgress || 0} label={t('dashboard.completion')} showValue size="sm" />
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {cls.schedule || t('dashboard.active')}
                    </span>
                    <Button
                      size="sm"
                      variant="primary"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                    >
                      {t('dashboard.goToClass')}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Feed (1 Col) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            {t('dashboard.recentActivity')}
          </h2>

          <Card className="p-5 space-y-4">
            {classes.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-xs text-slate-400 font-medium">{t('dashboard.noActivity')}</p>
                <p className="text-[11px] text-slate-500 mt-1">{t('dashboard.noActivitySub')}</p>
              </div>
            ) : (
              classes.slice(0, 5).map((cls: any) => (
                <div key={cls.id} className="flex items-start gap-3 text-xs border-b border-slate-800/60 pb-3.5 last:border-0 last:pb-0">
                  <div className="p-2 rounded-xl border shrink-0 text-brand-400 bg-brand-500/10 border-brand-500/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-200 leading-snug">
                      {cls.name}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {cls.studentCount || 0} {t('dashboard.studentsCount')}, {cls.vocabularyCount || 0} {t('dashboard.wordsCount')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CreateClassModal isOpen={isCreateClassOpen} onClose={() => setIsCreateClassOpen(false)} />
      <AddVocabularyModal isOpen={isAddWordOpen} onClose={() => setIsAddWordOpen(false)} />
    </div>
  );
};

