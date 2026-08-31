import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/common/Table';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import type { User } from '../types';

export const AdminUsersPage: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (token) {
        const list = await authService.getAllUsers(token);
        setUsers(list);
      } else {
        setUsers([
          { id: '1', name: 'Allahverdi Ağamalıyev (Super Admin)', email: 'agamaliyevallahverdii@gmail.com', role: 'ADMIN' },
          { id: '2', name: 'Dr. Markus Weber', email: 'teacher@demo.com', role: 'TEACHER' },
          { id: '3', name: 'Anna Miller', email: 'student@demo.com', role: 'STUDENT' },
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-rose-400" />
            Admin İstifadəçilərin İdarə Olunması
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Qeydiyyatdan keçmiş bütün Məllim, Tələbə və Admin istifadəçilərinin siyahısı və rolları.
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
        /* Skeleton Loading UI for instant UX */
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
              <TableHead>Təyin Olunmuş Rol</TableHead>
              <TableHead>Qeydiyyat Tarixi</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((userItem) => (
              <TableRow key={userItem.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar src={userItem.avatar} name={userItem.name} size="sm" />
                    <strong className="text-white font-bold text-xs">{userItem.name}</strong>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-300 font-medium">{userItem.email}</TableCell>
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
                  <Badge variant="success">Aktiv</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
