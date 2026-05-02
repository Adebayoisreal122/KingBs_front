import { useState } from 'react';
import {
  Link,
  useLocation,
  Outlet,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
  Car,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Menu,
  LogOut,
  ChevronRight,
  Tag,
} from 'lucide-react';

const navItems = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    exact: true,
  },
  {
    path: '/admin/cars',
    label: 'Cars',
    icon: <Car size={18} />,
  },
  {
    path: '/admin/deals',
    label: 'Deals',
    icon: <Tag size={18} />,
  },
  {
    path: '/admin/enquiries',
    label: 'Enquiries',
    icon: <MessageSquare size={18} />,
  },
  {
    path: '/admin/settings',
    label: 'Settings',
    icon: <Settings size={18} />,
  },
];

interface SidebarProps {
  admin: {
    name?: string;
    email?: string;
  } | null;

  handleLogout: () => void;

  isActive: (
    path: string,
    exact?: boolean
  ) => boolean;

  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

function Sidebar({
  admin,
  handleLogout,
  isActive,
  setSidebarOpen,
}: SidebarProps) {
  return (
    <div className="h-full flex flex-col admin-sidebar bg-dark-800 border-r border-white/8">
      {/* Logo */}
      <div className="p-6 border-b border-white/8">
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center">
            <Car
              size={17}
              className="text-white"
            />
          </div>

          <div>
            <div className="font-display text-sm font-bold text-white">
              KINGBS
              <span className="brand-text">
                AUTO
              </span>
            </div>

            <div className="text-xs text-gray-500">
              Admin Portal
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(
            item.path,
            item.exact
          );

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() =>
                setSidebarOpen(false)
              }
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group
              ${
                active
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span
                className={
                  active
                    ? 'text-brand-400'
                    : 'text-gray-500 group-hover:text-gray-300'
                }
              >
                {item.icon}
              </span>

              <span className="text-sm font-medium flex-1">
                {item.label}
              </span>

              {active && (
                <ChevronRight
                  size={13}
                  className="text-brand-400"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/8 space-y-2">
        {admin && (
          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white text-xs font-bold">
              {admin.name?.[0] || 'A'}
            </div>

            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-300 truncate">
                {admin.name}
              </div>

              <div className="text-xs text-gray-500 truncate">
                {admin.email}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const isActive = (
    path: string,
    exact?: boolean
  ) =>
    exact
      ? location.pathname === path
      : location.pathname === path ||
        location.pathname.startsWith(
          path + '/'
        );

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const pageTitle =
    navItems.find((n) =>
      isActive(n.path, n.exact)
    )?.label || 'Admin';

  return (
    <div className="min-h-screen flex bg-dark-900 text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-56 flex-shrink-0 h-screen sticky top-0">
        <Sidebar
          admin={admin}
          handleLogout={handleLogout}
          isActive={isActive}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-56 h-full flex-shrink-0">
            <Sidebar
              admin={admin}
              handleLogout={handleLogout}
              isActive={isActive}
              setSidebarOpen={
                setSidebarOpen
              }
            />
          </div>

          <div
            className="flex-1 bg-black/60"
            onClick={() =>
              setSidebarOpen(false)
            }
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b border-white/8 nav-glass bg-dark-900/90">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="lg:hidden p-2"
            >
              <Menu size={20} />
            </button>

            <h1 className="font-display font-bold text-lg">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/inventory"
              target="_blank"
              className="text-xs text-gray-400 hover:text-brand-400 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-brand-500/30"
            >
              View Site ↗
            </Link>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white text-xs font-bold">
              {admin?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}