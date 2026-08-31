import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3.5 text-slate-400 pointer-events-none">{leftIcon}</div>}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'w-full rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 text-sm px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error ? 'border-rose-500/80 focus:ring-rose-500/50' : 'border-slate-800 hover:border-slate-700',
              className
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3.5 text-slate-400">{rightIcon}</div>}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
