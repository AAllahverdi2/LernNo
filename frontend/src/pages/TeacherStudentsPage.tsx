import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { classService } from '../services/classService';
import { useClasses } from '../hooks/useClasses';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/common/Table';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Users, Search, UserPlus, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const TeacherStudentsPage: React.FC = () => {
  const { token } = useAuth();
  const { classes } = useClasses();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Invite modal state
  const [selectedStudentForInvite, setSelectedStudentForInvite] = useState<any | null>(null);
  const [targetClassId, setTargetClassId] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStudents = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const list = await classService.searchStudents(token, search);
      setStudents(list);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [token, search]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedStudentForInvite || !targetClassId) return;

    setIsInviting(true);
    setFeedback(null);

    try {
      const res = await classService.inviteStudent(token, targetClassId, selectedStudentForInvite.id, selectedStudentForInvite.email);
      setFeedback({ type: 'success', message: res.message || 'Dəvət göndərildi!' });
      setTimeout(() => {
        setSelectedStudentForInvite(null);
        setFeedback(null);
      }, 1500);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Dəvət göndərilərkən xəta baş verdi.' });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-400" />
            Tələbələr Kataloqu Və Dəvət
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sistemdə olan bütün tələbələri axtarın və onları qruplarınıza dəvət edin.
          </p>
        </div>

        <div className="w-full md:w-72">
          <Input
            placeholder="Tələbənin adı və ya e-poçtu..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Tələbələr yüklənir...</div>
      ) : students.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
          Qeydiyyatdan keçmiş tələbə tapılmadı.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tələbə</TableHead>
              <TableHead>Fənn / İxtisas</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead>Qeydiyyat Tarixi</TableHead>
              <TableHead className="text-right font-bold">Əməliyyat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
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
                <TableCell className="font-bold text-slate-300">{student.subject || 'Alman Dili'}</TableCell>
                <TableCell>{student.streak || 0} gün 🔥</TableCell>
                <TableCell className="text-xs text-slate-400">
                  {new Date(student.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setSelectedStudentForInvite(student);
                      if (classes.length > 0) setTargetClassId(classes[0].id);
                    }}
                  >
                    Qrupa Dəvət Et
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Invite Modal */}
      {selectedStudentForInvite && (
        <Modal
          isOpen={!!selectedStudentForInvite}
          onClose={() => setSelectedStudentForInvite(null)}
          title={`Tələbəni Qrupa Dəvət Et — ${selectedStudentForInvite.name}`}
        >
          <form onSubmit={handleSendInvite} className="space-y-4 pt-2">
            <p className="text-xs text-slate-400">
              Tələbə: <strong className="text-white">{selectedStudentForInvite.name}</strong> ({selectedStudentForInvite.email})
            </p>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {classes.length === 0 ? (
              <p className="text-xs text-rose-400">Dəvət göndərmək üçün əvvəlcə ən azı bir qrup yaratmalısınız.</p>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Dəvət Olunacaq Qrup
                </label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {classes.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.level} • {c.language})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setSelectedStudentForInvite(null)}>
                Ləğv Et
              </Button>
              <Button
                type="submit"
                variant="gradient"
                isLoading={isInviting}
                disabled={classes.length === 0}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Dəvət Göndər
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
