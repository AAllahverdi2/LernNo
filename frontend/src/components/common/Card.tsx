import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = true,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-200 overflow-hidden',
        glass
          ? 'bg-slate-900/70 backdrop-blur-xl border-slate-800/80 shadow-xl'
          : 'bg-slate-900 border-slate-800 shadow-md',
        hoverEffect && 'hover:border-slate-700 hover:shadow-2xl hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={clsx('px-6 py-5 border-b border-slate-800/80 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={clsx('p-6', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={clsx('px-6 py-4 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
