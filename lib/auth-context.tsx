"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = document.cookie.includes('token=');
      setIsAuthenticated(hasToken);
    };

    checkAuth();
    // Check auth state when component mounts and when storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = (token: string) => {
    setIsAuthenticated(true);
    // Get the intended URL from localStorage or default to /nominees
    const intendedUrl = localStorage.getItem('intendedUrl') || '/nominees';
    localStorage.removeItem('intendedUrl'); // Clear the stored URL
    router.push(intendedUrl);
  };

  // Store the current path when redirecting to login
  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
      localStorage.setItem('intendedUrl', pathname);
    }
  }, [isAuthenticated, pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}