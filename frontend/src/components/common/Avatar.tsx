import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  className,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-500',
    busy: 'bg-rose-500',
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={name}
          className={clsx('rounded-full object-cover border-2 border-slate-700/80 shadow-md', sizes[size], className)}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-gradient-to-tr from-brand-600 to-violet-600 text-white font-bold flex items-center justify-center border-2 border-slate-700/80 shadow-md',
            sizes[size],
            className
          )}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900',
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};
