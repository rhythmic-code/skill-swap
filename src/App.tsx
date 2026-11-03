import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './components/ui/Toast';
import { Layout, AppLayout } from './components/layout/Layout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { Discover } from './pages/Discover';
import { Matches } from './pages/Matches';
import { ListingDetail } from './pages/ListingDetail';
import { UserProfile } from './pages/UserProfile';
import { CreateListing } from './pages/CreateListing';
import { Proposals } from './pages/Proposals';
import { Collaborations } from './pages/Collaborations';
import { CollaborationDetail } from './pages/CollaborationDetail';
import { Settings } from './pages/Settings';

// Simple placeholder for static pages
function StaticPage({ title, content }: { title: string; content: string }) {
  return (
    <div className="page-container py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-stone-900 mb-6">{title}</h1>
      <div className="prose prose-stone max-w-none">
        <p className="text-stone-600 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Marketing / auth — no app shell */}
              <Route element={<Layout />}>
                <Route path="/" element={<Landing />} />
              </Route>

              {/* Auth pages — no nav chrome */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/sign-up" element={<SignUp />} />

              {/* App pages — with nav */}
              <Route element={<AppLayout />}>
                <Route path="/discover" element={<Discover />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/listings/:id" element={<ListingDetail />} />
                <Route path="/users/:username" element={<UserProfile />} />
                <Route path="/create/offer" element={<CreateListing defaultType="offer" />} />
                <Route path="/create/request" element={<CreateListing defaultType="request" />} />
                <Route path="/proposals" element={<Proposals />} />
                <Route path="/collaborations" element={<Collaborations />} />
                <Route path="/collaborations/:id" element={<CollaborationDetail />} />
                <Route path="/settings" element={<Settings />} />

                {/* Static pages */}
                <Route path="/about" element={<StaticPage title="About SkillSwap" content="SkillSwap is a student barter marketplace built to help college students exchange skills and collaborate on real projects without needing money. It was built as an MVP to prove the core concept: students can find, propose, and complete skill exchanges in a structured, trust-building way." />} />
                <Route path="/guidelines" element={<StaticPage title="Community Guidelines" content="Be respectful and honest. Only propose exchanges you genuinely intend to complete. Describe your skills accurately — do not overstate your experience. Communicate proactively if you need to adjust scope or timeline. Do not spam, harass, or misuse the platform. SkillSwap reserves the right to remove profiles and listings that violate these guidelines." />} />
                <Route path="/privacy" element={<StaticPage title="Privacy Policy" content="SkillSwap collects only the information needed to match students and facilitate collaborations. Your profile information is public within the platform. We do not sell your data. We store only what you provide. This is an MVP — do not share sensitive financial or personal information beyond what is needed for a collaboration." />} />
                <Route path="/terms" element={<StaticPage title="Terms of Use" content="SkillSwap is a coordination platform. It does not guarantee that exchanges will be completed or that deliverables will meet your expectations. All arrangements are between participating students. SkillSwap is not liable for any work delivered or not delivered through the platform. Use it at your own discretion." />} />
                <Route path="/faq" element={<Navigate to="/#faq" replace />} />
                <Route path="/contact" element={<StaticPage title="Contact" content="SkillSwap is an MVP. For questions or feedback, email hello@skillswap.app. We read every message. Response times may vary." />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
