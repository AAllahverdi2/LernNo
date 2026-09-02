import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileCheck2,
  Users,
  BarChart3,
  Sparkles,
  Settings,
  Flame,
  RotateCcw,
  LogOut,
  BrainCircuit,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const teacherNav = [
    { label: t('nav.dashboard'), path: '/teacher', icon: LayoutDashboard },
    { label: t('nav.myClasses'), path: '/teacher/classes', icon: GraduationCap },
    { label: t('nav.vocabulary'), path: '/teacher/vocabulary', icon: BookOpen },
    // { label: t('nav.assignments'), path: '/teacher/assignments', icon: FileCheck2 },
    // { label: t('nav.students'), path: '/teacher/students', icon: Users },
    // { label: t('nav.analytics'), path: '/teacher/analytics', icon: BarChart3 },
    // { label: t('nav.aiTools'), path: '/teacher/ai-tools', icon: Sparkles },
    // { label: t('nav.settings'), path: '/teacher/settings', icon: Settings },
  ];

  const studentNav = [
    { label: t('nav.myClasses'), path: '/student', icon: GraduationCap },
    { label: t('nav.vocabulary'), path: '/student/vocabulary', icon: BookOpen },
    // { label: t('nav.dashboard'), path: '/student/dashboard', icon: LayoutDashboard },
    // { label: t('nav.assignments'), path: '/student/review', icon: RotateCcw },
    // { label: t('nav.analytics'), path: '/student/progress', icon: BarChart3 },
    // { label: t('nav.settings'), path: '/student/settings', icon: Settings },
  ];

  const adminNav = [
    { label: t('nav.students'), path: '/admin/users', icon: Users },
    { label: t('nav.teacherWorkspace'), path: '/teacher', icon: GraduationCap },
    { label: t('nav.studentWorkspace'), path: '/student', icon: BookOpen },
    { label: t('nav.analytics'), path: '/teacher/analytics', icon: BarChart3 },
    { label: t('nav.settings'), path: '/teacher/settings', icon: Settings },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-600/30 border border-white/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-white tracking-tight">LernNo</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Workspace</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="mx-4 my-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                <p className="text-[11px] text-slate-400 capitalize truncate flex items-center gap-1">
                  {role === 'admin' && <ShieldCheck className="w-3 h-3 text-rose-400 inline" />}
                  {role === 'teacher' ? t('nav.teacherWorkspace') : role === 'admin' ? 'Admin' : t('nav.studentWorkspace')}
                </p>
              </div>
            </div>
            {role === 'student' && (
              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {user.streak || 7}d
              </div>
            )}
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {role === 'admin' ? 'Super Admin Portal' : role === 'teacher' ? t('nav.teacherWorkspace') : t('nav.studentWorkspace')}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/teacher' || item.path === '/student' || item.path === '/admin/users'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600/90 text-white shadow-lg shadow-brand-600/25 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            );
          })}
        </nav>

      </aside>
    </>
  );
};
