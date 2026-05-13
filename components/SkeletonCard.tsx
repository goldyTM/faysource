'use client';

export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
      <div className="h-5 w-3/4 rounded-full bg-gradient-to-r from-slate-700/80 via-slate-600/80 to-slate-700/80" />
      <div className="mt-5 space-y-4">
        <div className="h-4 rounded-full bg-gradient-to-r from-slate-700/80 via-slate-600/80 to-slate-700/80" />
        <div className="h-4 rounded-full bg-gradient-to-r from-slate-700/80 via-slate-600/80 to-slate-700/80 w-5/6" />
        <div className="h-4 rounded-full bg-gradient-to-r from-slate-700/80 via-slate-600/80 to-slate-700/80 w-4/6" />
      </div>
      <div className="mt-6 h-12 rounded-full bg-gradient-to-r from-slate-700/80 via-slate-600/80 to-slate-700/80" />
    </div>
  );
}
