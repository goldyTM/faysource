'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { paymentPlans, processPayment } from '../lib/paymentProvider';

interface SupabasePaymentsProps {
  session: Session | null;
}

export default function SupabasePayments({ session }: SupabasePaymentsProps) {
  const [status, setStatus] = useState('');
  const [accessPlan, setAccessPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      setAccessPlan(null);
      return;
    }

    const loadAccess = async () => {
      const { data, error } = await supabase
        .from('user_access')
        .select('plan_id,active,expires_at')
        .eq('user_id', session.user.id)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        setStatus(error.message);
        return;
      }

      if (data?.plan_id) {
        setAccessPlan(data.plan_id);
      }
    };

    loadAccess();
  }, [session]);

  const handlePurchase = async (planId: string) => {
    if (!session) {
      setStatus('Please sign in first.');
      return;
    }

    setIsLoading(true);
    setStatus('Recording purchase...');

    const plan = paymentPlans.find((item) => item.id === planId);
    if (!plan) {
      setStatus('Unknown plan.');
      setIsLoading(false);
      return;
    }

    const paymentResult = await processPayment(plan.id);
    if (paymentResult.status === 'failed') {
      setStatus(paymentResult.message ?? 'Payment failed.');
      setIsLoading(false);
      return;
    }

    const insertResult = await supabase.from('payments').insert([
      {
        user_id: session.user.id,
        plan_id: plan.id,
        amount_cents: plan.amount_cents,
        currency: 'USD',
        payment_provider: paymentResult.provider,
        provider_payment_id: paymentResult.provider_payment_id,
        status: paymentResult.status,
      },
    ]);

    if (insertResult.error) {
      setStatus(insertResult.error.message);
      setIsLoading(false);
      return;
    }

    if (planId === 'full_access') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const accessResult = await supabase.from('user_access').insert([
        {
          user_id: session.user.id,
          plan_id: plan.id,
          active: true,
          started_at: new Date().toISOString(),
          expires_at: expiresAt,
        },
      ]);

      if (accessResult.error) {
        setStatus(accessResult.error.message);
        setIsLoading(false);
        return;
      }

      setAccessPlan(plan.id);
      setStatus('Full access recorded successfully.');
    } else {
      setStatus('Supplier unlock recorded successfully.');
    }

    setIsLoading(false);
  };

  return (
    <section className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Premium access</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Unlock supplier contacts</h2>
        </div>
        {accessPlan ? (
          <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">{accessPlan === 'full_access' ? 'Full access active' : 'Purchase recorded'}</span>
        ) : (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">Not purchased</span>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {paymentPlans.map((plan) => (
          <div key={plan.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-400 uppercase tracking-[0.32em]">{plan.title}</p>
                <p className="mt-2 text-lg font-semibold text-white">${(plan.amount_cents / 100).toFixed(0)}</p>
                <p className="mt-2 text-sm text-neutral-300">{plan.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchase(plan.id)}
                disabled={isLoading}
                className="mt-4 inline-flex rounded-full bg-gold px-4 py-3 text-sm font-semibold text-page transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0"
              >
                {isLoading ? 'Processing...' : `Purchase ${plan.id === 'full_access' ? 'full access' : 'supplier unlock'}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {status ? <p className="mt-4 text-sm text-neutral-300">{status}</p> : null}
      <p className="mt-4 text-xs text-neutral-500">This payment flow is a temporary implementation. Replace the gateway in <code>lib/paymentProvider.ts</code> before production.</p>
    </section>
  );
}
