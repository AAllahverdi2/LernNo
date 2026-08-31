import React from 'react';
import { Card } from './Card';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isUp: boolean;
  };
  accentColor?: 'brand' | 'emerald' | 'amber' | 'violet' | 'rose';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'brand',
  className,
}) => {
  const accentStyles = {
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <Card className={clsx('p-5 hover:border-slate-700/80 transition-all duration-200 group', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-white tracking-tight group-hover:scale-[1.02] transition-transform origin-left">
            {value}
          </h3>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={clsx('p-3 rounded-2xl border', accentStyles[accentColor])}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-medium">
          {trend.isUp ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              {trend.value}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              {trend.value}
            </span>
          )}
          <span className="text-slate-400">vs last week</span>
        </div>
      )}
    </Card>
  );
};
