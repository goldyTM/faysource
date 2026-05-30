'use client';

import type { Supplier } from '../types/supplier';

interface PaywallModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  pricePerSupplier: number;
  fullAccessPrice: number;
  onClose: () => void;
  onPurchaseSupplier: (supplier: Supplier) => void;
  onPurchaseFullAccess: () => void;
}

export default function PaywallModal({
  supplier,
  isOpen,
  pricePerSupplier,
  fullAccessPrice,
  onClose,
  onPurchaseSupplier,
  onPurchaseFullAccess,
}: PaywallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-panel p-8 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Premium access</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Unlock supplier contact details</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close paywall"
            className="text-neutral-400 transition hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Single supplier</p>
            <p className="mt-4 text-2xl font-semibold text-white">${pricePerSupplier}</p>
            <p className="mt-3 text-neutral-300">Unlock the current supplier and open WhatsApp contact instantly.</p>
            <button
              type="button"
              onClick={() => supplier && onPurchaseSupplier(supplier)}
              disabled={!supplier}
              className="mt-6 w-full rounded-full bg-gold px-4 py-3 text-sm font-semibold text-page transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Unlock this supplier
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Unlimited access</p>
            <p className="mt-4 text-2xl font-semibold text-white">${fullAccessPrice}</p>
            <p className="mt-3 text-neutral-300">Unlock all premium suppliers across the feed for one price.</p>
            <button
              type="button"
              onClick={onPurchaseFullAccess}
              className="mt-6 w-full rounded-full border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Unlock all suppliers
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-neutral-300">
          <p className="font-semibold text-white">What you get</p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>Verified WhatsApp supplier contacts</li>
            <li>Full supplier preview cards and contact actions</li>
            <li>No limits on premium supplier lookups</li>
          </ul>
          <p className="mt-4 text-neutral-400">Free preview includes the first 3 supplier listings. Unlock more with one-time access.</p>
        </div>
      </div>
    </div>
  );
}
