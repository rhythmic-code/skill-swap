import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitMerge, Send, Inbox, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Avatar } from '../components/ui/Avatar';
import { Badge, statusToBadge, statusLabel } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatRelativeDate, formatDate } from '../lib/utils';
import type { Proposal } from '../types';

export function Proposals() {
  const { proposals, updateProposal } = useData();
  const { profile, user } = useAuth();
  const { success, error } = useToast();
  const [tab, setTab] = useState<'incoming' | 'outgoing'>('incoming');

  if (!user || !profile) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={<GitMerge size={28} />}
          title="Sign in to view proposals"
          action={<Link to="/auth/login" className="btn-primary">Sign in</Link>}
        />
      </div>
    );
  }

  const incoming = proposals.filter(p => p.receiver_id === profile.id);
  const outgoing = proposals.filter(p => p.sender_id === profile.id);
  const displayed = tab === 'incoming' ? incoming : outgoing;

  const handleAccept = (proposal: Proposal) => {
    updateProposal(proposal.id, { status: 'accepted', updated_at: new Date().toISOString() });
    success('Proposal accepted!', 'A collaboration has been created. Check Collaborations.');
  };

  const handleDecline = (proposal: Proposal) => {
    updateProposal(proposal.id, { status: 'declined', updated_at: new Date().toISOString() });
    error('Proposal declined.');
  };

  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <h1 className="section-title mb-1">Proposals</h1>
        <p className="section-subtitle">Review incoming proposals and track ones you have sent.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-xl w-fit mb-6">
        <button
          onClick={() => setTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'incoming' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <Inbox size={15} />
          Incoming
          {incoming.filter(p => p.status === 'pending').length > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
              {incoming.filter(p => p.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('outgoing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'outgoing' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <Send size={15} />
          Outgoing ({outgoing.length})
        </button>
      </div>

      {displayed.length === 0 ? (
        <EmptyState
          icon={tab === 'incoming' ? <Inbox size={28} /> : <Send size={28} />}
          title={tab === 'incoming' ? 'No incoming proposals' : 'No outgoing proposals'}
          description={
            tab === 'incoming'
              ? 'When someone sends you a proposal it will appear here.'
              : 'Browse listings and send proposals to potential collaborators.'
          }
          action={
            tab === 'outgoing' ? (
              <Link to="/discover" className="btn-primary">Browse listings</Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {displayed.map(proposal => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              isIncoming={tab === 'incoming'}
              onAccept={() => handleAccept(proposal)}
              onDecline={() => handleDecline(proposal)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProposalCard({
  proposal,
  isIncoming,
  onAccept,
  onDecline,
}: {
  proposal: Proposal;
  isIncoming: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const other = isIncoming ? proposal.sender : proposal.receiver;

  return (
    <div className="card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4 flex-wrap">
          {other && (
            <Link to={`/users/${other.username}`} className="flex-shrink-0">
              <Avatar src={other.avatar_url} name={other.display_name} size="md" />
            </Link>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-semibold text-stone-900">
                  {isIncoming ? 'From ' : 'To '}
                  <Link to={`/users/${other?.username}`} className="hover:text-indigo-600">
                    {other?.display_name}
                  </Link>
                </p>
                {proposal.listing && (
                  <p className="text-sm text-stone-500 mt-0.5">
                    Re:{' '}
                    <Link to={`/listings/${proposal.listing_id}`} className="hover:text-indigo-600">
                      {proposal.listing.title}
                    </Link>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={statusToBadge(proposal.status)}>
                  {statusLabel(proposal.status)}
                </Badge>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Clock size={12} />
                  {formatRelativeDate(proposal.created_at)}
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-600 mt-2 line-clamp-2">
              {proposal.offer_description}
            </p>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 font-medium"
            >
              {expanded ? 'Show less' : 'Show full details'}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-5 pt-5 border-t border-stone-100 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-indigo-50">
                <p className="text-xs font-semibold text-indigo-700 mb-2">
                  {isIncoming ? 'They will deliver' : 'You will deliver'}
                </p>
                <p className="text-sm text-indigo-900 leading-relaxed">{proposal.sender_deliverables}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50">
                <p className="text-xs font-semibold text-amber-700 mb-2">
                  {isIncoming ? 'You will deliver' : 'They will deliver'}
                </p>
                <p className="text-sm text-amber-900 leading-relaxed">{proposal.receiver_deliverables}</p>
              </div>
            </div>

            {proposal.target_date && (
              <p className="text-sm text-stone-500">
                <strong>Target completion:</strong> {formatDate(proposal.target_date)}
              </p>
            )}

            {proposal.notes && (
              <div className="p-4 rounded-xl bg-stone-50">
                <p className="text-xs font-medium text-stone-500 mb-1">Additional notes</p>
                <p className="text-sm text-stone-700 leading-relaxed">{proposal.notes}</p>
              </div>
            )}

            {proposal.milestones.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-stone-500 mb-2">Proposed milestones</p>
                <ul className="space-y-1.5">
                  {proposal.milestones.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-stone-600">
                      <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-500 text-xs flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      {m.title}
                      {m.due_date && (
                        <span className="text-stone-400 text-xs ml-auto">{formatDate(m.due_date)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {isIncoming && proposal.status === 'pending' && (
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={onAccept}
            className="btn-primary flex-1 justify-center gap-2"
          >
            <CheckCircle size={16} />
            Accept proposal
          </button>
          <button
            onClick={onDecline}
            className="btn-secondary flex-1 justify-center gap-2 text-red-600 hover:bg-red-50"
          >
            <XCircle size={16} />
            Decline
          </button>
        </div>
      )}

      {proposal.status === 'accepted' && (
        <div className="px-5 pb-5">
          <Link to="/collaborations" className="btn-primary w-full justify-center">
            <GitMerge size={16} />
            View collaboration
          </Link>
        </div>
      )}
    </div>
  );
}
