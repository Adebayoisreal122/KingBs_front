import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'New Cars', href: '/inventory?condition=New' },
  { label: 'Used Cars', href: '/inventory?condition=Used' },
  { label: 'Deals', href: '/deals' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300
      ${scrolled ? 'bg-transparent/40 border-b border-gray-500 shadow-sm' : 'bg-transparent/10 border-b border-gray-200 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 group">
          <div className="w-24  h-11  flex items-center justify-center">
           <img src="/logoKing.png" alt="Logo" />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(l => (
            <a key={l.label} href={l.href}
              className={`text-sm font-medium transition-colors hover:text-brand-600
                ${location.pathname === l.href.split('?')[0] ? 'text-brand-600' : 'text-slate-600'}`}>
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-5">
          <a href="tel:+2348001234567" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <Phone size={15} className="text-brand-600" />
            +234 800 123 4567
          </a>
          <Link to="/inventory" className="bg-brand-600 hover:bg-brand-700 transition-colors text-white px-5 py-2.5 rounded-xl text-sm font-bold">
            Browse Cars
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-slate-900">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 pb-6 pt-3 space-y-3">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-600 border-b border-slate-100 hover:text-brand-600 transition-colors">
              {l.label}
            </a>
          ))}
          <Link to="/inventory" onClick={() => setOpen(false)}
            className="block bg-brand-600 hover:bg-brand-700 transition-colors text-white px-5 py-3 rounded-xl text-sm font-bold text-center mt-4">
            Browse All Cars
          </Link>
        </div>
      )}
    </nav>
  );
}