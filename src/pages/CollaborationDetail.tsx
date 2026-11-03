import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Avatar } from '../components/ui/Avatar';
import { Badge, statusToBadge, statusLabel } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatDate, formatRelativeDate, cn } from '../lib/utils';
import type { Review, Milestone } from '../types';

export function CollaborationDetail() {
  const { id } = useParams<{ id: string }>();
  const { collaborations, updateCollaboration, addReview, reviews } = useData();
  const { profile } = useAuth();
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const collab = collaborations.find(c => c.id === id);

  if (!collab) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-stone-500">Collaboration not found.</p>
        <Link to="/collaborations" className="btn-primary mt-4">Back</Link>
      </div>
    );
  }

  const isParticipantA = profile?.id === collab.participant_a_id;
  const isParticipantB = profile?.id === collab.participant_b_id;
  const isParticipant = isParticipantA || isParticipantB;
  const other = isParticipantA ? collab.participant_b : collab.participant_a;
  const myId = profile?.id;

  const myCompleted = isParticipantA ? collab.participant_a_completed : collab.participant_b_completed;

  const existingReview = reviews.find(
    r => r.collaboration_id === collab.id && r.reviewer_id === myId
  );

  const handleMarkComplete = () => {
    if (!isParticipant) return;

    const updates = isParticipantA
      ? { participant_a_completed: true }
      : { participant_b_completed: true };

    const bothDone =
      (isParticipantA && collab.participant_b_completed) ||
      (isParticipantB && collab.participant_a_completed);

    const finalUpdates = bothDone
      ? { ...updates, status: 'completed' as const }
      : updates;

    updateCollaboration(collab.id, finalUpdates);

    if (bothDone) {
      success('Collaboration completed!', 'Both participants confirmed. You can now leave a review.');
    } else {
      info('Marked as complete', 'Waiting for your collaborator to confirm.');
    }
  };

  const handleMilestoneToggle = (milestone: Milestone) => {
    if (!isParticipant) return;
    const updated = collab.milestones.map(m => {
      if (m.id !== milestone.id) return m;
      const newStatus = m.status === 'completed' ? 'pending' : 'completed';
      return {
        ...m,
        status: newStatus as 'pending' | 'in-progress' | 'completed',
        ...(isParticipantA
          ? { completed_by_a_at: newStatus === 'completed' ? new Date().toISOString() : undefined }
          : { completed_by_b_at: newStatus === 'completed' ? new Date().toISOString() : undefined }),
      };
    });
    updateCollaboration(collab.id, { milestones: updated });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !other) return;
    if (!reviewForm.comment.trim()) {
      showError('Please write a review comment');
      return;
    }

    setSubmittingReview(true);

    const review: Review = {
      id: `review-${Date.now()}`,
      collaboration_id: collab.id,
      reviewer_id: profile.id,
      reviewee_id: other.id,
      reviewer: profile,
      reviewee: other,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      created_at: new Date().toISOString(),
    };

    addReview(review);
    setSubmittingReview(false);
    setShowReviewModal(false);
    success('Review submitted!', 'Your review has been added to their profile.');
  };

  const completedCount = collab.milestones.filter(m => m.status === 'completed').length;
  const progress = collab.milestones.length > 0
    ? Math.round((completedCount / collab.milestones.length) * 100)
    : 0;

  return (
    <div className="page-container py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2 text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <h1 className="text-xl font-bold text-stone-900">Collaboration</h1>
              <Badge variant={statusToBadge(collab.status)}>{statusLabel(collab.status)}</Badge>
            </div>

            <div className="flex items-center gap-3 mb-4">
              {[collab.participant_a, collab.participant_b].filter(Boolean).map((p, i) => (
                <React.Fragment key={p!.id}>
                  {i > 0 && <span className="text-stone-300">↔</span>}
                  <Link to={`/users/${p!.username}`} className="flex items-center gap-2 hover:opacity-80">
                    <Avatar src={p!.avatar_url} name={p!.display_name} size="sm" />
                    <span className="text-sm font-medium text-stone-700">{p!.display_name}</span>
                  </Link>
                </React.Fragment>
              ))}
            </div>

            <p className="text-stone-600 leading-relaxed mb-4">{collab.agreed_scope}</p>

            <div className="flex flex-wrap gap-4 text-sm text-stone-500">
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                Started {formatDate(collab.start_date)}
              </span>
              {collab.target_date && (
                <span>Target: {formatDate(collab.target_date)}</span>
              )}
            </div>
          </div>

          {/* Milestones */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-stone-900">Milestones</h2>
              <span className="text-sm text-stone-400">{completedCount}/{collab.milestones.length}</span>
            </div>

            {collab.milestones.length > 0 && (
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ transform: `scaleX(${progress / 100})` }}
                  aria-valuenow={progress}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            )}

            {collab.milestones.length === 0 ? (
              <p className="text-sm text-stone-400">No milestones defined for this collaboration.</p>
            ) : (
              <div className="space-y-3">
                {collab.milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-xl border transition-colors',
                      milestone.status === 'completed'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-stone-50 border-stone-200'
                    )}
                  >
                    {isParticipant ? (
                      <button
                        onClick={() => handleMilestoneToggle(milestone)}
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors',
                          milestone.status === 'completed'
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-stone-300 hover:border-indigo-400'
                        )}
                        aria-label={milestone.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {milestone.status === 'completed' && <CheckCircle size={12} />}
                      </button>
                    ) : (
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5',
                        milestone.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-stone-300'
                      )} />
                    )}
                    <div className="flex-1">
                      <p className={cn(
                        'text-sm font-medium',
                        milestone.status === 'completed' ? 'text-green-800 line-through' : 'text-stone-800'
                      )}>
                        {milestone.title}
                      </p>
                      {milestone.description && (
                        <p className="text-xs text-stone-500 mt-0.5">{milestone.description}</p>
                      )}
                      {milestone.due_date && (
                        <p className="text-xs text-stone-400 mt-1">
                          Due {formatDate(milestone.due_date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Participants */}
          <div className="card p-5">
            <h3 className="font-semibold text-stone-700 text-sm mb-4">Participants</h3>
            {[
              { p: collab.participant_a, completed: collab.participant_a_completed, label: 'Participant A' },
              { p: collab.participant_b, completed: collab.participant_b_completed, label: 'Participant B' },
            ].filter(x => x.p).map(({ p, completed, label }) => (
              <div key={p!.id} className="flex items-center gap-3 mb-3">
                <Avatar src={p!.avatar_url} name={p!.display_name} size="sm" />
                <div className="flex-1">
                  <Link to={`/users/${p!.username}`} className="text-sm font-medium text-stone-900 hover:text-indigo-600">
                    {p!.display_name}
                  </Link>
                  <p className="text-xs text-stone-400">{p!.college}</p>
                </div>
                {completed && (
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          {isParticipant && collab.status === 'active' && (
            <div className="card p-5 space-y-3">
              <h3 className="font-semibold text-stone-700 text-sm">Your actions</h3>

              {myCompleted ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
                  <CheckCircle size={16} />
                  You confirmed completion
                </div>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  className="btn-primary w-full justify-center"
                >
                  <CheckCircle size={16} />
                  Mark my part complete
                </button>
              )}

              <p className="text-xs text-stone-400 text-center">
                The collaboration is only marked done when both participants confirm.
              </p>
            </div>
          )}

          {/* Review */}
          {collab.status === 'completed' && isParticipant && !existingReview && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="btn-primary w-full justify-center"
            >
              <Star size={16} />
              Leave a review
            </button>
          )}

          {existingReview && (
            <div className="card p-4 bg-green-50 border-green-200 text-center">
              <CheckCircle size={18} className="text-green-500 mx-auto mb-1" />
              <p className="text-sm text-green-700 font-medium">Review submitted</p>
            </div>
          )}

          {/* Warning */}
          <div className="card p-4 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                SkillSwap does not enforce deliverables. If something goes wrong, report it and communicate directly. Do not proceed if you are uncomfortable with the terms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review modal */}
      <Modal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Review ${other?.display_name}`}
        size="md"
      >
        <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                  className="p-1"
                  aria-label={`${star} star`}
                >
                  <Star
                    size={24}
                    className={star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Your review *</label>
            <textarea
              value={reviewForm.comment}
              onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
              className="input min-h-[120px]"
              placeholder="Describe your experience collaborating with this person…"
              required
            />
          </div>

          <p className="text-xs text-stone-400">
            Reviews are public and visible on the collaborator's profile. Be honest, constructive, and respectful.
          </p>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowReviewModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submittingReview}>
              {submittingReview ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
