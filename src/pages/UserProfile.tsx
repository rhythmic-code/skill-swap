import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  GraduationCap,
  ExternalLink,
  Clock,
  Star,
  FlaskConical,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { DEMO_PROFILES } from '../data/demo';
import { Avatar } from '../components/ui/Avatar';
import { SkillTag } from '../components/ui/SkillTag';
import { ListingCard } from '../components/ListingCard';
import { Badge } from '../components/ui/Badge';
import { availabilityLabel, collaborationLabel } from '../lib/utils';

export function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const { listings, reviews } = useData();

  // Search demo profiles and data store
  const profile = DEMO_PROFILES.find(p => p.username === username);

  if (!profile) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-stone-500">Profile not found.</p>
        <Link to="/discover" className="btn-primary mt-4">Back to Discover</Link>
      </div>
    );
  }

  const userListings = listings.filter(
    l => l.owner_id === profile.id && l.status === 'open'
  );

  const userReviews = reviews.filter(r => r.reviewee_id === profile.id);

  const averageRating =
    userReviews.length > 0
      ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
      : null;

  const offeredSkills = profile.skills.filter(s => s.type === 'offer');
  const neededSkills = profile.skills.filter(s => s.type === 'need');

  return (
    <div className="page-container py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-5">
          {/* Profile card */}
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <Avatar src={profile.avatar_url} name={profile.display_name} size="xl" />
            </div>
            <h1 className="text-xl font-bold text-stone-900">{profile.display_name}</h1>
            <p className="text-stone-400 text-sm">@{profile.username}</p>

            {profile.is_demo && (
              <div className="mt-3 flex justify-center">
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                  <FlaskConical size={11} />
                  Demo profile
                </span>
              </div>
            )}

            {averageRating && (
              <div className="flex items-center justify-center gap-1 mt-3">
                <Star size={15} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-stone-700">{averageRating}</span>
                <span className="text-xs text-stone-400">({userReviews.length} reviews)</span>
              </div>
            )}

            <div className="mt-4 space-y-2 text-sm text-stone-600">
              {profile.college && (
                <div className="flex items-center justify-center gap-1.5">
                  <GraduationCap size={15} className="text-stone-400" />
                  {profile.college}
                </div>
              )}
              {profile.city && (
                <div className="flex items-center justify-center gap-1.5">
                  <MapPin size={15} className="text-stone-400" />
                  {profile.city}
                </div>
              )}
              <div className="flex items-center justify-center gap-1.5">
                <Clock size={15} className="text-stone-400" />
                {availabilityLabel(profile.availability)}
              </div>
            </div>

            {profile.bio && (
              <p className="mt-4 text-sm text-stone-500 leading-relaxed text-left">
                {profile.bio}
              </p>
            )}

            {profile.portfolio_url && (
              <a
                href={profile.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center mt-5 text-sm"
              >
                <ExternalLink size={14} />
                Portfolio
              </a>
            )}
          </div>

          {/* Skills */}
          <div className="card p-5">
            <h2 className="font-semibold text-stone-900 mb-4">Skills</h2>
            {offeredSkills.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Offering</p>
                <div className="flex flex-wrap gap-1.5">
                  {offeredSkills.map(ps => (
                    <SkillTag key={ps.skill.id} skill={ps.skill} type="offer" />
                  ))}
                </div>
              </div>
            )}
            {neededSkills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Looking for</p>
                <div className="flex flex-wrap gap-1.5">
                  {neededSkills.map(ps => (
                    <SkillTag key={ps.skill.id} skill={ps.skill} type="need" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Collaboration types */}
          <div className="card p-5">
            <h2 className="font-semibold text-stone-900 mb-3">Open to</h2>
            <div className="flex flex-wrap gap-1.5">
              {profile.collaboration_types.map(ct => (
                <Badge key={ct} variant="inprogress">
                  {collaborationLabel(ct)}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active listings */}
          <div>
            <h2 className="font-semibold text-stone-900 mb-4">
              Active listings ({userListings.length})
            </h2>
            {userListings.length === 0 ? (
              <div className="card p-8 text-center text-stone-400 text-sm">
                No active listings
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {userListings.map(l => (
                  <ListingCard key={l.id} listing={l} compact />
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          {userReviews.length > 0 && (
            <div>
              <h2 className="font-semibold text-stone-900 mb-4">
                Reviews ({userReviews.length})
              </h2>
              <div className="space-y-4">
                {userReviews.map(review => (
                  <div key={review.id} className="card p-5">
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={review.reviewer?.avatar_url}
                        name={review.reviewer?.display_name || 'User'}
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-stone-900">
                            {review.reviewer?.display_name}
                          </p>
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star
                                key={s}
                                size={13}
                                className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-stone-600 mt-2 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
