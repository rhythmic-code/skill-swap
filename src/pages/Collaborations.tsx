import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitMerge, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/ui/Avatar';
import { Badge, statusToBadge, statusLabel } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate } from '../lib/utils';
import type { Collaboration } from '../types';

export function Collaborations() {
  const { collaborations } = useData();
  const { profile, user } = useAuth();
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  if (!user || !profile) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={<GitMerge size={28} />}
          title="Sign in to view collaborations"
          action={<Link to="/auth/login" className="btn-primary">Sign in</Link>}
        />
      </div>
    );
  }

  const mine = collaborations.filter(
    c => c.participant_a_id === profile.id || c.participant_b_id === profile.id
  );

  const active = mine.filter(c => c.status === 'active');
  const completed = mine.filter(c => c.status === 'completed');
  const displayed = tab === 'active' ? active : completed;

  return (
    <div className="page-container py-8">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-title mb-1">Collaborations</h1>
          <p className="section-subtitle">Track your active exchanges and completed work.</p>
        </div>
        <Link to="/proposals" className="btn-secondary text-sm">
          View proposals
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-xl w-fit mb-6">
        {(['active', 'completed'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t === 'active' ? <Clock size={14} /> : <CheckCircle size={14} />}
            {t.charAt(0).toUpperCase() + t.slice(1)} ({t === 'active' ? active.length : completed.length})
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <EmptyState
          icon={<GitMerge size={28} />}
          title={tab === 'active' ? 'No active collaborations' : 'No completed collaborations'}
          description={
            tab === 'active'
              ? 'Accept a proposal to start a collaboration.'
              : 'Completed collaborations will appear here once both sides confirm.'
          }
          action={
            tab === 'active' ? (
              <Link to="/proposals" className="btn-primary">View proposals</Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {displayed.map(collab => (
            <CollabCard key={collab.id} collab={collab} myId={profile.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function CollabCard({ collab, myId }: { collab: Collaboration; myId: string }) {
  const other =
    collab.participant_a_id === myId ? collab.participant_b : collab.participant_a;

  const completedMilestones = collab.milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = collab.milestones.length;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <Link to={`/collaborations/${collab.id}`} className="card p-5 hover:shadow-md transition-shadow block">
      <div className="flex items-start gap-3 mb-4">
        {other && (
          <Avatar src={other.avatar_url} name={other.display_name} size="md" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 truncate">
            {other?.display_name || 'Unknown'}
          </p>
          <p className="text-xs text-stone-400">{other?.college}</p>
        </div>
        <Badge variant={statusToBadge(collab.status)}>
          {statusLabel(collab.status)}
        </Badge>
      </div>

      <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4">
        {collab.agreed_scope}
      </p>

      {/* Progress */}
      {totalMilestones > 0 && (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 'var(--space-xs)' }}>
            <span>Milestones</span>
            <span className="num" style={{ fontFamily: 'var(--font-outlier)' }}>{completedMilestones}/{totalMilestones}</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ transform: `scaleX(${progress / 100})` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-1">
          <Clock size={11} />
          Started {formatDate(collab.start_date)}
        </div>
        {collab.target_date && (
          <span>Due {formatDate(collab.target_date)}</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end text-xs font-medium text-indigo-600">
        View details <ArrowRight size={13} className="ml-1" />
      </div>
    </Link>
  );
}
