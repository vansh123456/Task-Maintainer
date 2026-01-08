'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '@/lib/api';
import { User, AuthContextType, ApiError } from '@/types';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount and when needed
  const checkAuth = useCallback(async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.data?.user) {
        setUser(response.data.user);
        router.push('/dashboard');
      }
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Login failed');
    }
  }, [router]);

  // Register function
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ name, email, password });
      if (response.data?.user) {
        setUser(response.data.user);
        router.push('/dashboard');
      }
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Registration failed');
    }
  }, [router]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Even if logout API call fails, clear local state
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

