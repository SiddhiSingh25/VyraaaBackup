import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, description, children, footer }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop - Utilizing your dark theme color for a warmer tint */}
      <div
        className="absolute inset-0 bg-dark/40 backdrop-blur-[3px] transition-opacity duration-500 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel - Utilizing background color, deeper shadows, and softer borders */}
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl
          bg-background shadow-2xl shadow-dark/10 animate-scale-in flex flex-col"
      >
        {/* Header - Frosted glass effect for scrolling */}
        <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-5 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-heading font-admin-text tracking-wide">
              {title}
            </h2>
            {description && <p className="mt-2 text-sm text-muted font-admin-text leading-relaxed">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="shrink-0 rounded-full p-2 text-muted hover:bg-surface hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-light/50"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 font-admin-text">
          {children}
        </div>

        {/* Footer - Frosted glass effect */}
        {footer && (
          <div className="flex items-center justify-end gap-4 px-8 py-5 border-t border-border sticky bottom-0 bg-background/95 backdrop-blur-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}