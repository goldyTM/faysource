'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Supplier } from '../types/supplier';

interface SupabaseAdminProps {
  session: Session | null;
}

type AdminProfile = {
  id: string;
  full_name?: string;
  email?: string;
  is_admin: boolean;
};

const categoryOptions = [
  'Electronics',
  'Fashion',
  'Housewares',
  'Packaging',
  'Accessories',
  'Beauty',
  'Fitness',
  'Automotive',
  'Appliances',
  'Lighting',
  'Toys',
  'Footwear',
];

export default function SupabaseAdmin({ session }: SupabaseAdminProps) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    niche: '',
    category: '',
    tags: [],
    moq: '',
    quality: '',
    ships: '',
    speed: '',
    verified: false,
    whatsapp: '',
  });

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setIsFetchingProfile(false);
      return;
    }

    const loadProfile = async () => {
      setIsFetchingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, is_admin')
        .eq('id', session.user.id)
        .single();

      if (error) {
        setProfile(null);
      } else {
        setProfile(data);
      }

      setIsFetchingProfile(false);
    };

    loadProfile();
  }, [session]);

  const handleCreateSupplier = async () => {
    if (!profile?.is_admin) {
      setStatusMessage('Only admin users can add suppliers.');
      return;
    }

    if (!newSupplier.name || !newSupplier.whatsapp) {
      setStatusMessage('Supplier name and WhatsApp contact are required.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const tags = Array.isArray(newSupplier.tags) ? newSupplier.tags.filter(Boolean) : [];

    const { error } = await supabase.from('suppliers').insert([
      {
        name: newSupplier.name,
        niche: newSupplier.niche || '',
        category: newSupplier.category || '',
        tags,
        moq: newSupplier.moq || 'Contact for MOQ',
        quality: newSupplier.quality || 'Standard',
        ships: newSupplier.ships || 'Nigeria, Kenya, Ghana, South Africa',
        speed: newSupplier.speed || '24h response',
        verified: Boolean(newSupplier.verified),
        whatsapp: newSupplier.whatsapp,
      },
    ]);

    if (error) {
      setStatusMessage(error.message || 'Unable to create supplier.');
    } else {
      setStatusMessage('Supplier created successfully. Refresh the app to see it in the listing.');
      setNewSupplier({
        name: '',
        niche: '',
        category: '',
        tags: [],
        moq: '',
        quality: '',
        ships: '',
        speed: '',
        verified: false,
        whatsapp: '',
      });
    }

    setIsSubmitting(false);
  };

  const isAdmin = Boolean(profile?.is_admin);

  return (
    <article className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Admin panel</p>
          <h3 className="mt-2 text-xl font-semibold">Supplier manager</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-neutral-300">
          {session ? isAdmin ? 'Admin' : 'Viewer' : 'Signed out'}
        </span>
      </div>

      {session ? (
        <div className="mt-5 space-y-4 text-neutral-300">
          <p>{isAdmin ? 'Create new suppliers and keep your Supabase catalog updated.' : 'Log in with an admin account to add suppliers.'}</p>

          <label className="block text-sm font-medium text-neutral-200">Supplier name</label>
          <input
            value={newSupplier.name || ''}
            onChange={(event) => setNewSupplier((current) => ({ ...current, name: event.target.value }))}
            disabled={!isAdmin}
            className="mt-1 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
            placeholder="e.g. Shenzhen AudioTech"
          />

          <label className="block text-sm font-medium text-neutral-200">WhatsApp contact</label>
          <input
            value={newSupplier.whatsapp || ''}
            onChange={(event) => setNewSupplier((current) => ({ ...current, whatsapp: event.target.value }))}
            disabled={!isAdmin}
            className="mt-1 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
            placeholder="e.g. +8613012345678"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-200">Category</label>
              <select
                value={newSupplier.category || ''}
                onChange={(event) => setNewSupplier((current) => ({ ...current, category: event.target.value }))}
                disabled={!isAdmin}
                className="mt-1 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
              >
                <option value="">Select category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-200">Niche</label>
              <input
                value={newSupplier.niche || ''}
                onChange={(event) => setNewSupplier((current) => ({ ...current, niche: event.target.value }))}
                disabled={!isAdmin}
                className="mt-1 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
                placeholder="e.g. Electronics & Accessories"
              />
            </div>
          </div>

          <label className="block text-sm font-medium text-neutral-200">Tags</label>
          <input
            value={Array.isArray(newSupplier.tags) ? newSupplier.tags.join(', ') : (newSupplier.tags || '')}
            onChange={(event) => setNewSupplier((current) => ({ ...current, tags: event.target.value.split(',').map((tag) => tag.trim()) }))}
            disabled={!isAdmin}
            className="mt-1 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
            placeholder="e.g. audio, mobile, accessories"
          />
          <p className="mt-2 text-xs text-neutral-500">Separate tags with commas.</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-200">Ships to</label>
              <input
                value={newSupplier.ships || ''}
                onChange={(event) => setNewSupplier((current) => ({ ...current, ships: event.target.value }))}
                disabled={!isAdmin}
                className="mt-1 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
                placeholder="e.g. Nigeria, Kenya"
              />
              <p className="mt-2 text-xs text-neutral-500">Add regions or countries separated by commas.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-200">Response speed</label>
              <input
                value={newSupplier.speed || ''}
                onChange={(event) => setNewSupplier((current) => ({ ...current, speed: event.target.value }))}
                disabled={!isAdmin}
                className="mt-1 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
                placeholder="e.g. 24h response"
              />
            </div>
          </div>

          <label className="block text-sm font-medium text-neutral-200">Verified supplier</label>
          <select
            value={newSupplier.verified ? 'yes' : 'no'}
            disabled={!isAdmin}
            onChange={(event) => setNewSupplier((current) => ({ ...current, verified: event.target.value === 'yes' }))}
            className="mt-1 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold focus:ring-2 focus:ring-gold/10"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          <button
            type="button"
            disabled={!isAdmin || isSubmitting}
            onClick={handleCreateSupplier}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gold px-4 py-3 text-sm font-semibold text-page transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving supplier…' : 'Create supplier'}
          </button>

          {statusMessage ? <p className="mt-3 text-sm text-neutral-300">{statusMessage}</p> : null}
        </div>
      ) : (
        <p className="mt-5 text-sm text-neutral-300">Sign in to see your admin supplier tools.</p>
      )}
    </article>
  );
}
