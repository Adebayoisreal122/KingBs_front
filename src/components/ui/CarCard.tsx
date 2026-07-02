import { Link } from 'react-router-dom';
import { Fuel, Gauge, Settings, Calendar, MapPin, Tag } from 'lucide-react';
import type { Car } from '../../types';

interface CarCardProps {
  car: Car;
  compact?: boolean;
}

const conditionBadge: Record<string, string> = {
  'New': 'bg-emerald-600',
  'Used': 'bg-slate-500',
  'Certified Pre-Owned': 'bg-blue-600',
};

const dealBadge: Record<string, string> = {
  'Hot Deal': 'bg-brand-600',
  'New Arrival': 'bg-emerald-600',
  'Price Drop': 'bg-purple-600',
};

export default function CarCard({ car, compact = false }: CarCardProps) {
  const primaryImage = car.images?.[0] || '';
  const discount = car.previousPrice
    ? Math.round(((car.previousPrice - car.price) / car.previousPrice) * 100)
    : 0;

  return (
    <Link to={`/cars/${car._id}`}
      className="block rounded-2xl overflow-hidden group bg-white border border-slate-100 shadow-sm
        hover:border-brand-200 hover:shadow-lg transition-all duration-300">

      {/* Image */}
      <div className={`relative overflow-hidden bg-slate-100 ${compact ? 'h-44' : 'h-52'}`}>
        {primaryImage ? (
          <img src={primaryImage} alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="text-4xl opacity-30">🚗</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${conditionBadge[car.condition]}`}>
            {car.condition}
          </span>
          {car.dealType && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${dealBadge[car.dealType]}`}>
              {car.dealType}
            </span>
          )}
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-brand-600 text-white shadow-md flex items-center justify-center text-xs font-bold">
            -{discount}%
          </div>
        )}

        {/* Not Available overlay */}
        {!car.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-widest uppercase opacity-90">Sold</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="mb-2">
          <span className="text-xs text-brand-600 font-semibold uppercase tracking-wider">{car.make}</span>
          <h3 className="font-display text-lg font-bold text-slate-900 leading-tight mt-0.5 group-hover:text-brand-600 transition-colors">
            {car.year} {car.model}
          </h3>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { icon: <Gauge size={12} />, val: car.mileage > 0 ? `${car.mileage.toLocaleString()} mi` : 'Brand New' },
            { icon: <Fuel size={12} />, val: car.fuelType },
            { icon: <Settings size={12} />, val: car.transmission },
            { icon: <Calendar size={12} />, val: car.year.toString() },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-brand-500">{s.icon}</span>
              {s.val}
            </div>
          ))}
        </div>

        {/* Location */}
        {car.location && (
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
            <MapPin size={11} /> {car.location}
          </div>
        )}

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            {car.previousPrice && car.previousPrice > car.price && (
              <div className="text-xs text-slate-400 line-through">
                ₦{car.previousPrice.toLocaleString()}
              </div>
            )}
            <div className="font-display text-2xl font-bold text-brand-600">
              ₦{car.price.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            <Tag size={11} className="text-brand-500" />
            {car.category}
          </div>
        </div>
      </div>
    </Link>
  );
}