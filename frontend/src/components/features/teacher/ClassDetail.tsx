import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassDetail } from '../../../hooks/useClasses';
import { useTranslation } from '../../../context/LanguageContext';
import { Tabs } from '../../common/Tabs';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { LevelBadge, Badge, StatusBadge } from '../../common/Badge';
import { Progress } from '../../common/Progress';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../common/Table';
import { Avatar } from '../../common/Avatar';
import { VocabularyManager } from './VocabularyManager';
import { TeacherAnalytics } from './TeacherAnalytics';
import {
  BookOpen,
  Users,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Edit,
  Send,
  Eye,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import { AddVocabularyModal } from './AddVocabularyModal';
import { InviteStudentModal } from './InviteStudentModal';

export const ClassDetail: React.FC = () => {
  const { classId = 'class-de-a2' } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { classDetail, isLoading } = useClassDetail(classId);

  const [activeTab, setActiveTab] = useState('overview');
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  if (isLoading || !classDetail) {
    return <div className="p-8 text-center text-slate-400">{t('classDetail.loading')}</div>;
  }

  const tabs = [
    { id: 'overview', label: t('classDetail.tabs.overview'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'vocabulary', label: t('classDetail.tabs.vocabulary'), badge: classDetail.vocabularyCount, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'students', label: t('classDetail.tabs.students'), badge: classDetail.studentCount, icon: <Users className="w-4 h-4" /> },
    { id: 'assignments', label: t('classDetail.tabs.assignments'), icon: <Award className="w-4 h-4" /> },
    { id: 'analytics', label: t('classDetail.tabs.analytics'), icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/teacher/classes')}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">{classDetail.name}</h1>
            <LevelBadge level={classDetail.level} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{classDetail.description || classDetail.schedule}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">{t('classDetail.metrics.level')}</span>
              <p className="text-2xl font-extrabold text-white mt-1">{classDetail.level}</p>
            </Card>
            <Card className="p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">{t('classDetail.metrics.students')}</span>
              <p className="text-2xl font-extrabold text-white mt-1">{classDetail.studentCount}</p>
            </Card>
            <Card className="p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">{t('classDetail.metrics.totalWords')}</span>
              <p className="text-2xl font-extrabold text-white mt-1">{classDetail.vocabularyCount}</p>
            </Card>
            <Card className="p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">{t('classDetail.metrics.averageScore')}</span>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">{classDetail.averageProgress}%</p>
            </Card>
          </div>

          {/* Today's Lesson Main Section */}
          <Card className="p-6 border-brand-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {t('classDetail.todayLesson.tag')}
                  </span>
                  <Badge variant={isPublished ? 'success' : 'warning'}>
                    {isPublished ? t('classDetail.todayLesson.published') : t('classDetail.todayLesson.draft')}
                  </Badge>
                </div>

                <h2 className="text-xl font-bold text-white">{t('classDetail.todayLesson.topicTitle')}</h2>
                <p className="text-xs text-slate-300">
                  {t('classDetail.todayLesson.topicDesc')}
                </p>

                {/* Lesson Contents Summary Pills */}
                <div className="grid grid-cols-3 gap-3 text-xs max-w-md">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{t('classDetail.todayLesson.newWords')}</span>
                    <strong className="text-white text-sm font-extrabold">10 {t('dashboard.wordsCount')}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{t('classDetail.todayLesson.reviewWords')}</span>
                    <strong className="text-white text-sm font-extrabold">15 {t('dashboard.wordsCount')}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{t('classDetail.todayLesson.quizQuestions')}</span>
                    <strong className="text-white text-sm font-extrabold">10</strong>
                  </div>
                </div>

                {/* Completion Progress Bar */}
                <div className="max-w-md space-y-1">
                  <Progress
                    value={(28 / 40) * 100}
                    label={`${t('classDetail.todayLesson.progressLabel')} (28 / 40)`}
                    showValue
                    size="md"
                  />
                </div>
              </div>

              {/* Lesson Action Controls */}
              <div className="flex flex-col gap-2.5 shrink-0 min-w-[200px]">
                <Button
                  variant="gradient"
                  leftIcon={<Eye className="w-4 h-4" />}
                  onClick={() => navigate('/student/today')}
                >
                  {t('classDetail.todayLesson.openLesson')}
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Edit className="w-4 h-4" />}
                  onClick={() => setActiveTab('vocabulary')}
                >
                  {t('classDetail.todayLesson.editLesson')}
                </Button>
                <Button
                  variant={isPublished ? 'outline' : 'success'}
                  leftIcon={isPublished ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  onClick={() => setIsPublished(!isPublished)}
                >
                  {isPublished ? t('classDetail.todayLesson.unpublish') : t('classDetail.todayLesson.publish')}
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Roster Snippet */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{t('classDetail.roster.title')}</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('students')}>
                {t('classDetail.roster.manage')}
              </Button>
            </div>

            {(!classDetail.students || classDetail.students.length === 0) ? (
              <Card className="p-6 text-center text-slate-400 border-slate-800 text-xs">
                {t('classDetail.roster.noStudents')}
              </Card>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('classDetail.roster.student')}</TableHead>
                    <TableHead>{t('classDetail.roster.wordsLearned')}</TableHead>
                    <TableHead>{t('classDetail.roster.quizScore')}</TableHead>
                    <TableHead>{t('classDetail.roster.streak')}</TableHead>
                    <TableHead>{t('classDetail.roster.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classDetail.students.map((student: any) => (
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
                      <TableCell className="font-bold">{student.wordsLearned || 0}</TableCell>
                      <TableCell className="font-bold text-emerald-400">{student.quizAverage || 0}%</TableCell>
                      <TableCell>{student.streak || 0} 🔥</TableCell>
                      <TableCell>
                        <StatusBadge status={student.status || 'Active'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Vocabulary */}
      {activeTab === 'vocabulary' && <VocabularyManager classId={classId} />}

      {/* Tab 3: Students */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{t('classDetail.roster.enrolledTitle')} ({classDetail.studentCount || 0})</h3>
            <Button
              variant="gradient"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsInviteOpen(true)}
            >
              {t('classDetail.roster.inviteButton')}
            </Button>
          </div>

          {(!classDetail.students || classDetail.students.length === 0) ? (
            <Card className="p-8 text-center text-slate-400 border-slate-800 text-xs flex flex-col items-center justify-center">
              <Users className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">{t('classDetail.roster.noStudentsTitle')}</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">{t('classDetail.roster.noStudentsDesc')}</p>
              <Button variant="primary" size="sm" onClick={() => setIsInviteOpen(true)}>
                {t('classDetail.roster.inviteButton')}
              </Button>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('classDetail.roster.student')}</TableHead>
                  <TableHead>{t('classDetail.roster.wordsLearned')}</TableHead>
                  <TableHead>{t('classDetail.roster.quizScore')}</TableHead>
                  <TableHead>{t('classDetail.roster.streak')}</TableHead>
                  <TableHead>{t('classDetail.roster.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classDetail.students.map((student: any) => (
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
                    <TableCell className="font-bold text-slate-200">{student.wordsLearned || 0}</TableCell>
                    <TableCell className="font-bold text-emerald-400">{student.quizAverage || 0}%</TableCell>
                    <TableCell>{student.streak || 0} 🔥</TableCell>
                    <TableCell>
                      <StatusBadge status={student.status || 'Active'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* Tab 4: Assignments */}
      {activeTab === 'assignments' && (
        <Card className="p-8 text-center space-y-3">
          <Award className="w-12 h-12 text-brand-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">{t('classDetail.assignments.title')}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {t('classDetail.assignments.desc')}
          </p>
        </Card>
      )}

      {/* Tab 5: Analytics */}
      {activeTab === 'analytics' && <TeacherAnalytics />}

      <AddVocabularyModal isOpen={isAddWordOpen} onClose={() => setIsAddWordOpen(false)} />
      <InviteStudentModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        classId={classId}
      />
    </div>
  );
};
