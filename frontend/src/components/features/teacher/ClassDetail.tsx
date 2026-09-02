import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassDetail } from '../../../hooks/useClasses';
import { useTranslation } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { classService } from '../../../services/classService';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs } from '../../common/Tabs';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { LevelBadge, StatusBadge } from '../../common/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../common/Table';
import { Avatar } from '../../common/Avatar';
import { VocabularyManager } from './VocabularyManager';
import {
  BookOpen,
  Users,
  Award,
  Plus,
  ArrowLeft,
  Edit3,
  Trash2,
  UserMinus,
  ShieldCheck,
} from 'lucide-react';
import { AddVocabularyModal } from './AddVocabularyModal';
import { InviteStudentModal } from './InviteStudentModal';
import { Toast } from '../../common/Toast';
import { ConfirmModal } from '../../common/ConfirmModal';
import { EditClassModal } from './EditClassModal';
import { AssignVocabularyModal } from './AssignVocabularyModal';
import { useVocabulary } from '../../../hooks/useVocabulary';

export const ClassDetail: React.FC = () => {
  const { classId = 'class-de-a2' } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { classDetail, isLoading } = useClassDetail(classId);
  const { categoriesData, total: vocabularyTotal } = useVocabulary(classId);

  const [activeTab, setActiveTab] = useState('overview');
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false);
  const [isDeletingClass, setIsDeletingClass] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<{ id: string; name: string } | null>(null);
  const [isRemovingStudent, setIsRemovingStudent] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; title: string; message?: string } | null>(null);

  const confirmDeleteClass = async () => {
    if (!token || !classId) return;
    setIsDeletingClass(true);
    setIsDeleteClassOpen(false);
    navigate('/teacher/classes');
    try {
      await classService.deleteClass(token, classId);
      queryClient.invalidateQueries({ queryKey: ['classes'], refetchType: 'none' });
    } catch (err: any) {
      console.error('Delete class error:', err);
    } finally {
      setIsDeletingClass(false);
    }
  };

  const confirmRemoveStudent = async () => {
    if (!token || !classId || !studentToRemove) return;
    setIsRemovingStudent(true);
    try {
      await classService.removeStudent(token, classId, studentToRemove.id);
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      setToast({ type: 'success', title: 'Tələbə Çıxarıldı', message: `"${studentToRemove.name}" qrupdan çıxarıldı.` });
      setStudentToRemove(null);
    } catch (err: any) {
      setToast({ type: 'error', title: 'Xəta', message: err.message || 'Tələbə çıxarılarkən xəta baş verdi.' });
    } finally {
      setIsRemovingStudent(false);
    }
  };

  if (isLoading || !classDetail) {
    return <div className="p-8 text-center text-slate-400">{t('classDetail.loading')}</div>;
  }

  const currentVocabCount = vocabularyTotal !== undefined ? vocabularyTotal : (classDetail.vocabularyCount || 0);

  const tabs = [
    { id: 'overview', label: t('classDetail.tabs.overview'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'vocabulary', label: t('classDetail.tabs.vocabulary'), badge: currentVocabCount, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'assignments', label: t('classDetail.tabs.assignments'), icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Nav & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-1">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/teacher/classes')}
            className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors shrink-0"
            title="Qruplara qayıt"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">{classDetail.name}</h1>
              <LevelBadge level={classDetail.level} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate font-medium">
              {classDetail.language} ➔ {classDetail.targetLanguage || 'Azərbaycan Dili'} • {classDetail.schedule || 'Qrafik təyin edilməyib'}
            </p>
          </div>
        </div>

        {/* Responsive Actions Bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="gradient"
            size="sm"
            className="flex-1 sm:flex-none justify-center text-xs font-bold shadow-md shadow-brand-500/20 py-2"
            leftIcon={<ShieldCheck className="w-4 h-4" />}
            onClick={() => setIsAssignModalOpen(true)}
          >
            Lüğət Təyin Et
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold shrink-0 py-2"
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            onClick={() => setIsEditOpen(true)}
          >
            Düzəliş
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50 text-xs font-semibold shrink-0 py-2"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => setIsDeleteClassOpen(true)}
          >
            Sil
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview & Students */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('classDetail.metrics.level')}</span>
              <p className="text-lg sm:text-2xl font-extrabold text-white mt-1">{classDetail.level}</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('classDetail.metrics.students')}</span>
              <p className="text-lg sm:text-2xl font-extrabold text-white mt-1">{classDetail.studentCount || 0}</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('classDetail.metrics.totalWords')}</span>
              <p className="text-lg sm:text-2xl font-extrabold text-brand-300 mt-1">{currentVocabCount}</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('classDetail.metrics.averageScore')}</span>
              <p className="text-lg sm:text-2xl font-extrabold text-emerald-400 mt-1">{classDetail.averageProgress || 0}%</p>
            </div>
          </div>

          {/* Full Enrolled Students Management Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  {t('classDetail.roster.enrolledTitle')} ({classDetail.studentCount || 0})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bu qrupda iştirak edən tələbələrin davamiyyəti, öyrəndikləri sözlər və statusu.
                </p>
              </div>
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
                    <TableHead className="text-right">Əməliyyat</TableHead>
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
                      <TableCell className="text-right">
                        <button
                          onClick={() => setStudentToRemove({ id: student.id, name: student.name })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Tələbəni qrupdan çıxar"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
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

      {/* Tab 3: Assignments */}
      {activeTab === 'assignments' && (
        <Card className="p-8 text-center space-y-3">
          <Award className="w-12 h-12 text-brand-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">{t('classDetail.assignments.title')}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {t('classDetail.assignments.desc')}
          </p>
        </Card>
      )}

      <AddVocabularyModal isOpen={isAddWordOpen} onClose={() => setIsAddWordOpen(false)} />
      <InviteStudentModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        classId={classId}
      />
      {isEditOpen && (
        <EditClassModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          classDetail={classDetail}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['class', classId] });
            setToast({ type: 'success', title: 'Qrup Yeniləndi', message: 'Qrup məlumatları yeniləndi.' });
          }}
        />
      )}
      {isAssignModalOpen && (
        <AssignVocabularyModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          classId={classId}
          classNameTitle={classDetail.name}
          allTopics={categoriesData}
        />
      )}

      {/* Confirm Delete Class Modal */}
      <ConfirmModal
        isOpen={isDeleteClassOpen}
        onClose={() => setIsDeleteClassOpen(false)}
        onConfirm={confirmDeleteClass}
        isLoading={isDeletingClass}
        title="Qrupu Silməyə Əminsiniz?"
        description={`"${classDetail.name}" qrupu və onun bütün söz bazası dərhal silinəcək. Bu əməliyyat geriyə qaytarıla bilməz.`}
        confirmText="Bəli, Sil"
      />

      {/* Confirm Remove Student Modal */}
      <ConfirmModal
        isOpen={!!studentToRemove}
        onClose={() => setStudentToRemove(null)}
        onConfirm={confirmRemoveStudent}
        isLoading={isRemovingStudent}
        title="Tələbəni Qrupdan Çıxar"
        description={`"${studentToRemove?.name}" adlı tələbəni bu qrupdan çıxarmağa əminsiniz?`}
        confirmText="Çıxar"
      />

      {/* Floating Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
