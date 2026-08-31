import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useClasses } from '../../../hooks/useClasses';
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
  AlertCircle,
  FileCheck,
  UserPlus,
} from 'lucide-react';
import { CreateClassModal } from './CreateClassModal';
import { AddVocabularyModal } from './AddVocabularyModal';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { classes } = useClasses();
  const { openAIGenerator } = useOutletContext<{ openAIGenerator: () => void }>() || {};

  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);

  const activities = [
    {
      id: '1',
      title: '12 students completed today\'s quiz',
      time: '15 mins ago',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: '2',
      title: '5 students need vocabulary review in German A2',
      time: '1 hour ago',
      icon: AlertCircle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: '3',
      title: 'New vocabulary set published: "Travel & Transportation"',
      time: '3 hours ago',
      icon: FileCheck,
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    },
    {
      id: '4',
      title: 'Student Elena Rostova joined German B1',
      time: '5 hours ago',
      icon: UserPlus,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Good morning, {user?.name || 'Teacher'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here's what's happening in your classes today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddWordOpen(true)}
          >
            Add Word
          </Button>
          <Button
            variant="gradient"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={openAIGenerator}
          >
            Generate with AI
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={65}
          subtitle="Across all classes"
          icon={<Users className="w-5 h-5" />}
          trend={{ value: '+12%', isUp: true }}
          accentColor="brand"
        />
        <StatCard
          title="Active Classes"
          value={classes.length || 3}
          subtitle="A2, B1, C1 Levels"
          icon={<GraduationCap className="w-5 h-5" />}
          accentColor="violet"
        />
        <StatCard
          title="Words Taught"
          value={1010}
          subtitle="Total published vocabulary"
          icon={<BookOpen className="w-5 h-5" />}
          trend={{ value: '+45 words', isUp: true }}
          accentColor="emerald"
        />
        <StatCard
          title="Average Completion"
          value="78.5%"
          subtitle="Student lesson progress"
          icon={<CheckCircle2 className="w-5 h-5" />}
          trend={{ value: '+3.2%', isUp: true }}
          accentColor="amber"
        />
      </div>

      {/* Quick Actions Panel */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-indigo-950/60 border border-brand-500/30 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-300 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setIsAddWordOpen(true)}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-brand-500/10 text-brand-400 mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">Add Vocabulary</p>
            <p className="text-[11px] text-slate-400">Add single or batch words</p>
          </button>

          <button
            onClick={openAIGenerator}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-400 mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">Generate with AI</p>
            <p className="text-[11px] text-slate-400">Auto-create vocab set</p>
          </button>

          <button
            onClick={() => setIsCreateClassOpen(true)}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">Create Class</p>
            <p className="text-[11px] text-slate-400">Add new language group</p>
          </button>

          <button
            onClick={() => navigate('/teacher/analytics')}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">View Analytics</p>
            <p className="text-[11px] text-slate-400">Track student progress</p>
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
              Today's Lessons
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/classes')}>
              View All Classes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.slice(0, 2).map((cls: any) => (
              <Card key={cls.id} hoverEffect className="p-5 border-slate-800/90 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <LevelBadge level={cls.level} />
                    <Badge variant="success">Active</Badge>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{cls.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{cls.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Students</span>
                      <strong className="text-white text-sm">{cls.studentCount}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">New Words</span>
                      <strong className="text-white text-sm">10 words</strong>
                    </div>
                  </div>

                  <Progress value={cls.averageProgress} label="Student Completion" showValue size="sm" />
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {cls.lastActivity}
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                  >
                    View Class
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed (1 Col) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Recent Activity
          </h2>

          <Card className="p-5 space-y-4">
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3 text-xs border-b border-slate-800/60 pb-3.5 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-xl border shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-200 leading-snug">{act.title}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CreateClassModal isOpen={isCreateClassOpen} onClose={() => setIsCreateClassOpen(false)} />
      <AddVocabularyModal isOpen={isAddWordOpen} onClose={() => setIsAddWordOpen(false)} />
    </div>
  );
};
