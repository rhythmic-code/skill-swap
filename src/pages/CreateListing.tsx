import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useToast } from '../components/ui/Toast';
import { SkillTag } from '../components/ui/SkillTag';
import { SKILL_CATEGORIES, DEMO_SKILLS } from '../data/demo';
import type { Listing, Skill, SkillCategory, ListingType, AvailabilityType, CollaborationType } from '../types';

interface CreateListingProps {
  defaultType?: ListingType;
}

export function CreateListing({ defaultType = 'offer' }: CreateListingProps) {
  const [searchParams] = useSearchParams();
  const listingType: ListingType = (searchParams.get('type') as ListingType) || defaultType;

  const { profile, user } = useAuth();
  const { addListing } = useData();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as SkillCategory | '',
    deliverables: '',
    estimated_effort: '',
    availability: '' as AvailabilityType | '',
    city: profile?.city || '',
    collaboration_type: 'skill-barter' as CollaborationType,
    portfolio_url: '',
  });

  const [skillsOffered, setSkillsOffered] = useState<Skill[]>([]);
  const [skillsNeeded, setSkillsNeeded] = useState<Skill[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [customCategory, setCustomCategory] = useState<SkillCategory | ''>('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-stone-500 mb-4">Sign in to create a listing.</p>
        <Link to="/auth/login" className="btn-primary">Sign in</Link>
      </div>
    );
  }

  const addSkill = (target: 'offer' | 'need', skill: Skill) => {
    if (target === 'offer') {
      if (!skillsOffered.find(s => s.id === skill.id)) {
        setSkillsOffered(prev => [...prev, skill]);
      }
    } else {
      if (!skillsNeeded.find(s => s.id === skill.id)) {
        setSkillsNeeded(prev => [...prev, skill]);
      }
    }
  };

  const addCustomSkill = (target: 'offer' | 'need') => {
    if (!customSkill.trim() || !customCategory) {
      showError('Add a skill name and category');
      return;
    }
    const skill: Skill = {
      id: `custom-${Date.now()}`,
      name: customSkill.trim(),
      category: customCategory as SkillCategory,
    };
    addSkill(target, skill);
    setCustomSkill('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.deliverables || !form.estimated_effort || !form.availability) {
      showError('Please fill in all required fields');
      return;
    }
    if (skillsOffered.length === 0 && listingType === 'offer') {
      showError('Add at least one skill you are offering');
      return;
    }

    setSubmitting(true);

    const listing: Listing = {
      id: `listing-${Date.now()}`,
      owner_id: profile!.id,
      owner: profile!,
      listing_type: listingType,
      title: form.title,
      description: form.description,
      category: form.category as SkillCategory,
      deliverables: form.deliverables,
      estimated_effort: form.estimated_effort,
      availability: form.availability as AvailabilityType,
      city: form.city || undefined,
      status: 'open',
      skills_offered: skillsOffered,
      skills_needed: skillsNeeded,
      portfolio_url: form.portfolio_url || undefined,
      collaboration_type: form.collaboration_type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addListing(listing);
    setSubmitting(false);
    success('Listing created!', 'Your listing is now live on Discover.');
    navigate(`/listings/${listing.id}`);
  };

  const isOffer = listingType === 'offer';

  return (
    <div className="page-container py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2 text-sm">
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex gap-3 mb-4">
            <Link
              to="/create/offer"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isOffer ? 'bg-indigo-600 text-white' : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'
              }`}
            >
              Offer a skill
            </Link>
            <Link
              to="/create/request"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isOffer ? 'bg-amber-500 text-white' : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'
              }`}
            >
              Request help
            </Link>
          </div>
          <h1 className="section-title">
            {isOffer ? 'Offer a skill' : 'Request help with a project'}
          </h1>
          <p className="section-subtitle">
            {isOffer
              ? 'Describe what you can do and what you are looking for in exchange.'
              : 'Describe your project and what kind of help you need.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="card p-6 space-y-5">
            <h2 className="font-semibold text-stone-900">
              {isOffer ? 'About your offer' : 'About your project'}
            </h2>

            <div>
              <label className="label">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="input"
                placeholder={isOffer ? 'e.g. Build a landing page in React' : 'e.g. Need a UI designer for my mobile app'}
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="label">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as SkillCategory }))}
                className="input"
                required
              >
                <option value="">Select a category</option>
                {SKILL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="input min-h-[120px]"
                placeholder={isOffer
                  ? 'Describe what you can do, your experience level, and any relevant context…'
                  : 'Describe your project, the problem you are solving, and what stage you are at…'}
                required
              />
            </div>

            <div>
              <label className="label">Expected deliverables *</label>
              <textarea
                value={form.deliverables}
                onChange={e => setForm(f => ({ ...f, deliverables: e.target.value }))}
                className="input min-h-[80px]"
                placeholder="List exactly what will be produced or delivered at the end of this exchange…"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Estimated effort *</label>
                <input
                  type="text"
                  value={form.estimated_effort}
                  onChange={e => setForm(f => ({ ...f, estimated_effort: e.target.value }))}
                  className="input"
                  placeholder="e.g. 1–2 weeks, ~10 hours"
                  required
                />
              </div>
              <div>
                <label className="label">Your availability *</label>
                <select
                  value={form.availability}
                  onChange={e => setForm(f => ({ ...f, availability: e.target.value as AvailabilityType }))}
                  className="input"
                  required
                >
                  <option value="">Select availability</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="evenings">Evenings</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                  <option value="limited">Limited</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">City (optional)</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="input"
                  placeholder="e.g. New York, NY"
                />
              </div>
              <div>
                <label className="label">Collaboration type</label>
                <select
                  value={form.collaboration_type}
                  onChange={e => setForm(f => ({ ...f, collaboration_type: e.target.value as CollaborationType }))}
                  className="input"
                >
                  <option value="skill-barter">Skill Barter</option>
                  <option value="project-collaboration">Project Collaboration</option>
                  <option value="startup-team">Startup Team</option>
                  <option value="portfolio-building">Portfolio Building</option>
                  <option value="open-to-discuss">Open to Discuss</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Portfolio / reference URL (optional)</label>
              <input
                type="url"
                value={form.portfolio_url}
                onChange={e => setForm(f => ({ ...f, portfolio_url: e.target.value }))}
                className="input"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          {/* Skills offered */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-stone-900">
              {isOffer ? 'Skills you are offering' : 'Skills you can offer in exchange'}
            </h2>

            <div className="flex flex-wrap gap-2">
              {skillsOffered.map(s => (
                <SkillTag
                  key={s.id}
                  skill={s}
                  type="offer"
                  onRemove={() => setSkillsOffered(prev => prev.filter(x => x.id !== s.id))}
                />
              ))}
            </div>

            <div>
              <p className="text-xs text-stone-500 mb-2">Pick from common skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_SKILLS.slice(0, 12).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addSkill('offer', s)}
                    disabled={!!skillsOffered.find(x => x.id === s.id)}
                    className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value as SkillCategory)}
                className="input flex-1"
              >
                <option value="">Category</option>
                {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="text"
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                className="input flex-2"
                placeholder="Custom skill name"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill('offer'); } }}
              />
              <button type="button" onClick={() => addCustomSkill('offer')} className="btn-secondary px-3">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Skills needed */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-stone-900">
              {isOffer ? 'Skills you want in return' : 'Skills you need'}
            </h2>

            <div className="flex flex-wrap gap-2">
              {skillsNeeded.map(s => (
                <SkillTag
                  key={s.id}
                  skill={s}
                  type="need"
                  onRemove={() => setSkillsNeeded(prev => prev.filter(x => x.id !== s.id))}
                />
              ))}
            </div>

            <div>
              <p className="text-xs text-stone-500 mb-2">Pick from common skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_SKILLS.slice(0, 12).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addSkill('need', s)}
                    disabled={!!skillsNeeded.find(x => x.id === s.id)}
                    className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value as SkillCategory)}
                className="input flex-1"
              >
                <option value="">Category</option>
                {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="text"
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                className="input flex-2"
                placeholder="Custom skill name"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill('need'); } }}
              />
              <button type="button" onClick={() => addCustomSkill('need')} className="btn-secondary px-3">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : `Publish ${isOffer ? 'offer' : 'request'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
