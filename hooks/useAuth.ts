"use client";

import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Basic client-side brute force mitigation (not a replacement for server rate limiting)
    const MAX_ATTEMPTS = 5; // allowed attempts in window
    const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
    const COOLDOWN_MS = 2 * 60 * 1000; // lockout duration after exceeding
    const STORAGE_KEY = "auth_attempts_v1";

    type Stored = { t: number; success?: boolean }[];
    const now = Date.now();
    let stored: Stored = [];
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      stored = [];
    }
    // Remove old entries
    stored = stored.filter(
      (a) => now - a.t <= WINDOW_MS || (a.success && now - a.t <= COOLDOWN_MS)
    );

    const failures = stored.filter((a) => !a.success && now - a.t <= WINDOW_MS);
    const exceeded = failures.length >= MAX_ATTEMPTS;
    const lockStart = exceeded ? failures.slice(-MAX_ATTEMPTS)[0].t : null;
    const inCooldown =
      exceeded && lockStart !== null && now - lockStart < COOLDOWN_MS;

    if (inCooldown) {
      const remaining = COOLDOWN_MS - (now - (lockStart as number));
      const seconds = Math.ceil(remaining / 1000);
      return {
        data: { session: null, user: null },
        error: {
          name: "AuthRateLimit",
          message: `Too many attempts. Try again in ${seconds}s.`,
        },
      } as const;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    stored.push({ t: now, success: !error });
    // Keep only last 50 entries to bound size
    stored = stored.slice(-50);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* ignore storage errors */
    }
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
}
