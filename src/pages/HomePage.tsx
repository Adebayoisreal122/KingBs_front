import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, Award, Headphones, ArrowRight, Zap } from 'lucide-react';
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
  { icon: <Shield size={24} />, title: 'Certified Quality', desc: 'Every car undergoes a 150-point inspection before listing.' },
  { icon: <Star size={24} />, title: 'Best Price Guarantee', desc: 'Find a better deal? We will match or beat any competitor.' },
  { icon: <Award size={24} />, title: 'Trusted Dealer', desc: 'Over 10 years serving customers with integrity and care.' },
  { icon: <Headphones size={24} />, title: '24/7 Support', desc: 'Our team is always available to assist you before and after purchase.' },
];

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
          fetchCars({ isFeatured: true, limit: 6 } as any),
          fetchCars({ dealType: 'Hot Deal', limit: 4 } as any),
          fetchCars({ dealType: 'New Arrival', limit: 4 } as any),
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
    <div className="min-h-screen bg-dark-900">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/90 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/60 z-10" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-500/5 to-transparent z-5" />
          {/* Decorative grid */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 mb-6">
              <Zap size={13} className="text-brand-400" />
              <span className="text-brand-300 text-xs font-semibold tracking-wider uppercase">Premium Auto Dealership</span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-black text-white leading-none mb-6 uppercase tracking-tight">
              FIND YOUR<br />
              <span className="brand-text">DREAM CAR</span><br />
              TODAY
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-10">
              Explore thousands of premium new and used vehicles. Transparent pricing, verified history, and unbeatable deals.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-xl">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search make, model, or keyword..."
                  className="input-dark w-full pl-11 pr-4 py-4 rounded-xl text-sm" />
              </div>
              <button type="submit" className="btn-brand px-6 py-4 rounded-xl text-sm font-bold whitespace-nowrap">
                Search
              </button>
            </form>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2">
              {['New Cars', 'Used Cars', 'Under #1M', 'SUVs', 'Electric'].map(tag => (
                <a key={tag} href={`/inventory?search=${tag}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-gray-400 hover:border-brand-500/50 hover:text-brand-400 transition-colors">
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <div className="w-px h-12 bg-gradient-to-b from-brand-500 to-transparent" />
          <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-white/8 bg-dark-800">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '2,400+', label: 'Cars Available' },
              { n: '15K+', label: 'Happy Customers' },
              { n: '10+', label: 'Years of Trust' },
              { n: '50+', label: 'Premium Brands' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl font-black brand-text">{s.n}</div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="divider-brand mb-3" />
            <h2 className="font-display text-4xl font-bold text-white uppercase">Browse by <span className="brand-text">Category</span></h2>
          </div>
          <Link to="/inventory" className="text-sm text-brand-400 flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map(c => (
            <a key={c.label} href={c.href}
              className="glass rounded-2xl p-4 text-center group hover:border-brand-500/40 hover:bg-brand-500/5 transition-all cursor-pointer">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.emoji}</div>
              <div className="text-xs font-semibold text-gray-400 group-hover:text-brand-400 transition-colors">{c.label}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Featured Cars ── */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="divider-brand mb-3" />
              <h2 className="font-display text-4xl font-bold text-white uppercase">Featured <span className="brand-text">Vehicles</span></h2>
              <p className="text-gray-400 text-sm mt-2">Hand-picked premium cars for discerning buyers</p>
            </div>
            <Link to="/inventory" className="text-sm text-brand-400 flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-dark-700 animate-pulse" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(car => <CarCard key={car._id} car={car} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-3">🚗</div>
              <p>No featured cars yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Hot Deals ── */}
      {hotDeals.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="divider-brand mb-3" />
              <h2 className="font-display text-4xl font-bold text-white uppercase flex items-center gap-3">
                🔥 <span className="brand-text">Hot Deals</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2">Limited-time offers — act fast before they're gone</p>
            </div>
            <Link to="/deals" className="text-sm text-brand-400 flex items-center gap-1 hover:gap-2 transition-all">
              All Deals <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotDeals.map(car => <CarCard key={car._id} car={car} compact />)}
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="py-20 bg-dark-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="divider-brand mb-3" />
                <h2 className="font-display text-4xl font-bold text-white uppercase">✨ New <span className="brand-text">Arrivals</span></h2>
              </div>
              <Link to="/inventory?dealType=New Arrival" className="text-sm text-brand-400 flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(car => <CarCard key={car._id} car={car} compact />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose Us ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="divider-brand mx-auto mb-4" />
          <h2 className="font-display text-4xl font-bold text-white uppercase">Why Choose <span className="brand-text">KINGBS AUTO</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUs.map((w, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:border-brand-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400 mb-4">
                {w.icon}
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">{w.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="glass rounded-3xl p-12 border border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-transparent">
            <h2 className="font-display text-5xl font-black text-white uppercase mb-4">
              Ready to Find Your<br /><span className="brand-text">Perfect Car?</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Browse thousands of verified listings or contact our team for a personalised recommendation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inventory" className="btn-brand px-8 py-4 rounded-xl text-base font-bold">
                Browse Inventory
              </Link>
              <Link to="/contact" className="btn-outline-brand px-8 py-4 rounded-xl text-base font-bold">
                Contact a Dealer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
