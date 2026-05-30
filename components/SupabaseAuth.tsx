'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface SupabaseAuthProps {
  onSessionChange?: (session: Session | null) => void;
}

export default function SupabaseAuth({ onSessionChange }: SupabaseAuthProps) {
  const [email, setEmail] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const ensureProfile = async (s: Session | null) => {
      if (!s) return;
      try {
        const { data } = await supabase.from('profiles').select('id').eq('id', s.user.id).maybeSingle();
        if (!data) {
          await supabase.from('profiles').insert([
            {
              id: s.user.id,
              full_name: (s.user.user_metadata && (s.user.user_metadata as any).full_name) || null,
              email: s.user.email || null,
              is_admin: false,
            },
          ], { returning: 'minimal' });
        }
      } catch (e) {
        // ignore; profile creation is best-effort here
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      onSessionChange?.(data.session);
      ensureProfile(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, authSession) => {
      setSession(authSession);
      onSessionChange?.(authSession);
      ensureProfile(authSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [onSessionChange]);

  const handleSignIn = async () => {
    if (!email.trim()) {
      setMessage('Enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setMessage('Sending sign-in link...');

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.href,
      },
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Sign-in link sent. Check your email to access admin tools.');
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    onSessionChange?.(null);
    setMessage('Signed out successfully.');
    setIsLoading(false);
  };

  return (
    <section className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Account</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Admin sign-in</h2>
          </div>
          {session ? (
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">Signed in</span>
          ) : (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">Guest</span>
          )}
        </div>

        {session ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
            <p className="text-sm text-neutral-400">Signed in as</p>
            <p className="mt-2 font-medium text-white">{session.user.email ?? session.user.id}</p>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isLoading}
              className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
            <label className="block text-sm font-medium text-neutral-300">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full rounded-full bg-gold px-4 py-3 text-sm font-semibold text-page transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Sending...' : 'Send magic link'}
            </button>
          </div>
        )}

        {message ? <p className="text-sm text-neutral-400">{message}</p> : null}
      </div>
    </section>
  );
}
