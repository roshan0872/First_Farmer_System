import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ff_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('ff_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('ff_token');
      if (storedToken) {
        try {
          const freshUser = await api.get<User>('/auth/me');
          setUser(freshUser);
          localStorage.setItem('ff_user', JSON.stringify(freshUser));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('ff_token', res.access_token);
    localStorage.setItem('ff_user', JSON.stringify(res.user));
    if (res.user.preferred_language) {
      localStorage.setItem('ff_language', res.user.preferred_language);
    }
  };

  const register = async (formData: any) => {
    const res = await api.post<AuthResponse>('/auth/register', formData);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('ff_token', res.access_token);
    localStorage.setItem('ff_user', JSON.stringify(res.user));
    if (res.user.preferred_language) {
      localStorage.setItem('ff_language', res.user.preferred_language);
    }
  };

  const logout = () => {
    localStorage.removeItem('ff_token');
    localStorage.removeItem('ff_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('ff_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
