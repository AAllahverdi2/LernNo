import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../../hooks/useQuiz';
import { StatCard } from '../../common/StatCard';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Progress } from '../../common/Progress';
import { ArticleBadge } from '../../common/Badge';
import {
  Brain,
  Award,
  RotateCcw,
  Flame,
  TrendingUp,
  RotateCw,
  BookOpen,
  Volume2,
} from 'lucide-react';

export const StudentProgressView: React.FC = () => {
  const navigate = useNavigate();
  const { progress, isLoading } = useQuiz();

  if (isLoading || !progress) {
    return <div className="p-8 text-center text-slate-400">Loading progress details...</div>;
  }

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-brand-400" />
          My Learning Progress
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Track mastered vocabulary, review queues, weekly streak milestones, and quiz scores.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Words Learned"
          value={progress.wordsLearned}
          subtitle="Total vocabulary encountered"
          icon={<BookOpen className="w-5 h-5" />}
          trend={{ value: '+14 words', isUp: true }}
          accentColor="brand"
        />
        <StatCard
          title="Words Mastered"
          value={progress.wordsMastered}
          subtitle="High recall accuracy"
          icon={<Brain className="w-5 h-5" />}
          trend={{ value: '+8 words', isUp: true }}
          accentColor="emerald"
        />
        <StatCard
          title="Words To Review"
          value={progress.wordsToReview}
          subtitle="Spaced repetition queue"
          icon={<RotateCcw className="w-5 h-5" />}
          accentColor="amber"
        />
        <StatCard
          title="Current Streak"
          value={`${progress.currentStreak} Days`}
          subtitle="Consecutive daily practice"
          icon={<Flame className="w-5 h-5 fill-amber-400" />}
          trend={{ value: 'Best: 12d', isUp: true }}
          accentColor="rose"
        />
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vocabulary Mastery Breakdown */}
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              Vocabulary Mastery Level Breakdown
            </h3>
            <p className="text-xs text-slate-400">Distribution of learned words by retention confidence.</p>
          </div>

          <div className="space-y-4">
            {progress.masteryBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.level}</span>
                  <span className="text-slate-400">{item.count} words ({Math.round((item.count / 342) * 100)}%)</span>
                </div>
                <Progress value={(item.count / 342) * 100} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Quiz Scores */}
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-400" />
              Recent Quiz Scores
            </h3>
            <p className="text-xs text-slate-400">Performance results on recent daily quiz modules.</p>
          </div>

          <div className="space-y-3">
            {progress.recentQuizScores.map((quizItem) => (
              <div key={quizItem.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{quizItem.title}</h4>
                  <span className="text-[10px] text-slate-400">{quizItem.date}</span>
                </div>
                <div className="text-right">
                  <span className={`text-base font-black ${quizItem.score >= 90 ? 'text-emerald-400' : 'text-brand-300'}`}>
                    {quizItem.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Words I Need to Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-amber-400" />
            Words I Need to Review ({progress.wordsNeedingReview.length})
          </h3>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => navigate('/student/review')}
          >
            Start Flashcard Review →
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {progress.wordsNeedingReview.map((word) => (
            <Card key={word.id} className="p-4 hover:border-slate-700 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <ArticleBadge article={word.article} />
                <button
                  onClick={() => playAudio(`${word.article || ''} ${word.word}`)}
                  className="p-1 rounded-lg text-slate-400 hover:text-brand-400"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white uppercase">{word.word}</h4>
                <p className="text-xs text-brand-300 font-medium">{word.translation}</p>
              </div>
              <p className="text-[11px] text-slate-400 italic truncate">"{word.exampleSentence}"</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
