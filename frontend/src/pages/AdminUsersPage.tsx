import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/common/Table';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Toast } from '../components/common/Toast';
import { ShieldCheck, RefreshCw, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { User } from '../types';

export const AdminUsersPage: React.FC = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [userId: string]: boolean }>({});
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message?: string } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (token) {
        const list = await authService.getAllUsers(token);
        setUsers(list);
      } else {
        setUsers([
          { id: '1', name: 'Allahverdi Ağamalıyev (Super Admin)', email: 'agamaliyevallahverdii@gmail.com', role: 'ADMIN', displayPassword: 'SuperSecretAdmin123' },
          { id: '2', name: 'Dr. Markus Weber', email: 'teacher@demo.com', role: 'TEACHER', displayPassword: 'TeacherPass2026' },
          { id: '3', name: 'Anna Miller', email: 'student@demo.com', role: 'STUDENT', displayPassword: 'StudentPass2026' },
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const togglePassword = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const confirmDeleteUser = async () => {
    if (!token || !userToDelete) return;
    setIsDeleting(true);
    try {
      await authService.deleteUser(token, userToDelete.id);
      setToast({ type: 'success', title: 'İstifadəçi Silindi', message: `"${userToDelete.name}" sistemdən həmişəlik silindi.` });
      setUserToDelete(null);
      await fetchUsers();
    } catch (err: any) {
      setToast({ type: 'error', title: 'Xəta', message: err.message || 'İstifadəçi silinərkən xəta baş verdi.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-rose-400" />
            Admin İstifadəçilərin İdarə Olunması
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Müəllim Və Tələbələrin Email/Parollarını Görmək Və İstifadəçiləri Bazadan Silmək Paneli.
          </p>
        </div>

        <Button size="sm" variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={fetchUsers} isLoading={isLoading}>
          Yenilə (Refresh)
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse flex items-center px-6 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800" />
                <div className="h-4 w-32 bg-slate-800 rounded-md" />
              </div>
              <div className="h-4 w-40 bg-slate-800 rounded-md" />
              <div className="h-6 w-20 bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İstifadəçi Profili</TableHead>
              <TableHead>E-poçt Ünvanı</TableHead>
              <TableHead>Şifrə (Password)</TableHead>
              <TableHead>Təyin Olunmuş Rol</TableHead>
              <TableHead>Qeydiyyat Tarixi</TableHead>
              <TableHead className="text-right">Əməliyyat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((userItem) => {
              const isPasswordShown = !!visiblePasswords[userItem.id];
              const displayPass = userItem.displayPassword || 'LernNo2026!';

              return (
                <TableRow key={userItem.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={userItem.avatar} name={userItem.name} size="sm" />
                      <strong className="text-white font-bold text-xs">{userItem.name}</strong>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-brand-300 font-semibold">{userItem.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                        {isPasswordShown ? displayPass : '••••••••••••'}
                      </code>
                      <button
                        type="button"
                        onClick={() => togglePassword(userItem.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title={isPasswordShown ? 'Şifrəni Gizlə' : 'Şifrəni Göstər'}
                      >
                        {isPasswordShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${
                        userItem.role.toString().toUpperCase() === 'ADMIN'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : userItem.role.toString().toUpperCase() === 'TEACHER'
                          ? 'bg-brand-500/20 text-brand-300 border-brand-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {userItem.role.toString().toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'Aktiv'}
                  </TableCell>
                  <TableCell className="text-right">
                    {currentUser?.id !== userItem.id && (
                      <button
                        type="button"
                        onClick={() => setUserToDelete(userItem)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
                        title="İstifadəçini bazadan sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Confirm Delete User Modal */}
      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
        isLoading={isDeleting}
        title="İstifadəçini Silməyə Əminsiniz?"
        description={`'${userToDelete?.name}' (${userToDelete?.email}) adlı istifadəçi və onun bütün məlumatları verilənlər bazasından həmişəlik silinəcək.`}
        confirmText="İstifadəçini Sil"
      />

      {/* Toast Notification */}
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
