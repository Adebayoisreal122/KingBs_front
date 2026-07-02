import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, Phone, Mail, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchCarById, submitEnquiry } from '../services/api';
import type { Car } from '../types';

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '', type: 'General' as const });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchCarById(id).then(r => { setCar(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;
    setSending(true); setSendError('');
    try {
      await submitEnquiry({ ...enquiryForm, carId: car._id, carTitle: `${car.year} ${car.make} ${car.model}` });
      setSent(true);
    } catch (err: any) { setSendError(err.message || 'Failed to send enquiry'); }
    finally { setSending(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20">
      <Loader2 size={40} className="animate-spin text-brand-600" />
    </div>
  );

  if (!car) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20 text-center px-6">
      <div className="text-6xl mb-4">🚗</div>
      <h2 className="font-display text-3xl text-slate-900 mb-2">Car Not Found</h2>
      <Link to="/inventory" className="bg-brand-600 hover:bg-brand-700 transition-colors text-white px-6 py-3 rounded-xl mt-4 text-sm font-bold">Back to Inventory</Link>
    </div>
  );

  const specs = [
    { label: 'Make', value: car.make },
    { label: 'Model', value: car.model },
    { label: 'Year', value: car.year },
    { label: 'Mileage', value: car.mileage > 0 ? `${car.mileage.toLocaleString()} miles` : 'Brand New' },
    { label: 'Condition', value: car.condition },
    { label: 'Transmission', value: car.transmission },
    { label: 'Fuel Type', value: car.fuelType },
    { label: 'Engine', value: car.engine },
    { label: 'Horsepower', value: `${car.horsepower} hp` },
    { label: 'Body Color', value: car.bodyColor },
    { label: 'Doors', value: car.doors },
    { label: 'Seats', value: car.seats },
    { label: 'Category', value: car.category },
    ...(car.vin ? [{ label: 'VIN', value: car.vin }] : []),
  ];

  const input = 'w-full px-4 py-3 rounded-xl text-sm bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400';

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back */}
        <Link to="/inventory" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Inventory
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left — Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-100">
              {car.images?.length > 0 ? (
                <>
                  <img src={car.images[imgIndex]} alt={car.title}
                    className="w-full h-80 md:h-[480px] object-cover" />
                  {car.images.length > 1 && (
                    <>
                      <button onClick={() => setImgIndex(i => (i - 1 + car.images.length) % car.images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-sm">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={() => setImgIndex(i => (i + 1) % car.images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-sm">
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {car.images.map((_, i) => (
                          <button key={i} onClick={() => setImgIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? 'bg-brand-600' : 'bg-white/70'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-80 flex items-center justify-center text-6xl opacity-20">🚗</div>
              )}

              {/* Thumbnails */}
              {car.images?.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-white">
                  {car.images.map((img, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === imgIndex ? 'border-brand-600' : 'border-transparent'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + Price */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-brand-600 font-semibold mb-1 uppercase tracking-wider">{car.make} · {car.category}</div>
                  <h1 className="font-display text-4xl font-black text-slate-900">{car.year} {car.model}</h1>
                  {car.location && <p className="text-slate-400 text-sm flex items-center gap-1 mt-2"><MapPin size={13} />{car.location}</p>}
                </div>
                <div className="text-right">
                  {car.previousPrice && car.previousPrice > car.price && (
                    <div className="text-slate-400 line-through text-sm">₦{car.previousPrice.toLocaleString()}</div>
                  )}
                  <div className="font-display text-4xl font-black text-brand-600">₦{car.price.toLocaleString()}</div>
                  {!car.isAvailable && <div className="text-red-600 text-sm font-semibold mt-1">SOLD</div>}
                </div>
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3">About This Vehicle</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{car.description}</p>
              </div>
            )}

            {/* Specs */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-display text-xl font-bold text-slate-900 mb-5">Vehicle Specifications</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {specs.map(s => (
                  <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-slate-100">
                    <span className="text-sm text-slate-400">{s.label}</span>
                    <span className="text-sm font-medium text-slate-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {car.features?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-display text-xl font-bold text-slate-900 mb-5">Key Features</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {car.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={15} className="text-brand-600 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Enquiry form */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-24">
              <h3 className="font-display text-xl font-bold text-slate-900 mb-1">Enquire About This Car</h3>
              <p className="text-slate-400 text-xs mb-5">Our team will respond within 24 hours</p>

              {sent ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">✅</div>
                  <h4 className="font-display text-xl font-bold text-slate-900 mb-2">Enquiry Sent!</h4>
                  <p className="text-slate-400 text-sm">We'll be in touch shortly.</p>
                  <button onClick={() => setSent(false)} className="mt-4 border border-brand-300 text-brand-600 hover:bg-brand-50 transition-colors px-5 py-2 rounded-xl text-sm font-semibold">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleEnquiry} className="space-y-3">
                  {sendError && <p className="text-red-600 text-sm">{sendError}</p>}
                  <input value={enquiryForm.name} onChange={e => setEnquiryForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Full Name *" required className={input} />
                  <input type="email" value={enquiryForm.email} onChange={e => setEnquiryForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Email Address *" required className={input} />
                  <input value={enquiryForm.phone} onChange={e => setEnquiryForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Phone Number" className={input} />
                  <select value={enquiryForm.type} onChange={e => setEnquiryForm(f => ({ ...f, type: e.target.value as any }))}
                    className={input}>
                    <option value="General">General Enquiry</option>
                    <option value="Test Drive">Book Test Drive</option>
                    <option value="Finance">Finance Options</option>
                    <option value="Trade-in">Trade-in Enquiry</option>
                  </select>
                  <textarea value={enquiryForm.message} onChange={e => setEnquiryForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Your message..." rows={4} className={`${input} resize-none`} />
                  <button type="submit" disabled={sending}
                    className="bg-brand-600 hover:bg-brand-700 transition-colors text-white w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                    {sending ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : 'Send Enquiry'}
                  </button>
                </form>
              )}

              {/* Quick contacts */}
              <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
                <a href="tel:+2348001234567" className="flex items-center gap-3 text-sm text-slate-500 hover:text-brand-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center"><Phone size={14} className="text-brand-600" /></div>
                  +234 800 123 4567
                </a>
                <a href="mailto:sales@kingbsauto.com" className="flex items-center gap-3 text-sm text-slate-500 hover:text-brand-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center"><Mail size={14} className="text-brand-600" /></div>
                  sales@kingbsauto.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}