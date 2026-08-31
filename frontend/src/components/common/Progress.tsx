import React from 'react';
import { clsx } from 'clsx';

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  gradient?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  gradient = true,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-slate-300">
          {label && <span>{label}</span>}
          {showValue && <span>{percentage}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/60 p-0.5', sizeStyles[size])}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            gradient
              ? 'bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 shadow-md shadow-brand-500/30'
              : 'bg-brand-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
