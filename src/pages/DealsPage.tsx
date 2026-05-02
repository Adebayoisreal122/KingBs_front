import { useState, useEffect } from 'react';
import { Zap, TrendingDown, Star } from 'lucide-react';
import { fetchCars } from '../services/api';
import CarCard from '../components/ui/CarCard';
import type { Car } from '../types';

const dealTabs = [
  { label: '🔥 Hot Deals', value: 'Hot Deal', icon: <Zap size={15} /> },
  { label: '✨ New Arrivals', value: 'New Arrival', icon: <Star size={15} /> },
  { label: '💰 Price Drops', value: 'Price Drop', icon: <TrendingDown size={15} /> },
];

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState('Hot Deal');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCars({ dealType: activeTab, limit: 20 } as any)
      .then(r => { setCars(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Header */}
      <div className="bg-dark-800 border-b border-white/8 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl font-black text-white uppercase mb-3">
            Special <span className="brand-text">Deals</span>
          </h1>
          <p className="text-gray-400">Exclusive offers and limited-time prices on premium vehicles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {dealTabs.map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all
                ${activeTab === tab.value ? 'btn-brand' : 'border border-white/15 text-gray-400 hover:border-brand-500/40 hover:text-brand-400'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-dark-700 animate-pulse" />)}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">No {activeTab}s Right Now</h3>
            <p className="text-gray-400">Check back soon — we update deals regularly</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map(car => <CarCard key={car._id} car={car} compact />)}
          </div>
        )}
      </div>
    </div>
  );
}
