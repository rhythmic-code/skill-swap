import React from 'react';
import type { ListingStatus, ProposalStatus, CollaborationStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export function Badge({ children, variant = 'open', className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}

export function statusToBadge(status: ListingStatus | ProposalStatus | CollaborationStatus): string {
  const map: Record<string, string> = {
    open: 'open',
    paused: 'paused',
    completed: 'completed',
    pending: 'pending',
    accepted: 'accepted',
    declined: 'declined',
    'in-progress': 'inprogress',
    active: 'active',
    cancelled: 'cancelled',
    disputed: 'disputed',
  };
  return map[status] || 'open';
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    open: 'Open',
    paused: 'Paused',
    completed: 'Completed',
    pending: 'Pending',
    accepted: 'Accepted',
    declined: 'Declined',
    'in-progress': 'In progress',
    active: 'Active',
    cancelled: 'Cancelled',
    disputed: 'Disputed',
  };
  return map[status] || status;
}
