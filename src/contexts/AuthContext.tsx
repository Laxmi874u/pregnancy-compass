import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'pregai_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user and token on mount
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const storedToken = api.getAuthToken();
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      
      // Verify token is still valid by fetching current user
      api.getCurrentUser()
        .then(response => {
          const userData: User = {
            id: response.user.id.toString(),
            email: response.user.email,
            name: response.user.name,
            avatarUrl: response.user.avatar_url,
          };
          setUser(userData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        })
        .catch(() => {
          // Token invalid, clear auth state
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const response = await api.login(email, password);
      
      const userData: User = {
        id: response.user.id.toString(),
        email: response.user.email,
        name: response.user.name,
        avatarUrl: response.user.avatar_url,
      };
      
      setUser(userData);
      setToken(response.access_token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    try {
      const response = await api.signup(email, password, name);
      
      const userData: User = {
        id: response.user.id.toString(),
        email: response.user.email,
        name: response.user.name,
      };
      
      setUser(userData);
      setToken(response.access_token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    api.logout();
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, token }}>
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
