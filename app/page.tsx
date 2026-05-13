'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import SupplierCard from '../components/SupplierCard';
import SkeletonCard from '../components/SkeletonCard';

type Supplier = {
  name: string;
  niche: string;
  category: string;
  tags: string[];
  moq: string;
  quality: string;
  ships: string;
  speed: string;
  verified: boolean;
  whatsapp: string;
};

const suppliers: Supplier[] = [
  {
    name: 'Shenzhen AudioTech',
    niche: 'Electronics & Accessories',
    category: 'Electronics',
    tags: ['audio', 'gadgets', 'mobile'],
    moq: '20 units',
    quality: 'Premium',
    ships: 'Nigeria, Kenya',
    speed: '2h response',
    verified: true,
    whatsapp: '+8613012345678',
  },
  {
    name: 'Guangzhou Textile Works',
    niche: 'Fast Fashion',
    category: 'Fashion',
    tags: ['apparel', 'fabric', 'clothing'],
    moq: '100 pcs',
    quality: 'Mid-premium',
    ships: 'Ghana, Nigeria',
    speed: '12h response',
    verified: true,
    whatsapp: '+8613812345678',
  },
  {
    name: 'Dongguan Fashion Hub',
    niche: 'Clothing & Bags',
    category: 'Fashion',
    tags: ['bags', 'accessories', 'streetwear'],
    moq: '50 pcs',
    quality: 'Value',
    ships: 'South Africa, Kenya',
    speed: '1d response',
    verified: false,
    whatsapp: '+8615012345678',
  },
  {
    name: 'Yiwu Home Goods',
    niche: 'Housewares',
    category: 'Housewares',
    tags: ['kitchen', 'decor', 'textiles'],
    moq: '80 pcs',
    quality: 'Mid-premium',
    ships: 'Nigeria, Ghana',
    speed: '18h response',
    verified: true,
    whatsapp: '+8617012345678',
  },
  {
    name: 'Ningbo Electronics Labs',
    niche: 'Gadgets & Tech',
    category: 'Electronics',
    tags: ['phones', 'smart', 'usb'],
    moq: '30 units',
    quality: 'Premium',
    ships: 'Nigeria, South Africa',
    speed: '4h response',
    verified: true,
    whatsapp: '+8618023456789',
  },
  {
    name: 'Foshan Packaging Co.',
    niche: 'Logistics & Packaging',
    category: 'Packaging',
    tags: ['boxes', 'labels', 'custom'],
    moq: 'Custom',
    quality: 'Premium',
    ships: 'Kenya, Ghana',
    speed: '6h response',
    verified: true,
    whatsapp: '+8619012345678',
  },
  {
    name: 'Xiamen Lighting Studio',
    niche: 'LED Lighting',
    category: 'Lighting',
    tags: ['bulbs', 'lamps', 'industrial'],
    moq: '50 units',
    quality: 'Mid-premium',
    ships: 'Kenya, South Africa',
    speed: '8h response',
    verified: true,
    whatsapp: '+8615112345678',
  },
  {
    name: 'Qingdao Kitchen Gear',
    niche: 'Kitchen Appliances',
    category: 'Appliances',
    tags: ['cookware', 'utensils', 'small appliances'],
    moq: '60 pcs',
    quality: 'Mid-premium',
    ships: 'Nigeria, Ghana',
    speed: '14h response',
    verified: true,
    whatsapp: '+8616112345678',
  },
  {
    name: 'Wuhan Fitness Gear',
    niche: 'Workout Equipment',
    category: 'Fitness',
    tags: ['dumbbells', 'yoga', 'gym'],
    moq: '30 units',
    quality: 'Premium',
    ships: 'South Africa, Kenya',
    speed: '1d response',
    verified: false,
    whatsapp: '+8617112345678',
  },
  {
    name: 'Shenzhen Phone Parts',
    niche: 'Mobile Components',
    category: 'Electronics',
    tags: ['screens', 'chargers', 'batteries'],
    moq: '25 units',
    quality: 'Premium',
    ships: 'Nigeria, Kenya',
    speed: '3h response',
    verified: true,
    whatsapp: '+8618112345678',
  },
  {
    name: 'Guangzhou Beauty Lab',
    niche: 'Beauty & Personal Care',
    category: 'Beauty',
    tags: ['skincare', 'cosmetics', 'serums'],
    moq: '120 pcs',
    quality: 'Mid-premium',
    ships: 'Ghana, Nigeria',
    speed: '12h response',
    verified: true,
    whatsapp: '+8619212345678',
  },
  {
    name: 'Ningbo Auto Parts',
    niche: 'Automotive Components',
    category: 'Automotive',
    tags: ['brakes', 'filters', 'accessories'],
    moq: '40 units',
    quality: 'Value',
    ships: 'South Africa, Kenya',
    speed: '8h response',
    verified: false,
    whatsapp: '+8619312345678',
  },
  {
    name: 'Yiwu Toys Factory',
    niche: 'Kids & Toys',
    category: 'Toys',
    tags: ['educational', 'plush', 'games'],
    moq: '70 pcs',
    quality: 'Value',
    ships: 'Nigeria, Ghana',
    speed: '20h response',
    verified: true,
    whatsapp: '+8619412345678',
  },
  {
    name: 'Dongguan Shoe Line',
    niche: 'Footwear',
    category: 'Footwear',
    tags: ['sneakers', 'sandals', 'boots'],
    moq: '60 pairs',
    quality: 'Mid-premium',
    ships: 'Kenya, South Africa',
    speed: '18h response',
    verified: true,
    whatsapp: '+8619512345678',
  },
  {
    name: 'Shenzhen TechWear',
    niche: 'Wearable Accessories',
    category: 'Accessories',
    tags: ['smartwatch', 'chargers', 'cases'],
    moq: '35 units',
    quality: 'Premium',
    ships: 'Nigeria, Kenya',
    speed: '5h response',
    verified: true,
    whatsapp: '+8619612345678',
  },
  {
    name: 'Shanghai Eco Packs',
    niche: 'Sustainable Packaging',
    category: 'Packaging',
    tags: ['eco', 'biodegradable', 'cartons'],
    moq: 'Custom',
    quality: 'Mid-premium',
    ships: 'Ghana, Nigeria',
    speed: '14h response',
    verified: true,
    whatsapp: '+8619712345678',
  },
  {
    name: 'Ningbo Home Decor',
    niche: 'Modern Decor',
    category: 'Housewares',
    tags: ['lighting', 'pillows', 'art'],
    moq: '90 pcs',
    quality: 'Mid-premium',
    ships: 'South Africa, Kenya',
    speed: '24h response',
    verified: false,
    whatsapp: '+8619812345678',
  },
];

