'use client';

type Supplier = {
  name: string;
  niche: string;
  moq: string;
  quality: string;
  ships: string;
  speed: string;
  verified: boolean;
  whatsapp: string;
};

export default function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-transparent p-6 shadow-glow transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(216,179,94,0.24)] animate-fade-in opacity-0">
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

        <a
          href={`https://wa.me/${supplier.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gold px-4 py-3 text-sm font-semibold text-page transition hover:bg-yellow-400"
        >
          Chat Supplier
        </a>
      </div>
    </article>
  );
}
