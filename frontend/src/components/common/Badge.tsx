import React from 'react';
import { clsx } from 'clsx';
import type { GermanArticle, DifficultyLevel, WordStatus, CEFRLevel } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const base = 'inline-flex items-center font-medium rounded-full border transition-colors';

  const variants = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    brand: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};

export const ArticleBadge: React.FC<{ article?: GermanArticle; className?: string }> = ({ article, className }) => {
  if (!article) return null;

  const config = {
    der: { label: 'der', styles: 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold' },
    die: { label: 'die', styles: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold' },
    das: { label: 'das', styles: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' },
    '': { label: '', styles: '' },
  };

  const active = config[article] || config['der'];

  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 text-xs rounded-md border uppercase tracking-wide', active.styles, className)}>
      {active.label}
    </span>
  );
};

export const DifficultyBadge: React.FC<{ difficulty?: DifficultyLevel }> = ({ difficulty = 'Medium' }) => {
  const map: Record<DifficultyLevel, 'success' | 'warning' | 'danger'> = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'danger',
  };
  return <Badge variant={map[difficulty]}>{difficulty}</Badge>;
};

export const StatusBadge: React.FC<{ status?: WordStatus | string }> = ({ status = 'Published' }) => {
  const map: Record<string, 'success' | 'warning' | 'default'> = {
    Published: 'success',
    Draft: 'warning',
    Review: 'default',
    'Needs Review': 'warning',
    Excellent: 'success',
    'On Track': 'default',
  };
  return <Badge variant={map[status] || 'default'}>{status}</Badge>;
};

export const LevelBadge: React.FC<{ level?: CEFRLevel }> = ({ level = 'A2' }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-sm border border-white/20">
      {level}
    </span>
  );
};
