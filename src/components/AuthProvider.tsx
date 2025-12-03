"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const { data } = await axios.get('/api/auth/profile');
      setUser(data.user || data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData: any) => {
    await axios.post('/api/auth/login', formData);
    await checkUserLoggedIn(); // Refresh user state
    router.push('/dashboard');
  };

  const register = async (formData: any) => {
    await axios.post('/api/auth/register', formData);
    router.push('/login'); // Redirect to login after signup
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};