import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 'var(--space-xs)' }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', maxWidth: '38ch', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
