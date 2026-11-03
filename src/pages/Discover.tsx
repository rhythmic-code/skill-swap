import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Plus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { ListingCard } from '../components/ListingCard';
import { EmptyState } from '../components/ui/EmptyState';
import { SKILL_CATEGORIES } from '../data/demo';
import type { ListingType, AvailabilityType } from '../types';

export function Discover() {
  const { listings } = useData();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState<ListingType | ''>((searchParams.get('type') as ListingType) || '');
  const [availability, setAvailability] = useState<AvailabilityType | ''>((searchParams.get('availability') as AvailabilityType) || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return listings.filter(l => {
      if (l.status !== 'open') return false;
      if (type && l.listing_type !== type) return false;
      if (category && l.category !== category) return false;
      if (availability && l.availability !== availability) return false;
      if (city && !l.city?.toLowerCase().includes(city.toLowerCase())) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!l.title.toLowerCase().includes(q) &&
            !l.description.toLowerCase().includes(q) &&
            !l.skills_offered.some(s => s.name.toLowerCase().includes(q)) &&
            !l.skills_needed.some(s => s.name.toLowerCase().includes(q)) &&
            !l.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [listings, query, category, type, availability, city]);

  const offers = filtered.filter(l => l.listing_type === 'offer');
  const requests = filtered.filter(l => l.listing_type === 'request');

  const clearFilters = () => { setQuery(''); setCategory(''); setType(''); setAvailability(''); setCity(''); };
  const hasFilters = query || category || type || availability || city;

  return (
    <div className="page-container" style={{ paddingBlock: 'var(--space-3xl)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">Discover</h1>
        <p className="section-subtitle">Browse skill offers and project requests from students.</p>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search
            size={15}
            aria-hidden="true"
            style={{ position: 'absolute', left: 'var(--space-md)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', pointerEvents: 'none' }}
          />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search skills, projects, keywords…"
            className="input"
            style={{ paddingLeft: 'calc(var(--space-md) + 22px)' }}
            aria-label="Search listings"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ position: 'absolute', right: 'var(--space-md)', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 0, display: 'flex' }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn btn-secondary btn--sm`}
          style={{ gap: 'var(--space-xs)', background: showFilters ? 'oklch(95% 0.025 30)' : undefined, color: showFilters ? 'oklch(38% 0.12 32)' : undefined }}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          Filters
          {hasFilters && (
            <span
              style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'var(--color-board)', color: 'var(--color-board-type)',
                fontSize: 'var(--text-xs)', fontFamily: 'var(--font-outlier)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {[query, category, type, availability, city].filter(Boolean).length}
            </span>
          )}
        </button>
        <Link to="/create/offer" className="btn btn-primary btn--sm">
          <Plus size={14} aria-hidden="true" />
          Create listing
        </Link>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div
          className="tex-cotton"
          style={{
            borderRadius: 'var(--radius-card)',
            padding: 'var(--space-lg)',
            boxShadow: 'var(--edge-stock), var(--cast-stock)',
            marginBottom: 'var(--space-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 'var(--space-md)',
          }}
        >
          <div>
            <label className="label">Type</label>
            <select value={type} onChange={e => setType(e.target.value as ListingType | '')} className="input">
              <option value="">All listings</option>
              <option value="offer">Skill offers</option>
              <option value="request">Project requests</option>
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input">
              <option value="">All categories</option>
              {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Availability</label>
            <select value={availability} onChange={e => setAvailability(e.target.value as AvailabilityType | '')} className="input">
              <option value="">Any availability</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="evenings">Evenings</option>
              <option value="weekends">Weekends</option>
              <option value="flexible">Flexible</option>
              <option value="limited">Limited</option>
            </select>
          </div>
          <div>
            <label className="label">City</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. New York" className="input" />
          </div>
          {hasFilters && (
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={clearFilters} className="btn btn-ghost btn--sm">
                <X size={13} aria-hidden="true" /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results summary + type filter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
          {filtered.length === 0 ? 'No listings found' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''}`}
        </p>
        <div className="tab-strip">
          <button
            className={`tab-strip__tab${type === '' ? ' tab-strip__tab--active' : ''}`}
            onClick={() => setType('')}
          >
            All ({filtered.length})
          </button>
          <button
            className={`tab-strip__tab${type === 'offer' ? ' tab-strip__tab--active' : ''}`}
            onClick={() => setType(type === 'offer' ? '' : 'offer')}
          >
            Offers ({offers.length})
          </button>
          <button
            className={`tab-strip__tab${type === 'request' ? ' tab-strip__tab--active' : ''}`}
            onClick={() => setType(type === 'request' ? '' : 'request')}
          >
            Requests ({requests.length})
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={24} />}
          title="No listings found"
          description="Try adjusting your search or filters, or post the first listing in this area."
          action={
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              {hasFilters && <button onClick={clearFilters} className="btn btn-secondary">Clear filters</button>}
              <Link to="/create/offer" className="btn btn-primary">
                <Plus size={15} aria-hidden="true" /> Post a listing
              </Link>
            </div>
          }
        />
      ) : (
        <div className="grid-cols-cards">
          {filtered.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
