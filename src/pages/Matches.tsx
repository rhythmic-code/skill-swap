import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Filter,
  Info,
  Send,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Avatar } from '../components/ui/Avatar';
import { SkillTag } from '../components/ui/SkillTag';
import { EmptyState } from '../components/ui/EmptyState';
import { availabilityLabel } from '../lib/utils';
import type { MatchResult } from '../types';

export function Matches() {
  const { profile, user } = useAuth();
  const { getMatches } = useData();
  const navigate = useNavigate();
  const [minScore, setMinScore] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const matches = useMemo(() => {
    if (!profile) return [];
    return getMatches(profile.id);
  }, [profile, getMatches]);

  const filtered = useMemo(
    () => matches.filter(m => m.score >= minScore),
    [matches, minScore]
  );

  if (!user) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={<Sparkles size={28} />}
          title="Sign in to see your matches"
          description="Create a profile with your skills to discover students who are a great match for you."
          action={
            <div className="flex gap-3">
              <Link to="/auth/sign-up" className="btn-primary">Create account</Link>
              <Link to="/auth/login" className="btn-secondary">Sign in</Link>
            </div>
          }
        />
      </div>
    );
  }

  const noSkills =
    !profile ||
    profile.skills.filter(s => s.type === 'offer').length === 0 ||
    profile.skills.filter(s => s.type === 'need').length === 0;

  if (noSkills) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={<Sparkles size={28} />}
          title="Add skills to see matches"
          description="Tell us what you can offer and what you need. We will find students who are a great match."
          action={
            <Link to="/settings" className="btn-primary">
              Update your skills
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="section-title mb-1 flex items-center gap-2">
              <Sparkles size={24} className="text-indigo-500" />
              Your Matches
            </h1>
            <p className="section-subtitle">
              Students whose skills complement yours — based on what you offer and what you need.
            </p>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="btn-ghost text-sm gap-1.5"
          >
            <Info size={15} />
            How matching works
          </button>
        </div>
      </div>

      {/* How matching works */}
      {showInfo && (
        <div className="card p-5 mb-6 bg-indigo-50 border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-2">How the matching score works</h3>
          <p className="text-sm text-indigo-700 leading-relaxed">
            Your match score is based on skill overlap: +20 points for each skill they offer that you need, +20 points for each skill you offer that they need, and +30 bonus points for a strong reciprocal match where both sides cover each other's needs. The maximum score is 100. This is a heuristic to help you discover promising collaborators — it does not guarantee a successful exchange.
          </p>
        </div>
      )}

      {/* Current skills summary */}
      {profile && (
        <div className="card p-5 mb-6">
          <p className="text-sm font-medium text-stone-700 mb-3">Matching based on your skills</p>
          <div className="flex flex-wrap gap-3">
            <div>
              <p className="text-xs text-stone-400 mb-1.5">You offer</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.filter(s => s.type === 'offer').map(ps => (
                  <SkillTag key={ps.skill.id} skill={ps.skill} type="offer" />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-1.5">You need</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.filter(s => s.type === 'need').map(ps => (
                  <SkillTag key={ps.skill.id} skill={ps.skill} type="need" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4 mb-6">
        <p className="text-sm text-stone-500">
          {filtered.length} match{filtered.length !== 1 ? 'es' : ''} found
          {minScore > 0 && ` (score ≥ ${minScore})`}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Filter size={14} className="text-stone-400" />
          <label className="text-sm text-stone-600">Min score:</label>
          <select
            value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
            className="input py-1 w-24 text-sm"
          >
            <option value={0}>Any</option>
            <option value={40}>40+</option>
            <option value={60}>60+</option>
            <option value={80}>80+</option>
          </select>
        </div>
      </div>

      {/* Match cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={28} />}
          title="No matches yet"
          description="As more students join and add skills, your matches will appear here. Try lowering the minimum score or updating your skill profile."
          action={
            <Link to="/settings" className="btn-primary">Update your skills</Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(match => (
            <MatchCard key={match.profile.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match }: { match: MatchResult }) {
  const navigate = useNavigate();
  const { profile } = match;

  const scoreColor =
    match.score >= 80
      ? 'text-green-700 bg-green-50 ring-green-200'
      : match.score >= 60
      ? 'text-indigo-700 bg-indigo-50 ring-indigo-200'
      : 'text-stone-600 bg-stone-50 ring-stone-200';

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar src={profile.avatar_url} name={profile.display_name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/users/${profile.username}`}
                className="font-semibold text-stone-900 hover:text-indigo-600 transition-colors block"
              >
                {profile.display_name}
              </Link>
              <p className="text-xs text-stone-400">@{profile.username}</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${scoreColor} flex-shrink-0`}>
              {match.score}% match
            </span>
          </div>
          {profile.college && (
            <p className="text-xs text-stone-500 mt-1">{profile.college}{profile.city ? ` · ${profile.city}` : ''}</p>
          )}
        </div>
      </div>

      {/* Match explanation */}
      <div className="bg-stone-50 rounded-lg p-3">
        <p className="text-xs text-stone-600 leading-relaxed">{match.explanation}</p>
      </div>

      {/* Matched skills */}
      {match.matchedOfferings.length > 0 && (
        <div>
          <p className="text-xs font-medium text-stone-400 mb-1.5">They offer → you need</p>
          <div className="flex flex-wrap gap-1.5">
            {match.matchedOfferings.map(s => (
              <SkillTag key={s.id} skill={s} type="offer" />
            ))}
          </div>
        </div>
      )}
      {match.matchedNeeds.length > 0 && (
        <div>
          <p className="text-xs font-medium text-stone-400 mb-1.5">You offer → they need</p>
          <div className="flex flex-wrap gap-1.5">
            {match.matchedNeeds.map(s => (
              <SkillTag key={s.id} skill={s} type="need" />
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <p className="text-xs text-stone-400">
        Available {availabilityLabel(profile.availability).toLowerCase()}
      </p>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-stone-100">
        <Link
          to={`/users/${profile.username}`}
          className="btn-secondary flex-1 justify-center py-2 text-xs"
        >
          <User size={14} />
          View profile
        </Link>
        {match.listings.length > 0 && (
          <Link
            to={`/listings/${match.listings[0].id}`}
            className="btn-primary flex-1 justify-center py-2 text-xs"
          >
            <Send size={14} />
            Propose
          </Link>
        )}
      </div>
    </div>
  );
}
