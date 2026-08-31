import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useQuiz } from '../../../hooks/useQuiz';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Progress } from '../../common/Progress';
import {
  Flame,
  BookOpen,
  RotateCcw,
  Award,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { progress } = useQuiz();

  const learnedCount = progress?.dailyLearned || 7;
  const goalCount = progress?.dailyGoal || 10;
  const streakCount = progress?.currentStreak || 7;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-brand-950/80 via-slate-900 to-indigo-950/80 border border-brand-500/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Good morning, {user?.name || 'Anna'} 👋
            </h1>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm">
            German A2 Workspace • Keep momentum to master today's vocabulary set!
          </p>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-sm shrink-0">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400 animate-bounce" />
          </div>
          <div>
            <span className="block text-[10px] text-amber-300/80 uppercase font-semibold">Current Streak</span>
            <span className="text-lg">{streakCount} Day Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* Today's Goal Bar */}
      <Card className="p-5 border-brand-500/30 bg-slate-900/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-brand-400" />
            Today's Progress Goal
          </span>
          <span className="text-xs font-extrabold text-brand-300">
            {learnedCount} / {goalCount} words learned
          </span>
        </div>
        <Progress value={(learnedCount / goalCount) * 100} size="md" />
      </Card>

      {/* Main Action Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Today's Lesson */}
        <Card hoverEffect className="p-6 border-brand-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 flex flex-col justify-between group">
          <div>
            <div className="p-3 w-fit rounded-2xl bg-brand-500/15 text-brand-400 border border-brand-500/30 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Day 4 • Travel</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">Today's Lesson</h3>
            <p className="text-xs text-slate-300 mb-6">
              10 new German words ready for study (Bahnhof, Verspätung, Fahrkarte...).
            </p>
          </div>
          <Button
            variant="gradient"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/student/today')}
          >
            Start Learning →
          </Button>
        </Card>

        {/* Card 2: Review Queue */}
        <Card hoverEffect className="p-6 border-violet-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/60 flex flex-col justify-between group">
          <div>
            <div className="p-3 w-fit rounded-2xl bg-violet-500/15 text-violet-400 border border-violet-500/30 mb-4 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Spaced Repetition</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">Review Words</h3>
            <p className="text-xs text-slate-300 mb-6">
              15 words ready for review (Unterkunft, günstig, Einkäufe).
            </p>
          </div>
          <Button
            variant="secondary"
            className="border-violet-500/40 text-violet-200 hover:bg-violet-500/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/student/review')}
          >
            Start Review →
          </Button>
        </Card>

        {/* Card 3: Quiz */}
        <Card hoverEffect className="p-6 border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 flex flex-col justify-between group">
          <div>
            <div className="p-3 w-fit rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Test Mastery</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">Daily Quiz</h3>
            <p className="text-xs text-slate-300 mb-6">
              10 interactive questions to lock in today's German vocabulary.
            </p>
          </div>
          <Button
            variant="success"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/student/quiz')}
          >
            Take Quiz →
          </Button>
        </Card>
      </div>

      {/* Weekly Progress Chart Widget */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              Weekly Learning Activity
            </h3>
            <p className="text-xs text-slate-400">Your daily study time and words learned this week.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/student/progress')}>
            View Detailed Progress
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center pt-2">
          {progress?.weeklyActivity.map((item, idx) => (
            <div key={idx} className="space-y-2 group">
              <div className="h-32 bg-slate-950 rounded-xl border border-slate-800/80 p-1 flex flex-col justify-end">
                <div
                  className="w-full bg-gradient-to-t from-brand-600 to-indigo-400 rounded-lg transition-all group-hover:brightness-125"
                  style={{ height: `${Math.min(100, (item.wordsCount / 25) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-300 block">{item.day}</span>
              <span className="text-[10px] text-slate-400 block">{item.wordsCount} words</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
