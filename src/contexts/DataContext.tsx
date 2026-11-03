import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Listing,
  Proposal,
  Collaboration,
  Profile,
  Review,
  MatchResult,
  Skill,
} from '../types';
import {
  DEMO_LISTINGS,
  DEMO_PROFILES,
  DEMO_PROPOSALS,
  DEMO_COLLABORATIONS,
  DEMO_REVIEWS,
  DEMO_SKILLS,
} from '../data/demo';
import { useAuth } from './AuthContext';

interface DataContextType {
  listings: Listing[];
  profiles: Profile[];
  proposals: Proposal[];
  collaborations: Collaboration[];
  reviews: Review[];
  skills: Skill[];
  getMatches: (profileId: string) => MatchResult[];
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  addProposal: (proposal: Proposal) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  addCollaboration: (collab: Collaboration) => void;
  updateCollaboration: (id: string, updates: Partial<Collaboration>) => void;
  addReview: (review: Review) => void;
}

const DataContext = createContext<DataContextType | null>(null);

function computeMatchScore(viewer: Profile, candidate: Profile): MatchResult | null {
  const viewerNeedsIds = viewer.skills.filter(s => s.type === 'need').map(s => s.skill.id);
  const viewerOffersIds = viewer.skills.filter(s => s.type === 'offer').map(s => s.skill.id);
  const candidateOffersIds = candidate.skills.filter(s => s.type === 'offer').map(s => s.skill.id);
  const candidateNeedsIds = candidate.skills.filter(s => s.type === 'need').map(s => s.skill.id);

  const matchedOfferings = candidate.skills
    .filter(s => s.type === 'offer' && viewerNeedsIds.includes(s.skill.id))
    .map(s => s.skill);

  const matchedNeeds = candidate.skills
    .filter(s => s.type === 'need' && viewerOffersIds.includes(s.skill.id))
    .map(s => s.skill);

  if (matchedOfferings.length === 0 && matchedNeeds.length === 0) return null;

  const reciprocalBonus = matchedOfferings.length > 0 && matchedNeeds.length > 0 ? 30 : 0;
  const offerScore = matchedOfferings.length * 20;
  const needScore = matchedNeeds.length * 20;
  const score = Math.min(100, offerScore + needScore + reciprocalBonus);

  const explanationParts: string[] = [];
  if (matchedOfferings.length > 0) {
    explanationParts.push(
      `They offer ${matchedOfferings.map(s => s.name).join(', ')} which you need`
    );
  }
  if (matchedNeeds.length > 0) {
    explanationParts.push(
      `You offer ${matchedNeeds.map(s => s.name).join(', ')} which they need`
    );
  }
  if (reciprocalBonus > 0) {
    explanationParts.push('Strong reciprocal match');
  }

  return {
    profile: candidate,
    score,
    matchedOfferings,
    matchedNeeds,
    explanation: explanationParts.join('. ') + '.',
    listings: [],
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();

  const [listings, setListings] = useState<Listing[]>(() => {
    const stored = localStorage.getItem('skillswap_listings');
    return stored ? [...DEMO_LISTINGS, ...JSON.parse(stored)] : DEMO_LISTINGS;
  });

  const [profiles] = useState<Profile[]>(DEMO_PROFILES);

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const stored = localStorage.getItem('skillswap_proposals');
    return stored ? [...DEMO_PROPOSALS, ...JSON.parse(stored)] : DEMO_PROPOSALS;
  });

  const [collaborations, setCollaborations] = useState<Collaboration[]>(() => {
    const stored = localStorage.getItem('skillswap_collaborations');
    return stored ? [...DEMO_COLLABORATIONS, ...JSON.parse(stored)] : DEMO_COLLABORATIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const stored = localStorage.getItem('skillswap_reviews');
    return stored ? [...DEMO_REVIEWS, ...JSON.parse(stored)] : DEMO_REVIEWS;
  });

  const [skills] = useState<Skill[]>(DEMO_SKILLS);

  // Persist user-created data
  useEffect(() => {
    const userListings = listings.filter(l => !l.is_demo);
    localStorage.setItem('skillswap_listings', JSON.stringify(userListings));
  }, [listings]);

  useEffect(() => {
    const userProposals = proposals.filter(p => !DEMO_PROPOSALS.find(dp => dp.id === p.id));
    localStorage.setItem('skillswap_proposals', JSON.stringify(userProposals));
  }, [proposals]);

  useEffect(() => {
    const userCollabs = collaborations.filter(c => !DEMO_COLLABORATIONS.find(dc => dc.id === c.id));
    localStorage.setItem('skillswap_collaborations', JSON.stringify(userCollabs));
  }, [collaborations]);

  useEffect(() => {
    const userReviews = reviews.filter(r => !DEMO_REVIEWS.find(dr => dr.id === r.id));
    localStorage.setItem('skillswap_reviews', JSON.stringify(userReviews));
  }, [reviews]);

  const getMatches = (profileId: string): MatchResult[] => {
    const viewer = profiles.find(p => p.id === profileId) || profile;
    if (!viewer) return [];

    const results: MatchResult[] = [];
    for (const candidate of profiles) {
      if (candidate.id === profileId) continue;
      const match = computeMatchScore(viewer, candidate);
      if (match) {
        // Attach relevant listings
        match.listings = listings.filter(
          l => l.owner_id === candidate.id && l.status === 'open'
        );
        results.push(match);
      }
    }

    return results.sort((a, b) => b.score - a.score);
  };

  const addListing = (listing: Listing) => {
    setListings(prev => [listing, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const addProposal = (proposal: Proposal) => {
    setProposals(prev => [proposal, ...prev]);
  };

  const updateProposal = (id: string, updates: Partial<Proposal>) => {
    setProposals(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));

    // If accepted, create collaboration
    if (updates.status === 'accepted') {
      const proposal = proposals.find(p => p.id === id);
      if (proposal) {
        const collab: Collaboration = {
          id: `collab-${Date.now()}`,
          proposal_id: proposal.id,
          proposal,
          participant_a_id: proposal.sender_id,
          participant_b_id: proposal.receiver_id,
          participant_a: proposal.sender,
          participant_b: proposal.receiver,
          agreed_scope: `${proposal.sender?.display_name} will provide: ${proposal.sender_deliverables}. ${proposal.receiver?.display_name} will provide: ${proposal.receiver_deliverables}.`,
          status: 'active',
          start_date: new Date().toISOString(),
          target_date: proposal.target_date,
          participant_a_completed: false,
          participant_b_completed: false,
          milestones: proposal.milestones.map((m, i) => ({
            id: `ms-${Date.now()}-${i}`,
            collaboration_id: `collab-${Date.now()}`,
            title: m.title,
            description: m.description,
            due_date: m.due_date,
            status: 'pending' as const,
          })),
          created_at: new Date().toISOString(),
        };
        addCollaboration(collab);
      }
    }
  };

  const addCollaboration = (collab: Collaboration) => {
    setCollaborations(prev => [collab, ...prev]);
  };

  const updateCollaboration = (id: string, updates: Partial<Collaboration>) => {
    setCollaborations(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
  };

  return (
    <DataContext.Provider
      value={{
        listings,
        profiles,
        proposals,
        collaborations,
        reviews,
        skills,
        getMatches,
        addListing,
        updateListing,
        deleteListing,
        addProposal,
        updateProposal,
        addCollaboration,
        updateCollaboration,
        addReview,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
