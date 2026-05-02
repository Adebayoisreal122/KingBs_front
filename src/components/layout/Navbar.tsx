import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, Phone } from 'lucide-react';

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
    <nav className={`fixed top-0 left-0 right-0 z-50 nav-glass transition-all duration-300
      ${scrolled ? 'bg-dark-900/95 border-b border-white/8 shadow-xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center shadow-lg group-hover:shadow-brand-500/40 transition-shadow">
            <Car size={20} className="text-white" />
          </div>
          <div>
            <div className="font-display text-xl font-bold tracking-wide text-white leading-none">
              KINGBS<span className="brand-text">AUTO</span>
            </div>
            <div className="text-xs text-gray-500 tracking-widest uppercase">Premium Motors</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(l => (
            <a key={l.label} href={l.href}
              className={`text-sm font-medium transition-colors hover:text-brand-400
                ${location.pathname === l.href.split('?')[0] ? 'text-brand-400' : 'text-gray-300'}`}>
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <Phone size={15} className="text-brand-500" />
            +1 (234) 567-890
          </a>
          <Link to="/inventory" className="btn-brand px-5 py-2.5 rounded-xl text-sm">
            Browse Cars
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-dark-900/98 border-t border-white/8 px-6 pb-6 pt-3 space-y-3">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-300 border-b border-white/5 hover:text-brand-400 transition-colors">
              {l.label}
            </a>
          ))}
          <Link to="/inventory" onClick={() => setOpen(false)}
            className="block btn-brand px-5 py-3 rounded-xl text-sm text-center mt-4">
            Browse All Cars
          </Link>
        </div>
      )}
    </nav>
  );
}