const countries = ['Nigeria', 'Kenya', 'Ghana', 'South Africa'];
const categories = ['Electronics', 'Fashion', 'Housewares', 'Packaging', 'Accessories', 'Beauty', 'Fitness', 'Automotive', 'Appliances', 'Lighting', 'Toys', 'Footwear'];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCountry, setActiveCountry] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [productPrice, setProductPrice] = useState(18);
  const [quantity, setQuantity] = useState(40);
  const [itemWeight, setItemWeight] = useState(2);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filteredSuppliers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    const tokens = query.split(/\s+/).filter(Boolean);
    return suppliers.filter((supplier) => {
      const supplierText = `${supplier.name} ${supplier.niche} ${supplier.category} ${supplier.tags.join(' ')} ${supplier.ships} ${supplier.quality}`.toLowerCase();
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

  const displayedSuppliers = filteredSuppliers.slice(0, visibleCount);
  const showLoadMore = !isLoading && !isFetching && visibleCount < filteredSuppliers.length;
  const supplierStatus = isLoading
    ? 'Loading top suppliers…'
    : isFetching
    ? 'Refreshing results…'
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
  }, [searchTerm, activeCountry, isLoading]);

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
                FaySource MVP
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
              <h3 className="text-xl font-semibold">Import Cost Calculator</h3>
              <p className="mt-3 text-neutral-300">Estimate landed cost, shipping, customs, and profit with slider-powered range controls.</p>
              <div className="mt-6 space-y-6 text-sm text-neutral-200">
                <div className="space-y-3 rounded-3xl bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <span>Product price</span>
                    <span className="font-semibold text-white">${productPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={productPrice}
                    onChange={(event) => setProductPrice(Number(event.target.value))}
                    className="range-slider w-full"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-500">
                    <span>$5</span>
                    <span>$120</span>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <span>Quantity</span>
                    <span className="font-semibold text-white">{quantity} units</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="range-slider w-full"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-500">
                    <span>10</span>
                    <span>200</span>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <span>Estimated weight</span>
                    <span className="font-semibold text-white">{itemWeight.toFixed(1)} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="12"
                    step="0.1"
                    value={itemWeight}
                    onChange={(event) => setItemWeight(Number(event.target.value))}
                    className="range-slider w-full"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-500">
                    <span>0.5kg</span>
                    <span>12kg</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4 rounded-3xl bg-gradient-to-br from-white/5 via-white/10 to-transparent p-6 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.32em] text-neutral-400">
                  <span>Product subtotal</span>
                  <span className="font-semibold">${productTotal.toLocaleString()}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white/5 p-4 text-center text-sm">
                    <p className="text-neutral-400">Shipping</p>
                    <p className="mt-3 text-xl font-semibold text-white">${shippingCost.toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4 text-center text-sm">
                    <p className="text-neutral-400">Customs</p>
                    <p className="mt-3 text-xl font-semibold text-white">${customs.toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4 text-center text-sm">
                    <p className="text-neutral-400">Expected profit</p>
                    <p className="mt-3 text-xl font-semibold text-gold">₦{expectedProfit.toLocaleString()}</p>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-page/90 p-4">
                  <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Landed cost</p>
                  <p className="mt-3 text-3xl font-semibold text-white">₦{landedCost.toLocaleString()}</p>
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
              <div className="flex flex-wrap gap-2">
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
              <div className="mt-4 flex flex-wrap gap-2">
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

            <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-3">
                <label className="relative block rounded-3xl border border-white/10 bg-white/5 px-4 py-3 shadow-inner shadow-black/20">
                  <span className="sr-only">Search suppliers</span>
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by manufacturer, product, category, or route"
                    className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
                  />
                </label>
                <p className="text-sm text-neutral-500">Try: electronics, fashion, packaging, mobile parts, beauty, Nigeria</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
                <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Live result</p>
                <p className="mt-3 text-lg font-semibold text-white">{supplierStatus}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {isLoading || isFetching ? (
              Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
            ) : (
              displayedSuppliers.map((supplier) => <SupplierCard key={supplier.name} supplier={supplier} />)
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
    </main>
  );
}
