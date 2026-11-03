import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import type { User, Profile } from '../types';
import { DEMO_PROFILES } from '../data/demo';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  demoUser: Profile | null;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  enterDemoMode: (profileId?: string) => void;
  exitDemoMode: () => void;
  updateProfile: (updates: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoUser, setDemoUser] = useState<Profile | null>(null);

  useEffect(() => {
    // Check for stored demo session
    const storedDemo = sessionStorage.getItem('skillswap_demo_user');
    if (storedDemo) {
      try {
        const parsed = JSON.parse(storedDemo);
        setDemoUser(parsed);
        setProfile(parsed);
        setUser({ id: parsed.id, email: 'demo@skillswap.app', profile: parsed });
      } catch {
        sessionStorage.removeItem('skillswap_demo_user');
      }
      setLoading(false);
      return;
    }

    if (isDemoMode) {
      setLoading(false);
      return;
    }

    // Real Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data as Profile);
  };

  const signUp = async (email: string, password: string) => {
    if (isDemoMode) {
      return { error: new Error('Sign up is not available in demo mode. Please configure Supabase credentials.') };
    }
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      return { error: new Error('Sign in is not available in demo mode.') };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (demoUser) {
      exitDemoMode();
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const enterDemoMode = (profileId?: string) => {
    const demoProfile = profileId
      ? DEMO_PROFILES.find(p => p.id === profileId) || DEMO_PROFILES[0]
      : DEMO_PROFILES[0];
    setDemoUser(demoProfile);
    setProfile(demoProfile);
    setUser({ id: demoProfile.id, email: 'demo@skillswap.app', profile: demoProfile });
    sessionStorage.setItem('skillswap_demo_user', JSON.stringify(demoProfile));
  };

  const exitDemoMode = () => {
    setDemoUser(null);
    setProfile(null);
    setUser(null);
    sessionStorage.removeItem('skillswap_demo_user');
  };

  const updateProfile = (updates: Partial<Profile>) => {
    if (profile) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      if (demoUser) {
        setDemoUser(updated);
        sessionStorage.setItem('skillswap_demo_user', JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemoMode: isDemoMode || !!demoUser,
        demoUser,
        signUp,
        signIn,
        signOut,
        enterDemoMode,
        exitDemoMode,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
