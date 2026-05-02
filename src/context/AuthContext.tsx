import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginAdmin, getMe } from '../services/api';
import type { Admin } from '../types';

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAdmin: (admin: Admin) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auto-token');
    if (!token) { setLoading(false); return; }
    getMe()
      .then((res) => setAdmin(res.admin))
      .catch(() => localStorage.removeItem('auto-token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginAdmin(email, password);
    localStorage.setItem('auto-token', res.token);
    setAdmin(res.admin);
  };

  const logout = () => {
    localStorage.removeItem('auto-token');
    setAdmin(null);
  };

  const refreshAdmin = (updated: Admin) => setAdmin(updated);

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, loading, login, logout, refreshAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
