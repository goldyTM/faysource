'use client';

import { useEffect } from 'react';

type Supplier = {
  name: string;
  niche: string;
  moq: string;
  quality: string;
  ships: string;
  speed: string;
  verified: boolean;
  whatsapp: string;
  category?: string;
  tags?: string[];
};

interface SupplierPreviewModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SupplierPreviewModal({ supplier, isOpen, onClose }: SupplierPreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-black/20 p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-neutral-400 mb-2">{supplier.niche}</p>
              <h2 className="text-4xl font-semibold text-white">{supplier.name}</h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-200 backdrop-blur-sm">
              {supplier.quality}
            </div>
          </div>
          {supplier.verified && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              WhatsApp Verified
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-[0.32em] text-gold font-semibold">Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">MOQ</p>
                  <p className="text-white font-medium">{supplier.moq}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Ships To</p>
                  <p className="text-white font-medium">{supplier.ships}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Response Speed</p>
                  <p className="text-white font-medium">{supplier.speed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          {supplier.tags && supplier.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-[0.32em] text-gold font-semibold">Products & Categories</h3>
              <div className="flex flex-wrap gap-2">
                {supplier.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 hover:bg-white/10 transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Info */}
        {supplier.category && (
          <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-1">Category</p>
            <p className="text-white font-medium">{supplier.category}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <a
            href={`https://wa.me/${supplier.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
          >
            Chat Supplier
          </a>
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
