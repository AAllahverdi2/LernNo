import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sparkles, Sun, Moon, LogOut, Settings, ChevronDown, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { LanguageSelector } from '../common/LanguageSelector';

interface TopNavProps {
  onMenuClick: () => void;
  onOpenAIGenerator?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick, onOpenAIGenerator }) => {
  const { user, role, logout } = useAuth();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    setIsProfileOpen(false);
    if (role === 'teacher') navigate('/teacher/settings');
    else if (role === 'student') navigate('/student/settings');
    else navigate('/teacher/settings');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 md:hidden border border-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('nav.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher Dropdown */}
        <LanguageSelector />

        {/* Theme Toggle Button (Dark vs Light mode) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'İşıqlı Rejimə Keç' : 'Qaranlıq Rejimə Keç'}
          className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-900 border border-slate-800/80 transition-all duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-fadeIn" />
          ) : (
            <Moon className="w-4 h-4 text-brand-500 animate-fadeIn" />
          )}
        </button>

        {role === 'teacher' && onOpenAIGenerator && (
          <Button
            size="sm"
            variant="gradient"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={onOpenAIGenerator}
          >
            {t('nav.generateWithAI')}
          </Button>
        )}

        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* User Profile Avatar & Dropdown Menu Trigger */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-900/90 border border-transparent hover:border-slate-800 transition-all cursor-pointer group"
            >
              <Avatar src={user.avatar} name={user.name} size="sm" status="online" />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white leading-tight group-hover:text-brand-300 transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {role === 'teacher' ? 'Teacher' : role === 'admin' ? 'Admin' : 'Student'}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-brand-400' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 animate-fadeIn">
                {/* Header User Card */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
                  <Avatar src={user.avatar} name={user.name} size="md" status="online" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 mt-1">
                      {role === 'admin' && <ShieldCheck className="w-3 h-3 text-rose-400" />}
                      {role}
                    </span>
                  </div>
                </div>

                <div className="my-1.5 border-t border-slate-800" />

                {/* Settings Item */}
                <button
                  type="button"
                  onClick={handleSettingsClick}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-brand-400" />
                  <span>{t('nav.settings')}</span>
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
