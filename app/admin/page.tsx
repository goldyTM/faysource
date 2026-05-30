'use client';

import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import SupabaseAuth from '../../components/SupabaseAuth';
import SupabaseAdmin from '../../components/SupabaseAdmin';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const sessionStatus = session ? 'Admin controls are enabled.' : 'Sign in first to enable supplier management.';

  return (
    <main className="min-h-screen bg-page text-white px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[2rem] border border-border bg-panel/95 p-8 shadow-glow backdrop-blur-xl">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Admin dashboard</p>
            <h1 className="text-4xl font-semibold">Manage suppliers</h1>
            <p className="max-w-2xl text-neutral-300">Use this page to sign in with your Supabase admin account and add new supplier records to the catalog.</p>
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-neutral-300">
            <p className="font-semibold text-white">Admin page status</p>
            <p className="mt-2">{sessionStatus}</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <SupabaseAuth onSessionChange={setSession} />
          <div className="relative">
            {!session ? (
              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-dashed border-neutral-600 bg-black/40 backdrop-blur-sm" />
            ) : null}
            <SupabaseAdmin session={session} />
          </div>
        </div>
      </div>
    </main>
  );
}
