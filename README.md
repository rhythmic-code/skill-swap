# SkillSwap MVP

**Your skills are currency. Build more, together.**

A barter marketplace for college students to exchange skills and collaborate on real projects — without money.

---

## Quick Start (Demo Mode)

No configuration needed. Demo mode uses realistic seed data so you can explore every feature immediately.

```bash
cd skillswap
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click **"Try demo first"** to enter demo mode instantly.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Auth & DB | Supabase (optional — demo mode works without it) |
| State | React Context + localStorage persistence |

---

## Project Structure

```
src/
├── App.tsx                    # Router and providers
├── main.tsx                   # Entry point
├── index.css                  # Tailwind + design tokens
├── types/index.ts             # All TypeScript types
├── lib/
│   ├── supabase.ts            # Supabase client + demo mode flag
│   └── utils.ts               # Formatting helpers
├── data/
│   └── demo.ts                # 12 profiles, 15 listings, proposals, collaborations
├── contexts/
│   ├── AuthContext.tsx         # Auth state + demo user management
│   └── DataContext.tsx         # Data + matching engine
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── ui/
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Modal.tsx
│   │   ├── SkillTag.tsx
│   │   └── Toast.tsx
│   └── ListingCard.tsx
└── pages/
    ├── Landing.tsx            # / — Marketing homepage
    ├── auth/
    │   ├── Login.tsx          # /auth/login
    │   └── SignUp.tsx         # /auth/sign-up
    ├── Discover.tsx           # /discover — Browse all listings
    ├── Matches.tsx            # /matches — Personalized matches
    ├── ListingDetail.tsx      # /listings/:id
    ├── UserProfile.tsx        # /users/:username
    ├── CreateListing.tsx      # /create/offer, /create/request
    ├── Proposals.tsx          # /proposals
    ├── Collaborations.tsx     # /collaborations
    ├── CollaborationDetail.tsx # /collaborations/:id
    └── Settings.tsx           # /settings
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth/sign-up` | Registration |
| `/auth/login` | Login |
| `/discover` | Browse all listings (search + filter) |
| `/matches` | Personalized skill matches |
| `/listings/:id` | Listing detail + proposal form |
| `/users/:username` | Public student profile |
| `/create/offer` | Create a skill offer |
| `/create/request` | Create a project request |
| `/proposals` | Incoming and outgoing proposals |
| `/collaborations` | Active and completed exchanges |
| `/collaborations/:id` | Milestone tracking + reviews |
| `/settings` | Profile and skill editing |

---

## Demo Mode

Demo mode is active when:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are empty, OR
- `VITE_DEMO_MODE=true` is set

In demo mode:
- All 12 fictional student profiles are available
- 15 listings, proposals, and collaborations are pre-loaded
- User actions (proposals, reviews) persist in `localStorage` during the session
- The demo identity is Alex Rivera (`demo-1`)
- Data is clearly labelled as demo content throughout the UI

Demo users are fictional characters created for this MVP. They are not real students.

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | For production | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | For production | Your Supabase anonymous key |
| `VITE_DEMO_MODE` | Optional | Force demo mode (`true` / `false`) |
| `VITE_APP_URL` | Optional | App base URL for links |

---

## Supabase Setup (Production)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration in **Supabase SQL Editor**:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Copy your project URL and anon key to `.env`
4. Enable email auth in Supabase → Authentication → Providers
5. Optionally configure email templates for password reset

---

## Deployment (Vercel)

```bash
npm run build
```

Then deploy the `dist/` folder to Vercel, Netlify, or any static host.

Set environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Demo Walkthrough

1. Open the app at `localhost:5173`
2. Click **"Try demo first"** on the landing page — you are now Alex Rivera
3. Go to **Discover** — browse 15 real skill offers and project requests
4. Go to **Matches** — see your reciprocal skill matches scored 0–100
5. Click on **Priya Sharma's React dev request** → Send a proposal
6. Go to **Proposals** — you have an incoming proposal from Priya; accept it
7. Go to **Collaborations** — see the active collaboration with milestones
8. Open the collaboration → check off milestones → confirm completion
9. Leave a review after both sides confirm

---

## Matching Algorithm

The matching score is a simple heuristic:

```
score = (skills_they_offer ∩ skills_you_need) × 20
      + (skills_you_offer ∩ skills_they_need) × 20
      + (reciprocal_bonus if both sides cover each other) × 30
      capped at 100
```

This is not AI-powered and does not guarantee compatibility. It surfaces likely matches for human review.

---

## Analytics Events

Track these in your analytics tool of choice (e.g. PostHog, Plausible):

| Event | Metric |
|-------|--------|
| `signup_completed` | Registration rate |
| `onboarding_completed` | Activation rate |
| `listing_created` | Offer/request creation rate |
| `match_viewed` | Match engagement rate |
| `proposal_sent` | Match-to-proposal conversion |
| `proposal_accepted` | Proposal acceptance rate |
| `collaboration_started` | Collaboration start rate |
| `milestone_completed` | Progress rate |
| `collaboration_completed` | Completion rate |
| `review_submitted` | Trust signal rate |

---

## Known Limitations

1. **No real-time messaging** — Proposals serve as the communication channel for MVP. A thread-based messaging layer can be added on top of Supabase Realtime.
2. **Local state in demo mode** — User actions persist in `localStorage` (session-scoped). No server persistence without Supabase.
3. **No email notifications** — Proposal acceptance and milestone updates happen silently. Supabase Edge Functions + Resend can cover this.
4. **No image uploads** — Avatar URLs use DiceBear for demo profiles. Real uploads need Supabase Storage configured.
5. **Matching is local only** — With Supabase, the matching query should move server-side for performance at scale.

---

## Three Highest-Priority Improvements After Launch

1. **In-app messaging** — A simple threaded conversation per proposal is the highest-friction gap. Students need to negotiate scope before agreeing. Supabase Realtime makes this straightforward.
2. **Email notifications** — Proposal received, accepted, milestone due. Without these, the platform is invisible between sessions. Implement with Supabase Edge Functions + Resend or Postmark.
3. **Profile verification** — A `.edu` email domain check builds trust quickly without manual verification overhead. Supabase auth handles this with a custom email allowlist.
