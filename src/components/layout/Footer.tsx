import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const TikTokIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-24 h-10 rounded-xl shadow-lg flex items-center justify-center">
                <img src="/logoKing.png" alt="" />
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Your trusted destination for premium new and used vehicles. Quality cars, transparent pricing.
            </p>
            <div className="flex gap-2">
              {[
                { icon: <FacebookIcon />, href: '#', hover: 'hover:text-blue-400' },
                { icon: <InstagramIcon />, href: '#', hover: 'hover:text-pink-400' },
                { icon: <TikTokIcon />, href: '#', hover: 'hover:text-white' },
                { icon: <YoutubeIcon />, href: '#', hover: 'hover:text-red-400' },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-colors ${s.hover}`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider uppercase mb-4 text-brand-400">Inventory</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'New Cars', href: '/inventory?condition=New' },
                { label: 'Used Cars', href: '/inventory?condition=Used' },
                { label: 'Certified Pre-Owned', href: '/inventory?condition=Certified Pre-Owned' },
                { label: 'SUVs', href: '/inventory?category=SUV' },
                { label: 'Electric Vehicles', href: '/inventory?category=Electric' },
                { label: 'Luxury Cars', href: '/inventory?category=Luxury' },
                { label: 'Hot Deals', href: '/deals' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider uppercase mb-4 text-brand-400">Services</h4>
            <ul className="space-y-2 text-sm">
              {['Finance Options', 'Trade-In Valuation', 'Test Drive', 'Car History Report', 'After-Sales Service', 'Warranty Plans'].map(s => (
                <li key={s}><a href="/contact" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wider uppercase mb-4 text-brand-400">Contact Us</h4>
            <div className="space-y-3 text-sm">
              {[
                { icon: <MapPin size={14} className="text-brand-400 flex-shrink-0 mt-0.5" />, val: 'Ibadan, Oyo State, Nigeria' },
                { icon: <Phone size={14} className="text-brand-400 flex-shrink-0" />, val: '+234 800 123 4567' },
                { icon: <Mail size={14} className="text-brand-400 flex-shrink-0" />, val: 'sales@kingbsauto.com' },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-2">{c.icon}<span>{c.val}</span></div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-medium text-white mb-1">Opening Hours</p>
              <p className="text-xs">Mon–Fri: 9am – 7pm</p>
              <p className="text-xs">Sat: 10am – 5pm</p>
              <p className="text-xs">Sun: Closed</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KINGBS AUTO Premium Motors. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <Link to="/admin/login" className="hover:text-slate-300 transition-colors">Dealer Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}