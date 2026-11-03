// ─── Core Domain Types ───────────────────────────────────────────────────────

export type AvailabilityType =
  | 'full-time'
  | 'part-time'
  | 'weekends'
  | 'evenings'
  | 'flexible'
  | 'limited';

export type CollaborationType =
  | 'skill-barter'
  | 'project-collaboration'
  | 'startup-team'
  | 'portfolio-building'
  | 'open-to-discuss';

export type SkillType = 'offer' | 'need';

export type ListingType = 'offer' | 'request';

export type ListingStatus = 'open' | 'paused' | 'completed';

export type ProposalStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type CollaborationStatus =
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type MilestoneStatus = 'pending' | 'in-progress' | 'completed';

export type ProjectStage =
  | 'idea'
  | 'prototype'
  | 'mvp'
  | 'launched'
  | 'scaling';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export type SkillCategory =
  | 'Web Development'
  | 'Mobile Development'
  | 'AI/ML & Automation'
  | 'UI/UX Design'
  | 'Graphic Design & Branding'
  | 'Digital Marketing'
  | 'Social Media Management'
  | 'Content Writing & Copywriting'
  | 'Video Editing'
  | 'Photography'
  | 'Business Research'
  | 'Market Research'
  | 'Pitch Decks & Presentations'
  | 'SEO'
  | 'No-Code Development'
  | 'Other';

export interface ProfileSkill {
  skill: Skill;
  type: SkillType;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  college?: string;
  city?: string;
  bio?: string;
  avatar_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  availability: AvailabilityType;
  collaboration_types: CollaborationType[];
  course?: string;
  graduation_year?: number;
  skills: ProfileSkill[];
  created_at: string;
  is_demo?: boolean;
}

export interface Listing {
  id: string;
  owner_id: string;
  owner?: Profile;
  listing_type: ListingType;
  title: string;
  description: string;
  category: SkillCategory;
  deliverables: string;
  estimated_effort: string;
  availability: AvailabilityType;
  city?: string;
  status: ListingStatus;
  skills_offered: Skill[];
  skills_needed: Skill[];
  portfolio_url?: string;
  collaboration_type: CollaborationType;
  project_stage?: ProjectStage;
  created_at: string;
  updated_at: string;
  is_demo?: boolean;
}

export interface Proposal {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string;
  sender?: Profile;
  receiver?: Profile;
  listing?: Listing;
  offer_description: string;
  requested_deliverables: string;
  sender_deliverables: string;
  receiver_deliverables: string;
  milestones: ProposalMilestone[];
  estimated_hours: number;
  start_date?: string;
  target_date?: string;
  notes?: string;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
}

export interface ProposalMilestone {
  title: string;
  description?: string;
  due_date?: string;
}

export interface Collaboration {
  id: string;
  proposal_id: string;
  proposal?: Proposal;
  participant_a_id: string;
  participant_b_id: string;
  participant_a?: Profile;
  participant_b?: Profile;
  agreed_scope: string;
  status: CollaborationStatus;
  start_date: string;
  target_date?: string;
  participant_a_completed: boolean;
  participant_b_completed: boolean;
  milestones: Milestone[];
  reviews?: Review[];
  created_at: string;
}

export interface Milestone {
  id: string;
  collaboration_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: MilestoneStatus;
  completed_by_a_at?: string;
  completed_by_b_at?: string;
}

export interface Review {
  id: string;
  collaboration_id: string;
  reviewer_id: string;
  reviewee_id: string;
  reviewer?: Profile;
  reviewee?: Profile;
  rating: number;
  comment: string;
  created_at: string;
}

export interface MatchResult {
  profile: Profile;
  score: number;
  matchedOfferings: Skill[];   // what they offer that you need
  matchedNeeds: Skill[];       // what you offer that they need
  explanation: string;
  listings: Listing[];
}

export interface User {
  id: string;
  email: string;
  profile?: Profile;
}
