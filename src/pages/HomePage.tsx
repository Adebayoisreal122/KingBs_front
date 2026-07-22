import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Star, Shield, Award, Headphones, ArrowRight, Zap,
  CheckCircle2, Quote, Wallet, Car as CarIcon, ClipboardList,
  CalendarCheck, KeyRound,
} from 'lucide-react';
import { fetchCars } from '../services/api';
import CarCard from '../components/ui/CarCard';
import type { Car } from '../types';

const categories = [
  { label: 'SUV', emoji: '🚙', href: '/inventory?category=SUV' },
  { label: 'Sedan', emoji: '🚗', href: '/inventory?category=Sedan' },
  { label: 'Truck', emoji: '🛻', href: '/inventory?category=Truck' },
  { label: 'Electric', emoji: '⚡', href: '/inventory?category=Electric' },
  { label: 'Luxury', emoji: '✨', href: '/inventory?category=Luxury' },
  { label: 'Coupe', emoji: '🏎️', href: '/inventory?category=Coupe' },
  { label: 'Van', emoji: '🚐', href: '/inventory?category=Van' },
  { label: 'Convertible', emoji: '🌞', href: '/inventory?category=Convertible' },
];

const whyUs = [
  { icon: <Shield size={22} />, title: 'Certified Quality', desc: 'Every car undergoes a 150-point inspection before listing.' },
  { icon: <Star size={22} />, title: 'Best Price Guarantee', desc: 'Find a better deal? We will match or beat any competitor.' },
  { icon: <Award size={22} />, title: 'Trusted Dealer', desc: 'Over 10 years serving customers with integrity and care.' },
  { icon: <Headphones size={22} />, title: '24/7 Support', desc: 'Our team is always available to assist you before and after purchase.' },
];

const steps = [
  { icon: <ClipboardList size={22} />, title: 'Choose a Vehicle', desc: 'Browse and filter to find the car that fits your budget and needs.' },
  { icon: <CalendarCheck size={22} />, title: 'Book a Viewing', desc: 'Pick a date and time to inspect and test drive at our lot.' },
  { icon: <Wallet size={22} />, title: 'Make an Offer', desc: 'Agree on a fair price — no hidden fees, no pressure.' },
  { icon: <KeyRound size={22} />, title: 'Drive Away', desc: 'Complete paperwork and get the keys to your new car.' },
];

