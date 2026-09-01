import React from 'react';
import { Menu, Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { LanguageSelector } from '../common/LanguageSelector';

interface TopNavProps {
  onMenuClick: () => void;
  onOpenAIGenerator?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick, onOpenAIGenerator }) => {
  const { user, role } = useAuth();
  const { t } = useTranslation();

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

        {user && (
          <div className="flex items-center gap-2.5">
            <Avatar src={user.avatar} name={user.name} size="sm" status="online" />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
