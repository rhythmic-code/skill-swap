-- SkillSwap Database Schema
-- Run this in your Supabase SQL editor or as a migration

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  college text,
  city text,
  bio text,
  avatar_url text,
  portfolio_url text,
  linkedin_url text,
  availability text not null default 'flexible',
  collaboration_types text[] default '{}',
  course text,
  graduation_year integer,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ─── Skills ──────────────────────────────────────────────────────────────────
create table public.skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  created_at timestamptz default now()
);

alter table public.skills enable row level security;
create policy "Skills are viewable by everyone" on public.skills for select using (true);
create policy "Authenticated users can insert skills" on public.skills for insert with check (auth.role() = 'authenticated');

-- ─── Profile Skills ───────────────────────────────────────────────────────────
create table public.profile_skills (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles on delete cascade not null,
  skill_id uuid references public.skills on delete cascade not null,
  skill_type text not null check (skill_type in ('offer', 'need')),
  proficiency text check (proficiency in ('beginner', 'intermediate', 'advanced', 'expert')),
  unique (profile_id, skill_id, skill_type)
);

alter table public.profile_skills enable row level security;
create policy "Profile skills are viewable by everyone" on public.profile_skills for select using (true);
create policy "Users manage their own profile skills"
  on public.profile_skills for all using (
    auth.uid() = profile_id
  );

-- ─── Listings ────────────────────────────────────────────────────────────────
create table public.listings (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles on delete cascade not null,
  listing_type text not null check (listing_type in ('offer', 'request')),
  title text not null,
  description text not null,
  category text not null,
  deliverables text not null,
  estimated_effort text not null,
  availability text not null,
  city text,
  status text not null default 'open' check (status in ('open', 'paused', 'completed')),
  portfolio_url text,
  collaboration_type text not null default 'skill-barter',
  project_stage text,
  is_demo boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.listings enable row level security;
create policy "Listings are viewable by everyone" on public.listings for select using (true);
create policy "Users can insert their own listings"
  on public.listings for insert with check (auth.uid() = owner_id);
create policy "Users can update their own listings"
  on public.listings for update using (auth.uid() = owner_id);
create policy "Users can delete their own listings"
  on public.listings for delete using (auth.uid() = owner_id);

-- ─── Listing Skills ───────────────────────────────────────────────────────────
create table public.listing_skills (
  listing_id uuid references public.listings on delete cascade not null,
  skill_id uuid references public.skills on delete cascade not null,
  requirement_type text not null check (requirement_type in ('offer', 'need')),
  primary key (listing_id, skill_id, requirement_type)
);

alter table public.listing_skills enable row level security;
create policy "Listing skills are viewable by everyone" on public.listing_skills for select using (true);
create policy "Listing owners manage listing skills"
  on public.listing_skills for all using (
    exists (select 1 from public.listings where id = listing_id and owner_id = auth.uid())
  );

-- ─── Proposals ───────────────────────────────────────────────────────────────
create table public.proposals (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references public.profiles on delete cascade not null,
  receiver_id uuid references public.profiles on delete cascade not null,
  listing_id uuid references public.listings on delete set null,
  offer_description text not null,
  requested_deliverables text not null,
  sender_deliverables text not null,
  receiver_deliverables text not null,
  milestones jsonb default '[]',
  estimated_hours integer,
  start_date date,
  target_date date,
  notes text,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'declined', 'in-progress', 'completed', 'cancelled', 'disputed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint no_self_proposal check (sender_id != receiver_id)
);

alter table public.proposals enable row level security;

create policy "Participants can view proposals"
  on public.proposals for select using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );

create policy "Senders can create proposals"
  on public.proposals for insert with check (auth.uid() = sender_id);

create policy "Receiver can update status (accept/decline)"
  on public.proposals for update using (
    auth.uid() = sender_id or auth.uid() = receiver_id
  );

-- ─── Collaborations ───────────────────────────────────────────────────────────
create table public.collaborations (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid references public.proposals on delete set null,
  participant_a_id uuid references public.profiles on delete cascade not null,
  participant_b_id uuid references public.profiles on delete cascade not null,
  agreed_scope text not null,
  status text not null default 'active' check (
    status in ('active', 'completed', 'cancelled', 'disputed')
  ),
  start_date date not null default current_date,
  target_date date,
  participant_a_completed boolean default false,
  participant_b_completed boolean default false,
  milestones jsonb default '[]',
  created_at timestamptz not null default now()
);

alter table public.collaborations enable row level security;

create policy "Participants can view collaborations"
  on public.collaborations for select using (
    auth.uid() = participant_a_id or auth.uid() = participant_b_id
  );

create policy "Participants can update collaborations"
  on public.collaborations for update using (
    auth.uid() = participant_a_id or auth.uid() = participant_b_id
  );

-- ─── Reviews ─────────────────────────────────────────────────────────────────
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  collaboration_id uuid references public.collaborations on delete cascade not null,
  reviewer_id uuid references public.profiles on delete cascade not null,
  reviewee_id uuid references public.profiles on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now(),
  unique (collaboration_id, reviewer_id)  -- one review per collaboration per reviewer
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Only participants in a completed collaboration can review"
  on public.reviews for insert with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from public.collaborations c
      where c.id = collaboration_id
        and c.status = 'completed'
        and (c.participant_a_id = auth.uid() or c.participant_b_id = auth.uid())
    )
  );

-- ─── Reports ─────────────────────────────────────────────────────────────────
create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references public.profiles on delete set null,
  target_type text not null check (target_type in ('profile', 'listing', 'collaboration')),
  target_id uuid not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;
create policy "Users can create reports"
  on public.reports for insert with check (auth.uid() = reporter_id);
create policy "Reporters can view their own reports"
  on public.reports for select using (auth.uid() = reporter_id);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index idx_listings_owner on public.listings(owner_id);
create index idx_listings_status on public.listings(status);
create index idx_listings_category on public.listings(category);
create index idx_profile_skills_profile on public.profile_skills(profile_id);
create index idx_proposals_sender on public.proposals(sender_id);
create index idx_proposals_receiver on public.proposals(receiver_id);
create index idx_collaborations_a on public.collaborations(participant_a_id);
create index idx_collaborations_b on public.collaborations(participant_b_id);
create index idx_reviews_reviewee on public.reviews(reviewee_id);