// Road-marking divider — a recurring signature motif for the dealership
function RoadDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-hidden="true">
      <span className="w-6 h-[3px] rounded-full bg-amber-400" />
      <span className="w-6 h-[3px] rounded-full bg-brand-600" />
      <span className="w-2.5 h-[3px] rounded-full bg-slate-300" />
    </div>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState<Car[]>([]);
  const [hotDeals, setHotDeals] = useState<Car[]>([]);
  const [newArrivals, setNewArrivals] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featuredRes, dealsRes, newRes] = await Promise.all([
          fetchCars({ featured: true, limit: 6 }),
          fetchCars({ dealType: 'Hot Deal', limit: 4 }),
          fetchCars({ dealType: 'New Arrival', limit: 4 }),
        ]);
        setFeatured(featuredRes.data || []);
        setHotDeals(dealsRes.data || []);
        setNewArrivals(newRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/inventory?search=${encodeURIComponent(search)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero.jfif')" }}
        />
        {/* Dark gradient overlay — strong left (text side), fading right so the photo still reads */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        {/* Bottom fade so the section blends into the next block */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-slate-950/60" />
        {/* subtle brand-tinted glow, kept low so it doesn't fight the photo */}
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-brand-600/20 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-6">
                <Zap size={13} className="text-brand-400" />
                <span className="text-white/90 text-xs font-semibold tracking-wider uppercase">Premium Auto Dealership</span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-[1.02] mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                Find Your<br />
                <span className="text-brand-400">Dream Car</span> Today
              </h1>

              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Explore thousands of premium new and used vehicles. Transparent pricing, verified history, and unbeatable deals — right here in Oyo State.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search make, model, or keyword..."
                    className="w-full pl-11 pr-4 py-4 rounded-xl text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400" />
                </div>
                <button type="submit" className="bg-brand-600 hover:bg-brand-700 transition-colors text-white px-6 py-4 rounded-xl text-sm font-bold whitespace-nowrap">
                  Search
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {['New Cars', 'Used Cars', 'Under ₦1M', 'SUVs', 'Electric'].map(tag => (
                  <a key={tag} href={`/inventory?search=${tag}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/20 text-white/80 hover:border-brand-400 hover:text-brand-300 transition-colors bg-white/5 backdrop-blur-sm">
                    {tag}
                  </a>
                ))}
              </div>
            </div>

            {/* Floating trust card — sits over the photo on the right */}
            <div className="relative hidden lg:flex justify-end">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3 border border-white/20 mt-auto mb-8">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">150-Point Inspected</div>
                  <div className="text-xs text-white/60">Every listing, guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '2,400+', label: 'Cars Available' },
              { n: '15K+', label: 'Happy Customers' },
              { n: '10+', label: 'Years of Trust' },
              { n: '50+', label: 'Premium Brands' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-black text-brand-600">{s.n}</div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <RoadDivider className="mb-3" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">Browse by Type</h2>
          </div>
          <Link to="/inventory" className="text-sm text-brand-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map(c => (
            <a key={c.label} href={c.href}
              className="rounded-2xl p-4 text-center group bg-slate-50 border border-slate-100 hover:border-brand-300 hover:bg-brand-50 transition-all cursor-pointer">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.emoji}</div>
              <div className="text-xs font-semibold text-slate-500 group-hover:text-brand-600 transition-colors">{c.label}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Buy / Sell CTA cards ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl p-8 bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">Are You Looking for a Car?</h3>
              <p className="text-brand-100 text-sm mb-5 max-w-xs">We offer a wide range of vehicles to meet every need and budget.</p>
              <Link to="/inventory" className="inline-flex items-center gap-2 bg-white text-brand-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-50 transition-colors">
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
            <CarIcon size={56} className="text-white/40 shrink-0" strokeWidth={1.2} />
          </div>
          <div className="rounded-3xl p-8 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold mb-2">Do You Want to Sell a Car?</h3>
              <p className="text-emerald-100 text-sm mb-5 max-w-xs">We provide the best platform to sell your car quickly, at a fair price.</p>
              <Link to="/sell" className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors">
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
            <Wallet size={56} className="text-white/40 shrink-0" strokeWidth={1.2} />
          </div>
        </div>
      </section>

      {/* ── Trust / Service section ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-2xl bg-brand-100 flex items-center justify-center">
              <CarIcon size={48} className="text-brand-400" strokeWidth={1.2} />
            </div>
            <div className="aspect-square rounded-2xl bg-amber-100 flex items-center justify-center mt-8">
              <KeyRound size={48} className="text-amber-500" strokeWidth={1.2} />
            </div>
            <div className="aspect-square rounded-2xl bg-emerald-100 flex items-center justify-center -mt-8">
              <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={1.2} />
            </div>
            <div className="aspect-square rounded-2xl bg-slate-200 flex items-center justify-center">
              <Headphones size={48} className="text-slate-500" strokeWidth={1.2} />
            </div>
          </div>
          <div>
            <RoadDivider className="mb-3" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Driven by Trust. Defined by Service.
            </h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              At KINGBS AUTO, we go beyond rides — we deliver experiences built on trust, backed by quality checks, easy booking, and transparent pricing on every vehicle we list.
            </p>
            <ul className="space-y-3 mb-8">
              {['Top Quality Cars', 'Easy Booking Process', '24/7 Customer Support', 'Transparent Pricing'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 size={18} className="text-brand-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/about" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 transition-colors text-white px-6 py-3 rounded-xl text-sm font-bold">
              Learn More <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Cars ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <RoadDivider className="mb-3" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">Popular Cars</h2>
              <p className="text-slate-400 text-sm mt-2">Hand-picked premium cars for discerning buyers</p>
            </div>
            <Link to="/inventory" className="text-sm text-brand-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(car => <CarCard key={car._id} car={car} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <div className="text-5xl mb-3">🚗</div>
              <p>No featured cars yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Hot Deals ── */}
      {hotDeals.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <RoadDivider className="mb-3" />
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-3">
                  🔥 Hot Deals
                </h2>
                <p className="text-slate-400 text-sm mt-2">Limited-time offers — act fast before they're gone</p>
              </div>
              <Link to="/deals" className="text-sm text-brand-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                All Deals <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotDeals.map(car => <CarCard key={car._id} car={car} compact />)}
            </div>
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <RoadDivider className="mb-3" />
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">✨ New Arrivals</h2>
              </div>
              <Link to="/inventory?dealType=New Arrival" className="text-sm text-brand-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(car => <CarCard key={car._id} car={car} compact />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Premium ride banner ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-brand-900 text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="relative z-10 max-w-lg">
            <h2 className="font-display text-3xl md:text-4xl font-black mb-3">Experience Premium Rides With KINGBS AUTO</h2>
            <p className="text-slate-300 mb-6">Comfortable, reliable, and stylish rides — book your dream car today.</p>
            <Link to="/inventory" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 transition-colors px-6 py-3 rounded-xl text-sm font-bold">
              Book Now <ArrowRight size={14} />
            </Link>
          </div>
          <CarIcon size={140} className="text-white/10 relative z-10" strokeWidth={1} />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <RoadDivider className="mx-auto mb-4 justify-center" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-400 text-sm mt-2">Simple steps to get your ride</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="bg-white rounded-2xl p-6 border border-slate-100 relative">
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
                  {s.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight size={16} className="hidden md:block absolute -right-3 top-8 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-900 text-white p-10 md:p-14 relative">
          <Quote size={40} className="text-white/30 mb-4" />
          <p className="font-display text-xl md:text-2xl leading-relaxed max-w-3xl mb-6">
            KINGBS AUTO made buying my car smooth and stress-free. The vehicle was exactly as described, and the service was excellent from start to finish.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold">RA</div>
            <div>
              <div className="font-semibold">Rasheed Adewale</div>
              <div className="text-white/70 text-sm">Verified Customer</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <RoadDivider className="mx-auto mb-4 justify-center" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">Why Choose <span className="text-brand-600">KINGBS AUTO</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUs.map((w, i) => (
            <div key={i} className="rounded-2xl p-6 bg-slate-50 border border-slate-100 hover:border-brand-300 hover:bg-brand-50/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mb-4">
                {w.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{w.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trusted brands ── */}
      <section className="py-14 border-y border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-slate-400 mb-8">Trusted by drivers of the best brands</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {['Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Lexus', 'Ford'].map(brand => (
              <span key={brand} className="font-display text-lg font-bold text-slate-300 hover:text-slate-500 transition-colors">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl p-12 border border-brand-100 bg-gradient-to-br from-brand-50 to-white">
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Ready to Find Your <span className="text-brand-600">Perfect Car?</span>
            </h2>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto">
              Browse thousands of verified listings or contact our team for a personalised recommendation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inventory" className="bg-brand-600 hover:bg-brand-700 transition-colors text-white px-8 py-4 rounded-xl text-base font-bold">
                Browse Inventory
              </Link>
              <Link to="/contact" className="border border-slate-200 hover:border-brand-400 hover:text-brand-600 transition-colors text-slate-700 px-8 py-4 rounded-xl text-base font-bold">
                Contact a Dealer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}