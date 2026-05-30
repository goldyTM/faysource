'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Supplier } from '../types/supplier';
import SupplierCard from '../components/SupplierCard';
import SkeletonCard from '../components/SkeletonCard';
import SupplierPreviewModal from '../components/SupplierPreviewModal';
import PaywallModal from '../components/PaywallModal';
import { supabase } from '../lib/supabaseClient';
import CommunicationGuide from '../components/CommunicationGuide';
import FaqsAndGuide from '../components/FaqsAndGuide';

const PRICE_PER_SUPPLIER = 5;
const FULL_ACCESS_PRICE = 150;
const FREE_SUPPLIER_COUNT = 3;


const suppliers: Supplier[] = [];

const countries = ['Nigeria', 'Kenya', 'Ghana', 'South Africa'];
const categories = ['Electronics', 'Fashion', 'Housewares', 'Packaging', 'Accessories', 'Beauty', 'Fitness', 'Automotive', 'Appliances', 'Lighting', 'Toys', 'Footwear'];

export default function Home() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCountry, setActiveCountry] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSupplierLoading, setIsSupplierLoading] = useState(true);
  const [supplierError, setSupplierError] = useState<string | null>(null);
  const [productPrice, setProductPrice] = useState(18);
  const [quantity, setQuantity] = useState(40);
  const [itemWeight, setItemWeight] = useState(2);
  const [previewSupplier, setPreviewSupplier] = useState<Supplier | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [accessMode, setAccessMode] = useState<'free' | 'single' | 'full'>('free');
  const [unlockedSupplier, setUnlockedSupplier] = useState<string | null>(null);
  const [selectedLockedSupplier, setSelectedLockedSupplier] = useState<Supplier | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadSuppliers = async () => {
      setIsSupplierLoading(true);
      setSupplierError(null);

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        setSupplierError(error.message || 'Unable to load suppliers.');
        setSuppliers([]);
      } else {
        setSuppliers(data ?? []);
      }

      setIsSupplierLoading(false);
    };

    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    const tokens = query.split(/\s+/).filter(Boolean);
    return suppliers.filter((supplier) => {
      const supplierText = `${supplier.name} ${supplier.niche} ${supplier.category ?? ''} ${supplier.tags?.join(' ') ?? ''} ${supplier.ships} ${supplier.quality}`.toLowerCase();
      const matchesQuery =
        !query ||
        tokens.every((token) => supplierText.includes(token));
      const matchesCountry = !activeCountry || supplier.ships.toLowerCase().includes(activeCountry.toLowerCase());
      const matchesCategory = !activeCategory || supplier.category === activeCategory;
      return matchesQuery && matchesCountry && matchesCategory;
    });
  }, [searchTerm, activeCountry, activeCategory]);

  const productTotal = productPrice * quantity;
  const shippingCost = Math.max(28, Math.round(itemWeight * quantity * 0.92));
  const customs = Math.round(productTotal * 0.12);
  const landedCost = productTotal + shippingCost + customs;
  const expectedProfit = Math.round(landedCost * 1.18);

  const isSupplierLocked = (supplier: Supplier, index: number) => {
    if (accessMode === 'full') return false;
    if (index < FREE_SUPPLIER_COUNT) return false;
    if (accessMode === 'single' && unlockedSupplier === supplier.name) return false;
    return true;
  };

  const filteredSupplierEntries = filteredSuppliers.map((supplier, index) => ({
    supplier,
    isLocked: isSupplierLocked(supplier, index),
  }));

  const displayedSuppliers = filteredSupplierEntries.slice(0, visibleCount);
  const isLoadingSuppliers = isLoading || isFetching || isSupplierLoading;
  const showLoadMore = !isLoadingSuppliers && visibleCount < filteredSuppliers.length;
  const supplierStatus = isLoadingSuppliers
    ? 'Loading top suppliers…'
    : supplierError
    ? supplierError
    : `${filteredSuppliers.length} supplier${filteredSuppliers.length === 1 ? '' : 's'} matched`;

  useEffect(() => {
    const start = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(start);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    setIsFetching(true);
    const timer = window.setTimeout(() => {
      setVisibleCount(3);
      setIsFetching(false);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [searchTerm, activeCountry, activeCategory, isLoading]);

  const handlePreviewSupplier = (supplier: Supplier) => {
    const supplierIndex = filteredSuppliers.findIndex((item) => item.name === supplier.name);
    if (supplierIndex >= 0 && isSupplierLocked(supplier, supplierIndex)) {
      setSelectedLockedSupplier(supplier);
      setIsPaywallOpen(true);
      return;
    }

    setPreviewSupplier(supplier);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleClosePaywall = () => {
    setIsPaywallOpen(false);
    setSelectedLockedSupplier(null);
  };

  const handlePurchaseSupplier = (supplier: Supplier) => {
    setAccessMode('single');
    setUnlockedSupplier(supplier.name);
    setSelectedLockedSupplier(null);
    setIsPaywallOpen(false);
    setPreviewSupplier(supplier);
    setIsPreviewOpen(true);
  };

  const handlePurchaseFullAccess = () => {
    setAccessMode('full');
    setUnlockedSupplier(null);
    setIsPaywallOpen(false);
    setSelectedLockedSupplier(null);
  };

  useEffect(() => {
    if (isLoading || isFetching) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && visibleCount < filteredSuppliers.length) {
          setVisibleCount((count) => Math.min(count + 3, filteredSuppliers.length));
        }
      },
      { rootMargin: '220px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filteredSuppliers.length, isFetching, isLoading, visibleCount]);

  return (
    <main className="min-h-screen bg-page text-white px-4 pt-8 pb-16 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="relative mb-10 overflow-hidden rounded-[2.5rem] border border-border bg-panel/95 p-8 shadow-glow backdrop-blur-xl md:p-10">
          <div className="pointer-events-none absolute -right-10 top-8 hidden h-52 w-52 rounded-full bg-gold/20 blur-3xl md:block" />
          <div className="pointer-events-none absolute left-8 top-16 hidden h-36 w-36 rounded-full bg-sky-400/10 blur-3xl md:block" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-center">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-gold">
                FaySource 
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Trusted Chinese manufacturers for African importers.</h1>
                <p className="max-w-2xl text-neutral-300 sm:text-lg">Curated China-sourced manufacturers, shipping partners, import guides, and a WhatsApp-first connect experience designed for Nigeria, Kenya, Ghana, and South Africa.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <a href="#suppliers" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-page transition hover:bg-neutral-200">
                  Browse verified suppliers
                </a>
                <a href="#calculator" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:border-gold hover:text-gold">
                  Open import cost calculator
                </a>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-transparent p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
              <p className="text-sm uppercase tracking-[0.36em] text-neutral-400">Premium sourcing signal</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">Search faster. Trust suppliers sooner.</h2>
                <p className="mt-4 text-neutral-300">A curated manufacturer feed gives African importers the confidence to move from discovery to WhatsApp contact in seconds.</p>
                <div className="mt-6 grid gap-3 text-sm text-neutral-300">
                  <div className="rounded-3xl bg-white/5 p-4">Verified WhatsApp links</div>
                  <div className="rounded-3xl bg-white/5 p-4">MOQ & quality tier upfront</div>
                  <div className="rounded-3xl bg-white/5 p-4">China to Africa shipping routes</div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          <div className="space-y-6">
            <article className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.32em] text-neutral-400">Supplier spotlight</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-300">WhatsApp-first</span>
              </div>
              <h2 className="text-2xl font-semibold">Find suppliers with clear MOQ, shipping routes, and trusted contact signals.</h2>
              <p className="mt-4 text-neutral-300">No more random directories. Every manufacturer card shows niche, quality tier, shipping coverage, and WhatsApp connect actions.</p>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
                <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Trusted shipping agents</p>
                <h3 className="mt-3 text-xl font-semibold">Find cargo agents by trade lane.</h3>
                <p className="mt-3 text-neutral-300">Build your import ecosystem with air freight, sea freight, and clearing agents that understand African logistics.</p>
              </article>
              <article className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
                <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Winning products</p>
                <h3 className="mt-3 text-xl font-semibold">Trend-ready product ideas.</h3>
                <p className="mt-3 text-neutral-300">Curated product ideas for resellers: gadgets, fashion, accessories, and starter bundles that move fast.</p>
              </article>
            </div>
          </div>

          <aside className="space-y-6">
            <article id="calculator" className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">Import Cost Calculator</h3>
                  <p className="mt-2 text-neutral-300 sm:max-w-md">Quickly see landed cost, shipping, customs, and profit in one clean view. Adjust price, quantity, and weight to match your target order.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-300">
                  <p className="uppercase tracking-[0.32em] text-neutral-400">Recommended setup</p>
                  <p className="mt-2 font-semibold text-white">Small starter order</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em]">Product price</p>
                      <p className="mt-2 text-2xl font-semibold text-white">${productPrice}</p>
                    </div>
                    <span className="text-sm text-neutral-300">Range: $5–$120</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={productPrice}
                    onChange={(event) => setProductPrice(Number(event.target.value))}
                    className="mt-4 range-slider w-full"
                  />
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em]">Quantity</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{quantity} units</p>
                    </div>
                    <span className="text-sm text-neutral-300">10–200</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="mt-4 range-slider w-full"
                  />
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em]">Estimated weight</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{itemWeight.toFixed(1)} kg</p>
                    </div>
                    <span className="text-sm text-neutral-300">0.5–12kg</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="12"
                    step="0.1"
                    value={itemWeight}
                    onChange={(event) => setItemWeight(Number(event.target.value))}
                    className="mt-4 range-slider w-full"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Product subtotal</p>
                  <p className="mt-3 text-3xl font-semibold text-white">${productTotal.toLocaleString()}</p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Shipping</p>
                    <p className="mt-2 text-xl font-semibold text-white">${shippingCost.toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Customs</p>
                    <p className="mt-2 text-xl font-semibold text-white">${customs.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[2rem] border border-gold/20 bg-gradient-to-r from-black/60 via-white/5 to-black/50 p-5 text-white shadow-[0_18px_60px_-20px_rgba(249,231,59,0.55)]">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.32em] text-neutral-400">
                  <span>Landed cost</span>
                  <span className="font-semibold text-white">₦{landedCost.toLocaleString()}</span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/5 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Profit</p>
                    <p className="mt-2 text-2xl font-semibold text-gold">₦{expectedProfit.toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Cost per unit</p>
                    <p className="mt-2 text-2xl font-semibold text-white">₦{Math.round(landedCost / quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </article>
            <article className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
              <h3 className="text-xl font-semibold">Beginner import guides</h3>
              <ul className="mt-5 space-y-3 text-neutral-300">
                <li>• How to import phones into Nigeria</li>
                <li>• Best products under ₦500k startup budget</li>
                <li>• Avoiding supplier scams</li>
              </ul>
            </article>
          </aside>
        </section>

        <section id="suppliers" className="mt-10 space-y-6">
          <div className="rounded-[2rem] border border-border bg-panel p-6 shadow-glow">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Curated supplier listings</p>
                <h2 className="mt-3 text-3xl font-semibold">Verified suppliers</h2>
                <p className="mt-3 max-w-2xl text-neutral-300">Search by manufacturer, niche, and shipping routes for the best China-to-Africa manufacturer match.</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-4 text-sm text-neutral-200">
              <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Pricing</p>
              <p className="mt-3 text-lg font-semibold text-white">$5 per supplier or $150 full access</p>
              <p className="mt-2 text-neutral-300">Browse the first 3 suppliers for free, then unlock premium manufacturer contacts.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handlePurchaseFullAccess}
                  className="neon-ring relative inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 px-4 py-3 text-sm font-semibold text-page shadow-[0_0_35px_rgba(252,211,77,0.35)] transition hover:from-amber-200 hover:to-yellow-200"
                >
                  Unlock all suppliers
                </button>
              </div>
            </div>

            <CommunicationGuide />
            <FaqsAndGuide />

            <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-3">
                <label className="relative block rounded-3xl border border-white/10 bg-white/10 px-4 py-3 shadow-inner shadow-black/40 backdrop-blur-md transition duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20">
                  <span className="sr-only">Search suppliers</span>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8.5 14.5a6 6 0 1 1 4.242-1.758l4.007 4.007" />
                    </svg>
                  </span>
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search suppliers, products, categories or routes"
                    className="w-full bg-transparent pl-11 text-white outline-none placeholder:text-neutral-400"
                  />
                </label>
                <p className="text-sm text-neutral-400">Try: electronics, fashion, packaging, mobile parts, beauty, Nigeria</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {countries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => setActiveCountry((current) => (current === country ? '' : country))}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        activeCountry === country
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory((current) => (current === category ? '' : category))}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        activeCategory === category
                          ? 'border-sky-400 bg-sky-400/15 text-sky-300'
                          : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
                <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Live result</p>
                <p className="mt-3 text-lg font-semibold text-white">{supplierStatus}</p>
                {supplierError ? <p className="mt-2 text-sm text-red-300">Supplier load failed. Check your database schema or row-level security settings.</p> : null}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {isLoadingSuppliers ? (
              Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
            ) : (
              displayedSuppliers.map(({ supplier, isLocked }) => (
                <SupplierCard
                  key={supplier.name}
                  supplier={supplier}
                  onPreview={handlePreviewSupplier}
                  isLocked={isLocked}
                />
              ))
            )}
          </div>

          {filteredSuppliers.length === 0 && !isLoading && !isFetching ? (
            <div className="rounded-3xl border border-border bg-panel p-8 text-center text-neutral-300 shadow-glow">
              No suppliers matched. Try another search or clear the country filter.
            </div>
          ) : null}

          <div className="flex flex-col items-center gap-4">
            {showLoadMore ? (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + 3, filteredSuppliers.length))}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
              >
                Load more suppliers
              </button>
            ) : null}
            <div ref={loadMoreRef} className="h-2 w-full" />
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <article className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
            <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Supplier ratings</p>
            <h3 className="mt-3 text-xl font-semibold">Trust signals that matter</h3>
            <p className="mt-4 text-neutral-300">Communication, shipping reliability, and product quality ratings make the marketplace easier to trust and faster to choose from.</p>
          </article>
          <article className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
            <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Winning products</p>
            <h3 className="mt-3 text-xl font-semibold">Trend ideas for resellers</h3>
            <p className="mt-4 text-neutral-300">Curated product categories that reflect local demand, fast margins, and realistic startup budgets.</p>
          </article>
          <article className="rounded-3xl border border-border bg-panel p-6 shadow-glow">
            <p className="text-sm uppercase tracking-[0.32em] text-neutral-400">Premium tier</p>
            <h3 className="mt-3 text-xl font-semibold">Unlimited access plan</h3>
            <p className="mt-4 text-neutral-300">Unlock premium supplier views, advanced filters, shipping contacts, winning product ideas, and guide collections.</p>
          </article>
        </section>
      </section>

      <SupplierPreviewModal supplier={previewSupplier} isOpen={isPreviewOpen} onClose={handleClosePreview} />
      <PaywallModal
        supplier={selectedLockedSupplier}
        isOpen={isPaywallOpen}
        pricePerSupplier={PRICE_PER_SUPPLIER}
        fullAccessPrice={FULL_ACCESS_PRICE}
        onClose={handleClosePaywall}
        onPurchaseSupplier={handlePurchaseSupplier}
        onPurchaseFullAccess={handlePurchaseFullAccess}
      />
    </main>
  );
}
