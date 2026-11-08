'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Once an auth event has arrived it is newer than the stored snapshot, so
    // the getSession() result must not overwrite it.
    let sawEvent = false;

    // Subscribe first: the listener covers SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED
    // (and USER_UPDATED) so the session stays current for the whole visit.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!active) return;
      sawEvent = true;
      setSession(event === 'SIGNED_OUT' ? null : newSession);
      setLoading(false);
    });

    // Read the saved session once on mount: this is what survives a reload,
    // a closed tab and a closed browser. Keep the loading state until it settles.
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || sawEvent) return;
        setSession(error ? null : data.session);
      })
      .catch(() => {
        if (!active || sawEvent) return;
        setSession(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user: session?.user ?? null, session, loading, signOut }),
    [session, loading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
}
