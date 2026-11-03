import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, FlaskConical } from 'lucide-react';
import type { Listing } from '../types';
import { Avatar } from './ui/Avatar';
import { Badge, statusToBadge, statusLabel } from './ui/Badge';
import { SkillTag } from './ui/SkillTag';
import { availabilityLabel, truncate } from '../lib/utils';

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

export function ListingCard({ listing, compact = false }: ListingCardProps) {
  const owner = listing.owner;
  const isOffer = listing.listing_type === 'offer';

  return (
    <article className="listing-card">
      {/* Type + status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            background: isOffer ? 'oklch(95% 0.025 30)' : 'oklch(96% 0.022 68)',
            color: isOffer ? 'oklch(38% 0.12 32)' : 'oklch(42% 0.09 55)',
            border: isOffer ? '1px solid oklch(86% 0.05 35)' : '1px solid oklch(87% 0.04 60)',
          }}
        >
          {isOffer ? 'Offering' : 'Requesting'}
        </span>
        <Badge variant={statusToBadge(listing.status)}>{statusLabel(listing.status)}</Badge>
        {listing.is_demo && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 'var(--text-xs)',
              color: 'var(--color-muted)',
            }}
          >
            <FlaskConical size={11} aria-hidden="true" />Demo
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 'var(--text-title)', fontWeight: 600, lineHeight: 1.25, marginBottom: 'var(--space-sm)' }}>
        <Link
          to={`/listings/${listing.id}`}
          style={{ color: 'var(--color-ink)', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.textDecorationLine = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecorationLine = 'none')}
        >
          {listing.title}
        </Link>
      </h3>

      {/* Description */}
      {!compact && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
          {truncate(listing.description, 130)}
        </p>
      )}

      {/* Skills offered */}
      <div style={{ marginBottom: 'var(--space-sm)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 'var(--space-2xs)', fontWeight: 500 }}>
          {isOffer ? 'Offering' : 'Can offer in return'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2xs)' }}>
          {listing.skills_offered.slice(0, 3).map(skill => (
            <SkillTag key={skill.id} skill={skill} type="offer" />
          ))}
          {listing.skills_offered.length > 3 && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', alignSelf: 'center' }}>
              +{listing.skills_offered.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Skills needed */}
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 'var(--space-2xs)', fontWeight: 500 }}>
          {isOffer ? 'In exchange for' : 'Needs help with'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2xs)' }}>
          {listing.skills_needed.slice(0, 3).map(skill => (
            <SkillTag key={skill.id} skill={skill} type="need" />
          ))}
          {listing.skills_needed.length > 3 && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', alignSelf: 'center' }}>
              +{listing.skills_needed.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Meta */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          flexWrap: 'wrap',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-muted)',
          marginBottom: 'var(--space-md)',
        }}
      >
        {listing.city && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)' }}>
            <MapPin size={11} aria-hidden="true" />{listing.city}
          </span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xs)' }}>
          <Clock size={11} aria-hidden="true" />{availabilityLabel(listing.availability)}
        </span>
        <span style={{ color: 'var(--color-rule-2)' }}>·</span>
        <span>{listing.estimated_effort}</span>
      </div>

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--color-rule)',
          paddingTop: 'var(--space-sm)',
        }}
      >
        {owner ? (
          <Link
            to={`/users/${owner.username}`}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', textDecoration: 'none' }}
          >
            <Avatar src={owner.avatar_url} name={owner.display_name} size="sm" />
            <div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-ink)', margin: 0 }}>
                {owner.display_name}
              </p>
              {owner.college && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {owner.college}
                </p>
              )}
            </div>
          </Link>
        ) : <div />}
        <Link
          to={`/listings/${listing.id}`}
          className="btn btn-ghost btn--sm"
          style={{ gap: 'var(--space-2xs)' }}
        >
          View <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
