'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { isTokenExpired } from '@/utils/jwt';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'user';
  has_address?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasAddress: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);

  // Check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token && isTokenExpired(token)) {
        logout();
        toast.error('Session expired. Please login again.');
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); 
    return () => clearInterval(interval);
  }, []);

  // Add token check on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      logout();
      toast.error('Session expired. Please login again.');
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData && typeof userData === 'object') {
          setUser(userData);
          setIsAuthenticated(true);
          setHasAddress(!!userData.has_address);
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          logout();
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    const pendingRedirect = localStorage.getItem('pendingRedirect');
    const token = localStorage.getItem('token');
    
    if (pendingRedirect && token && !isTokenExpired(token)) {
      localStorage.removeItem('pendingRedirect');
      window.location.href = pendingRedirect;
    }
  }, []);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData && typeof userData === 'object') {
          setUser(userData);
          setIsAuthenticated(true);
          // Only set hasAddress for regular users
          setHasAddress(userData.role === 'user' ? !!userData.has_address : true);
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

 // AuthContext.tsx
 const logout = async () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setUser(null);
    setIsAuthenticated(false);
    setHasAddress(false);
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, hasAddress, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};