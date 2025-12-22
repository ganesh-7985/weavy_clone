'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

// Dynamically import createClient only when configured
const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  const { createClient } = require('@/lib/supabase/client');
  return createClient();
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase] = useState<SupabaseClient | null>(() => getSupabaseClient());
  const isConfigured = isSupabaseConfigured();

  const fetchProfile = async (userId: string) => {
    if (!supabase) return null;
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
      );
      
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as UserProfile;
    } catch (error) {
      console.error('Profile fetch failed:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        // Set loading to false immediately after getting user
        setIsLoading(false);
        
        // Fetch profile in background (don't block UI)
        if (session?.user) {
          fetchProfile(session.user.id).then(setProfile);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile in background
          fetchProfile(session.user.id).then(setProfile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const signInWithGoogle = async () => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
