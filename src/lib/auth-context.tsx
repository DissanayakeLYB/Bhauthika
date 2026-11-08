'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  // Loading is a first-paint concern only. After the first check it must never
  // come back, or the guard would swap the screens out mid-practice.
  const firstCheckDone = useRef(false);

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
      // Supabase re-emits events when the tab becomes visible again (token
      // refresh) and after SIGNED_IN. For the same user nothing the screens
      // render has changed, so keep the previous session object: a new object
      // identity would restart every provider effect that depends on `user`.
      setSession((previous) => {
        if (event === 'SIGNED_OUT') return null;
        const nextUser = newSession?.user ?? null;
        if (!nextUser) return previous;
        if (previous?.user?.id === nextUser.id) return previous;
        return newSession;
      });
      if (!firstCheckDone.current) {
        firstCheckDone.current = true;
        setLoading(false);
      }
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
        if (!active || firstCheckDone.current) return;
        firstCheckDone.current = true;
        setLoading(false);
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
