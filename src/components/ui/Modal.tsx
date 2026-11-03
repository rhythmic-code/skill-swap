import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        style={{ position: 'absolute', inset: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`modal${size === 'lg' ? ' modal--lg' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
        {title && (
          <div className="modal__header">
            <h2 id="modal-title" style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="btn-ghost"
              style={{ minHeight: 36, padding: '0 var(--space-xs)' }}
              aria-label="Close"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
