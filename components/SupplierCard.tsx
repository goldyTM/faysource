'use client';

import type React from 'react';
import type { Supplier } from '../types/supplier';

interface SupplierCardProps {
  supplier: Supplier;
  onPreview?: (supplier: Supplier) => void;
  isLocked?: boolean;
}

export default function SupplierCard({ supplier, onPreview, isLocked = false }: SupplierCardProps) {
  const handleCardClick = () => {
    if (onPreview) {
      onPreview(supplier);
    }
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked && onPreview) {
      onPreview(supplier);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-transparent p-6 shadow-glow transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(216,179,94,0.24)] animate-fade-in opacity-0 cursor-pointer"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(216,179,94,0.18),_transparent_30%)] opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">{supplier.niche}</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{supplier.name}</h3>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200 backdrop-blur-sm">
            {supplier.quality}
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm text-neutral-300">
          <p className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gold" /> MOQ: {supplier.moq}
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" /> Ships to: {supplier.ships}
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /> Response speed: {supplier.speed}
          </p>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-neutral-400">
            <span>{supplier.verified ? '✔️' : '⏳'}</span>
            WhatsApp verified
          </p>
        </div>

        {isLocked ? (
          <div className="mt-6 rounded-3xl border border-gold/20 bg-white/5 p-4 text-sm text-neutral-300">
            <p className="font-semibold text-white">Contact hidden</p>
            <p className="mt-2 text-neutral-400">Supplier details are visible for browsing; unlock to reveal WhatsApp access.</p>
          </div>
        ) : null}

        {isLocked ? (
          <button
            type="button"
            onClick={handleChatClick}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 px-4 py-3 text-sm font-semibold text-page shadow-[0_12px_35px_rgba(252,211,77,0.35)] transition hover:from-amber-300 hover:to-yellow-400"
          >
            Unlock for $5
          </button>
        ) : (
          <a
            href={`https://wa.me/${supplier.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            onClick={handleChatClick}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gold px-4 py-3 text-sm font-semibold text-page transition hover:bg-yellow-400"
          >
            Chat Supplier
          </a>
        )}
      </div>
    </article>
  );
}
