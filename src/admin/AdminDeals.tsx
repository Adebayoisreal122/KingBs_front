import { useState, useEffect } from 'react';
import { fetchCars, updateCar } from '../services/api';
import { Flame, Star, TrendingDown, Loader2, Tag } from 'lucide-react';
import type { Car } from '../types';

const dealTypes = ['Hot Deal', 'New Arrival', 'Price Drop'] as const;
type DealType = typeof dealTypes[number];

const dealConfig: Record<DealType, { icon: React.ReactNode; color: string; bg: string }> = {
  'Hot Deal':    { icon: <Flame size={15} />, color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
  'New Arrival': { icon: <Star size={15} />, color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' },
  'Price Drop':  { icon: <TrendingDown size={15} />, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
};


export default function AdminDeals() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DealType | 'All'>('All');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCars({ limit: 200 })
      .then(r => { setCars(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleDeal = async (car: Car, dealType: DealType) => {
    setUpdating(car._id);
    try {
      const newDeal = car.dealType === dealType ? '' : dealType;
      const res = await updateCar(car._id, { dealType: newDeal });
      setCars(prev => prev.map(c => c._id === car._id ? res.data : c));
    } catch (error: unknown) {
  console.error(error);

  alert(
    error instanceof Error
      ? error.message
      : 'Failed to update deal'
  );
}
    finally { setUpdating(null); }
  };

  const toggleFeatured = async (car: Car) => {
    setUpdating(car._id + '-f');
    try {
      const res = await updateCar(car._id, { isFeatured: !car.isFeatured });
      setCars(prev => prev.map(c => c._id === car._id ? res.data : c));
    } catch (error: unknown) {
  console.error(error);

  alert(
    error instanceof Error
      ? error.message
      : 'Failed to update'
  );
}
    finally { setUpdating(null); }
  };

  const displayed = activeTab === 'All' ? cars : cars.filter(c => c.dealType === activeTab);
  const card = 'glass rounded-2xl border border-white/8';

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-display text-2xl font-black text-white">Deals Manager</h2>
        <p className="text-sm text-gray-400 mt-1">Assign deal tags and feature cars to drive sales</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Featured', count: cars.filter(c => c.isFeatured).length, icon: '⭐', color: 'from-yellow-600 to-yellow-700' },
          ...dealTypes.map(d => ({ label: d, count: cars.filter(c => c.dealType === d).length, icon: d === 'Hot Deal' ? '🔥' : d === 'New Arrival' ? '✨' : '💰', color: 'from-brand-600 to-brand-700' })),
        ].map(s => (
          <div key={s.label} className={`${card} p-4`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display text-3xl font-black text-white">{s.count}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['All', ...dealTypes] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all
              ${activeTab === tab ? 'btn-brand' : 'border border-white/15 text-gray-400 hover:border-brand-500/40 hover:text-brand-400'}`}>
            {tab === 'Hot Deal' ? '🔥' : tab === 'New Arrival' ? '✨' : tab === 'Price Drop' ? '💰' : '📋'}
            {tab} {tab !== 'All' && `(${cars.filter(c => c.dealType === tab).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={`${card} p-6 flex items-center justify-center py-16`}>
          <Loader2 size={28} className="animate-spin text-brand-400" />
        </div>
      ) : displayed.length === 0 ? (
        <div className={`${card} p-6 text-center py-14`}>
          <Tag size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">No cars in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(car => (
            <div key={car._id} className={`${card} p-4 flex items-center gap-4`}>
              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-xl overflow-hidden bg-dark-600 flex-shrink-0">
                {car.images?.[0]
                  ? <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xl opacity-20">🚗</div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">{car.year} {car.make} {car.model}</div>
                <div className="text-brand-400 font-display font-bold text-sm">#{car.price.toLocaleString()}</div>
              </div>

              {/* Deal Type Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Featured toggle */}
                <button onClick={() => toggleFeatured(car)} disabled={updating === car._id + '-f'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border
                    ${car.isFeatured ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'border-white/10 text-gray-500 hover:border-yellow-500/30 hover:text-yellow-400'}`}>
                  {updating === car._id + '-f' ? <Loader2 size={11} className="animate-spin" /> : '⭐'}
                  Featured
                </button>

                {dealTypes.map(dtype => {
                  const config = dealConfig[dtype];
                  const isActive = car.dealType === dtype;
                  return (
                    <button key={dtype} onClick={() => toggleDeal(car, dtype)}
                      disabled={updating === car._id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border
                        ${isActive ? `${config.bg} ${config.color}` : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}>
                      {updating === car._id ? <Loader2 size={11} className="animate-spin" /> : config.icon}
                      {dtype}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
