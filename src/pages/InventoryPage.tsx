import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { fetchCars } from '../services/api';
import CarCard from '../components/ui/CarCard';
import type { Car, CarFilters } from '../types';

const makes = ['Any', 'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Lexus', 'Porsche'];
const categories = ['Any', 'Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Van', 'Electric', 'Luxury'];
const conditions = ['Any', 'New', 'Used', 'Certified Pre-Owned'];
const transmissions = ['Any', 'Automatic', 'Manual', 'CVT'];
const fuelTypes = ['Any', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const sortOptions = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Year: Newest', value: '-year' },
  { label: 'Mileage: Lowest', value: 'mileage' },
];

const defaultFilters: CarFilters = {
  search: '', category: '', condition: '', make: '',
  minPrice: '', maxPrice: '', minYear: '', maxYear: '',
  transmission: '', fuelType: '', sortBy: '-createdAt',
};

export default function InventoryPage() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<CarFilters>({
    ...defaultFilters,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
  });

  useEffect(() => {
    load();
  }, [filters, page]);

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12, sortBy: filters.sortBy };
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'Any') params.category = filters.category;
      if (filters.condition && filters.condition !== 'Any') params.condition = filters.condition;
      if (filters.make && filters.make !== 'Any') params.make = filters.make;
      if (filters.minPrice !== '') params.minPrice = filters.minPrice as number;
      if (filters.maxPrice !== '') params.maxPrice = filters.maxPrice as number;
      if (filters.minYear !== '') params.minYear = filters.minYear as number;
      if (filters.maxYear !== '') params.maxYear = filters.maxYear as number;
      if (filters.transmission && filters.transmission !== 'Any') params.transmission = filters.transmission;
      if (filters.fuelType && filters.fuelType !== 'Any') params.fuelType = filters.fuelType;

      const res = await fetchCars(params as any);
      setCars(res.data || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch (e) { setCars([]); }
    finally { setLoading(false); }
  };

  const setFilter = (key: keyof CarFilters, val: string | number) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  };

  const clearFilters = () => { setFilters(defaultFilters); setPage(1); };

  const activeFiltersCount = Object.entries(filters).filter(([k, v]) =>
    v !== '' && v !== 'Any' && v !== '-createdAt' && k !== 'sortBy'
  ).length;

  const SelectFilter = ({ label, value, options, filterKey }: { label: string; value: string; options: string[]; filterKey: keyof CarFilters }) => (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select value={value} onChange={e => setFilter(filterKey, e.target.value)}
          className="w-full appearance-none input-dark px-3 py-2.5 rounded-xl text-sm pr-8">
          {options.map(o => <option key={o} value={o === 'Any' ? '' : o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Header */}
      <div className="bg-dark-800 border-b border-white/8 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-4xl font-black text-white uppercase mb-2">
            Car <span className="brand-text">Inventory</span>
          </h1>
          <p className="text-gray-400 text-sm">{total} vehicles available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* ── Sidebar Filters ── */}
          <aside className={`${filtersOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} lg:relative lg:flex lg:flex-col w-72 flex-shrink-0`}>
            <div className={`${filtersOpen ? 'fixed inset-0 bg-black/60 lg:hidden' : ''}`} onClick={() => setFiltersOpen(false)} />
            <div className={`${filtersOpen ? 'fixed top-0 left-0 h-full z-50 overflow-y-auto' : ''} lg:sticky lg:top-24 w-72 bg-dark-800 border border-white/8 rounded-2xl p-5 space-y-5`}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">Filters {activeFiltersCount > 0 && <span className="text-brand-400">({activeFiltersCount})</span>}</h3>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-brand-400 hover:text-brand-300">Clear all</button>
                  )}
                  <button onClick={() => setFiltersOpen(false)} className="lg:hidden p-1">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={filters.search} onChange={e => setFilter('search', e.target.value)}
                    placeholder="Make, model, keyword..."
                    className="input-dark w-full pl-8 pr-3 py-2.5 rounded-xl text-sm" />
                </div>
              </div>

              <SelectFilter label="Category" value={filters.category} options={categories} filterKey="category" />
              <SelectFilter label="Condition" value={filters.condition} options={conditions} filterKey="condition" />
              <SelectFilter label="Make" value={filters.make} options={makes} filterKey="make" />

              {/* Price range */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min #" value={filters.minPrice}
                    onChange={e => setFilter('minPrice', e.target.value ? Number(e.target.value) : '')}
                    className="input-dark px-3 py-2.5 rounded-xl text-sm" />
                  <input type="number" placeholder="Max #" value={filters.maxPrice}
                    onChange={e => setFilter('maxPrice', e.target.value ? Number(e.target.value) : '')}
                    className="input-dark px-3 py-2.5 rounded-xl text-sm" />
                </div>
              </div>

              {/* Year range */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">Year Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="From" value={filters.minYear}
                    onChange={e => setFilter('minYear', e.target.value ? Number(e.target.value) : '')}
                    className="input-dark px-3 py-2.5 rounded-xl text-sm" />
                  <input type="number" placeholder="To" value={filters.maxYear}
                    onChange={e => setFilter('maxYear', e.target.value ? Number(e.target.value) : '')}
                    className="input-dark px-3 py-2.5 rounded-xl text-sm" />
                </div>
              </div>

              <SelectFilter label="Transmission" value={filters.transmission} options={transmissions} filterKey="transmission" />
              <SelectFilter label="Fuel Type" value={filters.fuelType} options={fuelTypes} filterKey="fuelType" />
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-sm text-gray-300">
                <SlidersHorizontal size={15} />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>

              <p className="text-sm text-gray-400 hidden md:block">
                Showing <span className="text-white font-medium">{cars.length}</span> of {total} results
              </p>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-500">Sort:</span>
                <div className="relative">
                  <select value={filters.sortBy} onChange={e => setFilter('sortBy', e.target.value)}
                    className="input-dark appearance-none pl-3 pr-8 py-2 rounded-xl text-sm">
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Cars grid */}
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => <div key={i} className="h-80 rounded-2xl bg-dark-700 animate-pulse" />)}
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">No cars found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-brand px-6 py-3 rounded-xl text-sm">Clear Filters</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map(car => <CarCard key={car._id} car={car} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 rounded-xl border border-white/15 text-sm text-gray-400 disabled:opacity-30 hover:border-brand-500/50 hover:text-brand-400 transition-colors">
                  Prev
                </button>
                {[...Array(pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors
                      ${page === i + 1 ? 'btn-brand' : 'border border-white/15 text-gray-400 hover:border-brand-500/50 hover:text-brand-400'}`}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl border border-white/15 text-sm text-gray-400 disabled:opacity-30 hover:border-brand-500/50 hover:text-brand-400 transition-colors">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
