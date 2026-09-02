import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthMap: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] overflow-y-auto p-2 sm:p-4 md:p-6">
      {/* Backdrop covering 100% of the entire viewport */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Centering wrapper */}
      <div className="flex min-h-full items-center justify-center py-2 sm:py-6">
        {/* Dialog container */}
        <div
          className={clsx(
            'relative w-full rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl z-10 animate-scaleUp overflow-hidden flex flex-col my-auto max-h-[92vh] sm:max-h-[88vh]',
            widthMap[maxWidth] || 'max-w-lg'
          )}
        >
          {/* Header (Always visible and sticky) */}
          {(title || description) && (
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
              <div className="pr-3">
                {title && <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-snug">{title}</h3>}
                {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Content (Scrollable) */}
          <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
