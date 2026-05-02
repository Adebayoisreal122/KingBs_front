import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCars, createCar, updateCar, deleteCar } from '../services/api';
import { Plus, Trash2, Edit3, X, Loader2, AlertCircle, ImagePlus, Search, Eye } from 'lucide-react';
import type { Car } from '../types';

const emptyForm: Partial<Car> = {
  title: '', make: '', model: '', year: new Date().getFullYear(),
  price: 0, mileage: 0, condition: 'New', category: 'Sedan',
  transmission: 'Automatic', fuelType: 'Petrol', bodyColor: '',
  engine: '', horsepower: 0, doors: 4, seats: 5,
  description: '', features: [], images: [],
  isFeatured: false, isAvailable: true, dealType: '', location: '', vin: '',
};

const conditions = ['New', 'Used', 'Certified Pre-Owned'];
const categories = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Van', 'Electric', 'Luxury'];
const transmissions = ['Automatic', 'Manual', 'CVT'];
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const dealTypes = ['', 'Hot Deal', 'New Arrival', 'Price Drop'];
const makes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Lexus', 'Porsche', 'Other'];

export default function AdminCars() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('action') === 'new');
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Car>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);
  
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchCars({ limit: 200 } as any);
      setCars(res.data || []);
    } catch (e) { setCars([]); }
    finally { setLoading(false); }
  };
  
  const openNew = () => {
    setForm(emptyForm); setEditing(null); setFormError(''); setFeaturesInput(''); setShowForm(true);
  };

  const openEdit = (car: Car) => {
    setForm({ ...car }); setEditing(car._id);
    setFeaturesInput(car.features?.join(', ') || '');
    setFormError(''); setShowForm(true);
  };

  const set = (key: keyof Car, val) => setForm((prev: Partial<Car>) => ({ ...prev, [key]: val }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const valid = files.filter((f: File) => {
      if (!f.type.startsWith('image/')) return false;
      if (f.size > 3 * 1024 * 1024) { setFormError('Each image must be under 3MB'); return false; }
      return true;
    });
    setImageLoading(true); setFormError('');
    Promise.all(valid.map((file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))).then((base64: string[]) => {
      setForm((prev: Partial<Car>) => ({ ...prev, images: [...(prev.images || []), ...base64] }));
    }).catch(() => setFormError('Failed to process some images'))
      .finally(() => { setImageLoading(false); if (fileInputRef.current) fileInputRef.current.value = ''; });
  };

  const removeImage = (index: number) => {
    setForm((prev: Partial<Car>) => ({ ...prev, images: (prev.images || []).filter((_: string, i: number) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setFormError('');
    const payload = { ...form, features: featuresInput.split(',').map((s: string) => s.trim()).filter(Boolean) };
    try {
      if (editing) await updateCar(editing, payload);
      else await createCar(payload);
      setShowForm(false); setEditing(null); setForm(emptyForm); load();
    } catch (err) { setFormError(err.message || 'Failed to save car.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this car?')) return;
    setDeleting(id);
    try { await deleteCar(id); setCars((prev: Car[]) => prev.filter((x: Car) => x._id !== id)); }
    catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  const filtered = cars.filter((c: Car) =>
    `${c.year} ${c.make} ${c.model} ${c.title}`.toLowerCase().includes(search.toLowerCase())
  );

  const card = 'glass rounded-2xl border border-white/8';
  const inp = 'w-full px-3 py-2.5 rounded-xl text-sm input-dark';
  const lbl = 'block text-xs text-gray-400 mb-1.5 uppercase tracking-wider';

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-white">Cars</h2>
          <p className="text-sm text-gray-400 mt-1">{cars.length} total listings</p>
        </div>
        <button onClick={openNew} className="btn-brand px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 font-bold">
          <Plus size={16} /> Add New Car
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cars..."
          className="input-dark w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" />
      </div>

      {/* ── Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto flex items-start justify-center p-4">
          <div className="w-full max-w-3xl my-6 glass rounded-3xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/8">
              <h3 className="font-display text-xl font-black text-white">{editing ? 'Edit Car Listing' : 'Add New Car'}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="p-7 overflow-y-auto" style={{ maxHeight: '80vh' }}>
              {formError && (
                <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{formError}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className={lbl}>Listing Title</label>
                  <input value={form.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="e.g. 2024 BMW 5 Series xDrive" className={inp} />
                </div>
                {/* Make / Model / Year */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={lbl}>Make *</label>
                    <select value={form.make || ''} onChange={(e) => set('make', e.target.value)} required className={`${inp} bg-dark-700`}>
                      <option value="">Select</option>
                      {makes.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Model *</label>
                    <input value={form.model || ''} onChange={(e) => set('model', e.target.value)} placeholder="Model" required className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Year *</label>
                    <input type="number" value={form.year || ''} onChange={(e) => set('year', Number(e.target.value))} placeholder="2024" required min="1990" max="2030" className={inp} />
                  </div>
                </div>
                {/* Pricing */}
                <div className="pt-3 border-t border-white/8">
                  <h4 className="font-display font-bold text-brand-400 text-sm uppercase tracking-wider mb-3">Pricing</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={lbl}>Price ($) *</label>
                    <input type="number" value={form.price || ''} onChange={(e) => set('price', Number(e.target.value))} placeholder="0" required min="0" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Previous Price ($)</label>
                    <input type="number" value={form.previousPrice || ''} onChange={(e) => set('previousPrice', Number(e.target.value) || undefined)} placeholder="Optional" min="0" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Mileage (mi)</label>
                    <input type="number" value={form.mileage || ''} onChange={(e) => set('mileage', Number(e.target.value))} placeholder="0" min="0" className={inp} />
                  </div>
                </div>
                {/* Vehicle Details */}
                <div className="pt-3 border-t border-white/8">
                  <h4 className="font-display font-bold text-brand-400 text-sm uppercase tracking-wider mb-3">Vehicle Details</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Condition *</label>
                    <select value={form.condition || 'New'} onChange={(e) => set('condition', e.target.value)} required className={`${inp} bg-dark-700`}>
                      {conditions.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Category *</label>
                    <select value={form.category || 'Sedan'} onChange={(e) => set('category', e.target.value)} required className={`${inp} bg-dark-700`}>
                      {categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Transmission</label>
                    <select value={form.transmission || 'Automatic'} onChange={(e) => set('transmission', e.target.value)} className={`${inp} bg-dark-700`}>
                      {transmissions.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Fuel Type</label>
                    <select value={form.fuelType || 'Petrol'} onChange={(e) => set('fuelType', e.target.value)} className={`${inp} bg-dark-700`}>
                      {fuelTypes.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Engine</label>
                    <input value={form.engine || ''} onChange={(e) => set('engine', e.target.value)} placeholder="e.g. 2.0L Turbocharged" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Horsepower</label>
                    <input type="number" value={form.horsepower || ''} onChange={(e) => set('horsepower', Number(e.target.value))} placeholder="0" min="0" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Body Color</label>
                    <input value={form.bodyColor || ''} onChange={(e) => set('bodyColor', e.target.value)} placeholder="e.g. Midnight Black" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Location</label>
                    <input value={form.location || ''} onChange={(e) => set('location', e.target.value)} placeholder="City, State" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Doors</label>
                    <input type="number" value={form.doors || 4} onChange={(e) => set('doors', Number(e.target.value))} min="2" max="6" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Seats</label>
                    <input type="number" value={form.seats || 5} onChange={(e) => set('seats', Number(e.target.value))} min="1" max="12" className={inp} />
                  </div>
                </div>
                <div>
                  <label className={lbl}>VIN (optional)</label>
                  <input value={form.vin || ''} onChange={(e) => set('vin', e.target.value)} placeholder="Vehicle Identification Number" className={inp} />
                </div>
                {/* Listing Settings */}
                <div className="pt-3 border-t border-white/8">
                  <h4 className="font-display font-bold text-brand-400 text-sm uppercase tracking-wider mb-3">Listing Settings</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Deal Type</label>
                    <select value={form.dealType || ''} onChange={(e) => set('dealType', e.target.value)} className={`${inp} bg-dark-700`}>
                      {dealTypes.map((d) => <option key={d} value={d}>{d || 'None'}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-3 pt-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.isFeatured || false} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-orange-500" />
                      <span className="text-sm text-gray-300">Featured on homepage</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.isAvailable !== false} onChange={(e) => set('isAvailable', e.target.checked)} className="w-4 h-4 accent-green-500" />
                      <span className="text-sm text-gray-300">Available for sale</span>
                    </label>
                  </div>
                </div>
                {/* Description */}
                <div className="pt-3 border-t border-white/8">
                  <h4 className="font-display font-bold text-brand-400 text-sm uppercase tracking-wider mb-3">Description & Features</h4>
                </div>
                <div>
                  <label className={lbl}>Description</label>
                  <textarea value={form.description || ''} onChange={(e) => set('description', e.target.value)} rows={4} placeholder="Describe the vehicle..." className={`${inp} resize-none`} />
                </div>
                <div>
                  <label className={lbl}>Features (comma-separated)</label>
                  <input value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} placeholder="Sunroof, Leather Seats, Bluetooth..." className={inp} />
                </div>
                {/* Photos */}
                <div className="pt-3 border-t border-white/8">
                  <h4 className="font-display font-bold text-brand-400 text-sm uppercase tracking-wider mb-3">Photos</h4>
                </div>
                {(form.images || []).length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {(form.images || []).map((img: string, i: number) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={11} className="text-white" />
                        </button>
                        {i === 0 && <div className="absolute bottom-1 left-1 text-xs bg-brand-600/90 text-white px-1.5 py-0.5 rounded-md">Main</div>}
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageLoading}
                  className="w-full h-24 rounded-xl border-2 border-dashed border-white/15 hover:border-brand-500/50 hover:bg-brand-500/5 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-brand-400 transition-all disabled:opacity-50">
                  {imageLoading
                    ? <><Loader2 size={18} className="animate-spin" /><span className="text-xs">Processing...</span></>
                    : <><ImagePlus size={18} /><span className="text-xs font-medium">Upload Photos (max 3MB each)</span></>
                  }
                </button>
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={saving}
                    className="btn-brand flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                    {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : editing ? 'Update Car' : 'Publish Listing'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-5 rounded-xl text-sm border border-white/15 text-gray-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Cars Table ── */}
      {loading ? (
        <div className={`${card} p-6 flex items-center justify-center py-16`}>
          <Loader2 size={28} className="animate-spin text-brand-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${card} p-6 text-center py-16`}>
          <div className="text-5xl mb-3">🚗</div>
          <p className="text-gray-400">No cars found. Add your first listing!</p>
        </div>
      ) : (
        <div className={`${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-gray-500">
                  {['Vehicle', 'Price', 'Condition', 'Category', 'Deal', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-4 font-medium text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((car: Car) => (
                  <tr key={car._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-dark-600 flex-shrink-0">
                          {car.images?.[0]
                            ? <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center opacity-20 text-lg">🚗</div>
                          }
                        </div>
                        <div>
                          <div className="font-medium text-white whitespace-nowrap">{car.year} {car.make} {car.model}</div>
                          <div className="text-xs text-gray-500">{car.location || '—'}</div>
                        </div>
                        {car.isFeatured && <span className="text-yellow-400 text-xs">⭐</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-display font-bold text-brand-400 whitespace-nowrap">#{car.price.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${car.condition === 'New' ? 'bg-green-500/15 text-green-400' : car.condition === 'Used' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'}`}>
                        {car.condition}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">{car.category}</td>
                    <td className="px-5 py-3.5">
                      {car.dealType ? <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400">{car.dealType}</span> : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${car.isAvailable ? 'bg-green-500/15 text-green-400' : 'bg-gray-500/15 text-gray-400'}`}>
                        {car.isAvailable ? 'Available' : 'Sold'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <a href={`/cars/${car._id}`} target="_blank" rel="noreferrer"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors">
                          <Eye size={14} />
                        </a>
                        <button onClick={() => openEdit(car)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDelete(car._id)} disabled={deleting === car._id}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                          {deleting === car._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
