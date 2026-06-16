import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { resolveToken } from './tokenService';

const FALLBACK_BRAND = import.meta.env.VITE_BRAND_NAME || 'Studio';
const ADMIN_SESSION_KEY = 'zoomin_admin_auth';

// Hardcoded admin credentials — change via env vars for production
const ADMIN_EMAIL    = import.meta.env.VITE_ADMIN_EMAIL    || 'admin@zoomin.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Zoomin@2025!';

const AuthContext = createContext(null);

function adminUser() {
  return {
    sub: 'admin',
    email: ADMIN_EMAIL,
    name: 'Admin',
    brandName: FALLBACK_BRAND,
  };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    status: 'loading',
    user: null,
    brandName: FALLBACK_BRAND,
    error: null,
    login: null,
    logout: null,
  });

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuth((prev) => ({ ...prev, status: 'unauthenticated', user: null, error: null }));
  }, []);

  const login = useCallback((email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
      setAuth((prev) => ({
        ...prev,
        status: 'authenticated',
        user: adminUser(),
        brandName: FALLBACK_BRAND,
        error: null,
      }));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    // Check persistent admin session first
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === '1') {
      setAuth({ status: 'authenticated', user: adminUser(), brandName: FALLBACK_BRAND, error: null, login, logout });
      return;
    }
    // Fall back to JWT token resolution (existing SaaS flow)
    const result = resolveToken();
    if (result.valid) {
      setAuth({
        status: 'authenticated',
        user: result.user,
        brandName: result.user.brandName || FALLBACK_BRAND,
        error: null,
        login,
        logout,
      });
    } else {
      setAuth({
        status: 'unauthenticated',
        user: null,
        brandName: FALLBACK_BRAND,
        error: result.reason,
        login,
        logout,
      });
    }
  }, [login, logout]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
