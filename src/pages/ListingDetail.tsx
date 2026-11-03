import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
  Send,
  Edit,
  Trash2,
  FlaskConical,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Avatar } from '../components/ui/Avatar';
import { Badge, statusToBadge, statusLabel } from '../components/ui/Badge';
import { SkillTag } from '../components/ui/SkillTag';
import { Modal } from '../components/ui/Modal';
import { availabilityLabel, collaborationLabel, formatRelativeDate } from '../lib/utils';
import { DEMO_PROFILES } from '../data/demo';
import type { Proposal } from '../types';

export function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { listings, addProposal, deleteListing } = useData();
  const { profile, user } = useAuth();
  const { success, error: showError, info } = useToast();
  const navigate = useNavigate();

  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    offer_description: '',
    sender_deliverables: '',
    receiver_deliverables: '',
    estimated_hours: 10,
    start_date: '',
    target_date: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-stone-500">Listing not found.</p>
        <Link to="/discover" className="btn-primary mt-4">Back to Discover</Link>
      </div>
    );
  }

  const owner = listing.owner || DEMO_PROFILES.find(p => p.id === listing.owner_id);
  const isOwner = user && profile?.id === listing.owner_id;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) {
      deleteListing(listing.id);
      success('Listing deleted');
      navigate('/discover');
    }
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      info('Sign in to send a proposal');
      navigate('/auth/login');
      return;
    }
    if (isOwner) {
      showError("You can't propose on your own listing");
      return;
    }

    setSubmitting(true);

    const proposal: Proposal = {
      id: `proposal-${Date.now()}`,
      sender_id: profile.id,
      receiver_id: listing.owner_id,
      listing_id: listing.id,
      sender: profile,
      receiver: owner,
      listing,
      offer_description: proposalForm.offer_description,
      requested_deliverables: proposalForm.receiver_deliverables,
      sender_deliverables: proposalForm.sender_deliverables,
      receiver_deliverables: proposalForm.receiver_deliverables,
      milestones: [],
      estimated_hours: proposalForm.estimated_hours,
      start_date: proposalForm.start_date || undefined,
      target_date: proposalForm.target_date || undefined,
      notes: proposalForm.notes || undefined,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addProposal(proposal);
    setSubmitting(false);
    setShowProposalModal(false);
    success('Proposal sent!', 'The listing owner will review your proposal.');
    navigate('/proposals');
  };

  return (
    <div className="page-container py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost mb-6 -ml-2 text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold rounded-full px-3 py-1 ${
                  listing.listing_type === 'offer'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {listing.listing_type === 'offer' ? 'Skill Offer' : 'Project Request'}
                </span>
                <Badge variant={statusToBadge(listing.status)}>
                  {statusLabel(listing.status)}
                </Badge>
                {listing.is_demo && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <FlaskConical size={12} />Demo content
                  </span>
                )}
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Link to={`/create/offer?edit=${listing.id}`} className="btn-ghost text-sm py-1.5 px-3">
                    <Edit size={14} />
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="btn-ghost text-sm py-1.5 px-3 text-red-600 hover:bg-red-50">
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-stone-900 mb-4 leading-snug">{listing.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-6">
              {listing.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {listing.city}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {availabilityLabel(listing.availability)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {listing.estimated_effort}
              </span>
            </div>

            <p className="text-stone-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Deliverables */}
          <div className="card p-6">
            <h2 className="font-semibold text-stone-900 mb-3">Expected deliverables</h2>
            <p className="text-stone-600 leading-relaxed whitespace-pre-line">{listing.deliverables}</p>
          </div>

          {/* Skills */}
          <div className="card p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold text-stone-900 mb-3">
                  {listing.listing_type === 'offer' ? 'Skills offered' : 'Can offer in exchange'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.skills_offered.map(s => (
                    <SkillTag key={s.id} skill={s} type="offer" />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-semibold text-stone-900 mb-3">
                  {listing.listing_type === 'offer' ? 'Looking for in exchange' : 'Skills needed'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.skills_needed.map(s => (
                    <SkillTag key={s.id} skill={s} type="need" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          {listing.portfolio_url && (
            <div className="card p-6">
              <h2 className="font-semibold text-stone-900 mb-3">Portfolio / reference</h2>
              <a
                href={listing.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1.5"
              >
                <ExternalLink size={14} />
                {listing.portfolio_url}
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Owner card */}
          {owner && (
            <div className="card p-5">
              <h3 className="font-semibold text-stone-700 text-sm mb-4">Posted by</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={owner.avatar_url} name={owner.display_name} size="lg" />
                <div>
                  <Link
                    to={`/users/${owner.username}`}
                    className="font-semibold text-stone-900 hover:text-indigo-600 transition-colors"
                  >
                    {owner.display_name}
                  </Link>
                  <p className="text-xs text-stone-400">@{owner.username}</p>
                  {owner.college && <p className="text-xs text-stone-500 mt-0.5">{owner.college}</p>}
                </div>
              </div>
              {owner.bio && (
                <p className="text-sm text-stone-500 leading-relaxed mb-4 line-clamp-3">{owner.bio}</p>
              )}
              <Link to={`/users/${owner.username}`} className="btn-secondary w-full justify-center text-sm">
                View full profile
              </Link>
            </div>
          )}

          {/* Details card */}
          <div className="card p-5">
            <h3 className="font-semibold text-stone-700 text-sm mb-4">Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-stone-400">Category</dt>
                <dd className="text-sm font-medium text-stone-700 mt-0.5">{listing.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-400">Collaboration type</dt>
                <dd className="text-sm font-medium text-stone-700 mt-0.5">
                  {collaborationLabel(listing.collaboration_type)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-stone-400">Availability</dt>
                <dd className="text-sm font-medium text-stone-700 mt-0.5">
                  {availabilityLabel(listing.availability)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-stone-400">Estimated effort</dt>
                <dd className="text-sm font-medium text-stone-700 mt-0.5">{listing.estimated_effort}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-400">Posted</dt>
                <dd className="text-sm font-medium text-stone-700 mt-0.5">
                  {formatRelativeDate(listing.created_at)}
                </dd>
              </div>
            </dl>
          </div>

          {/* CTA */}
          {!isOwner && listing.status === 'open' && (
            <button
              onClick={() => {
                if (!user) {
                  navigate('/auth/login');
                  return;
                }
                setShowProposalModal(true);
              }}
              className="btn-primary w-full justify-center py-3"
            >
              <Send size={16} />
              Send a proposal
            </button>
          )}

          {isOwner && (
            <div className="card p-4 bg-stone-50 text-center">
              <p className="text-sm text-stone-500">This is your listing. Edit or manage it from your dashboard.</p>
            </div>
          )}
        </div>
      </div>

      {/* Proposal modal */}
      <Modal
        open={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        title="Send a proposal"
        size="lg"
      >
        <form onSubmit={handleProposalSubmit} className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-indigo-50 text-sm text-indigo-700">
            <strong>Proposing on:</strong> {listing.title}
          </div>

          <div>
            <label className="label">Your message / introduction *</label>
            <textarea
              value={proposalForm.offer_description}
              onChange={e => setProposalForm(f => ({ ...f, offer_description: e.target.value }))}
              className="input min-h-[100px]"
              placeholder="Introduce yourself and explain why this exchange makes sense…"
              required
            />
          </div>

          <div>
            <label className="label">What you will deliver *</label>
            <textarea
              value={proposalForm.sender_deliverables}
              onChange={e => setProposalForm(f => ({ ...f, sender_deliverables: e.target.value }))}
              className="input min-h-[80px]"
              placeholder="List exactly what you will provide in this exchange…"
              required
            />
          </div>

          <div>
            <label className="label">What you expect in return *</label>
            <textarea
              value={proposalForm.receiver_deliverables}
              onChange={e => setProposalForm(f => ({ ...f, receiver_deliverables: e.target.value }))}
              className="input min-h-[80px]"
              placeholder="List what you expect the other person to deliver…"
              required
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Est. hours</label>
              <input
                type="number"
                min={1}
                value={proposalForm.estimated_hours}
                onChange={e => setProposalForm(f => ({ ...f, estimated_hours: Number(e.target.value) }))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Start date</label>
              <input
                type="date"
                value={proposalForm.start_date}
                onChange={e => setProposalForm(f => ({ ...f, start_date: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Target date</label>
              <input
                type="date"
                value={proposalForm.target_date}
                onChange={e => setProposalForm(f => ({ ...f, target_date: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Notes (optional)</label>
            <textarea
              value={proposalForm.notes}
              onChange={e => setProposalForm(f => ({ ...f, notes: e.target.value }))}
              className="input"
              placeholder="Any additional context, questions, or conditions…"
            />
          </div>

          <div className="p-4 rounded-xl bg-amber-50 text-xs text-amber-700">
            Both parties must review and agree to the terms before work starts. SkillSwap does not guarantee delivery or enforce exchanges.
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowProposalModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <Send size={15} />
              {submitting ? 'Sending…' : 'Send proposal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
