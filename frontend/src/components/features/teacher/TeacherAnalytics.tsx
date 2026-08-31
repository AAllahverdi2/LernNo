import React from 'react';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { StatCard } from '../../common/StatCard';
import { Card } from '../../common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../common/Table';
import { Avatar } from '../../common/Avatar';
import { StatusBadge } from '../../common/Badge';
import { Progress } from '../../common/Progress';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  TrendingUp,
  Brain,
} from 'lucide-react';

export const TeacherAnalytics: React.FC = () => {
  const { analytics, isLoading } = useAnalytics();

  if (isLoading || !analytics) {
    return <div className="p-8 text-center text-slate-400">Loading analytics insights...</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-indigo-400" />
          Teacher Analytics & Insights
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Monitor class completion rates, word mastery levels, quiz scores, and at-risk students.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Class Completion"
          value={`${analytics.completionRate}%`}
          subtitle="Daily lesson finish rate"
          icon={<CheckCircle2 className="w-5 h-5" />}
          trend={{ value: '+4.1%', isUp: true }}
          accentColor="brand"
        />
        <StatCard
          title="Vocabulary Mastery"
          value={`${analytics.vocabularyMastery}%`}
          subtitle="Words remembered long-term"
          icon={<Brain className="w-5 h-5" />}
          trend={{ value: '+2.5%', isUp: true }}
          accentColor="emerald"
        />
        <StatCard
          title="Quiz Average"
          value={`${analytics.quizPerformanceAverage}%`}
          subtitle="Overall test accuracy"
          icon={<Award className="w-5 h-5" />}
          accentColor="violet"
        />
        <StatCard
          title="Needs Attention"
          value={analytics.studentsNeedingHelpCount}
          subtitle="Students below 70% average"
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="rose"
        />
      </div>

      {/* Main Grid: Hardest Words & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Difficult Words */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Most Difficult Words
              </h3>
              <p className="text-xs text-slate-400">Words with the highest student error rate in quizzes.</p>
            </div>
          </div>

          <div className="space-y-3">
            {analytics.hardestWords.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {item.article && <span className="text-xs font-bold text-sky-400">{item.article}</span>}
                    <strong className="text-white text-sm font-bold">{item.word}</strong>
                    <span className="text-xs text-slate-400">— {item.translation}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Topic: {item.topic}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-rose-400 block">{item.failureRate}% fail</span>
                  <span className="text-[10px] text-slate-400">needs review</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily Active Students Visual Bar */}
        <Card className="p-6 space-y-4">
          <div className="border-b border-slate-800/80 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Daily Active Students Activity
            </h3>
            <p className="text-xs text-slate-400">Number of active students engaging with lessons per day.</p>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.dailyActiveStudents.map((day, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{day.day}</span>
                  <span className="text-brand-300">{day.activeCount} / 40 students ({Math.round((day.activeCount / 40) * 100)}%)</span>
                </div>
                <Progress value={(day.activeCount / 40) * 100} size="sm" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Full Student Roster Performance Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-400" />
          Student Performance Roster
        </h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Words Learned</TableHead>
              <TableHead>Quiz Average</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analytics.studentRoster.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={student.avatar} name={student.name} size="sm" />
                    <div>
                      <p className="font-bold text-white text-xs">{student.name}</p>
                      <p className="text-[10px] text-slate-400">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-200">{student.wordsLearned}</TableCell>
                <TableCell className="font-bold text-emerald-400">{student.quizAverage}%</TableCell>
                <TableCell>{student.streak} days 🔥</TableCell>
                <TableCell className="text-xs text-slate-400">{student.lastActive}</TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
