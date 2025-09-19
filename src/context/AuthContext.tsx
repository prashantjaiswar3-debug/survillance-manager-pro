"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useLocalStorageState from '@/hooks/use-local-storage-state';

type AuthContextType = {
  isAuthenticated: boolean | null;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean, message: string };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultPassword = "admin";
const passwordKey = "app-password";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useLocalStorageState<string>(passwordKey, defaultPassword);

  useEffect(() => {
    try {
      const sessionAuth = sessionStorage.getItem('isAuthenticated');
      setIsAuthenticated(sessionAuth === 'true');
    } catch (error) {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (enteredPassword: string) => {
    if (enteredPassword === password) {
      sessionStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };
  
  const changePassword = (currentPassword: string, newPassword: string) => {
    if (currentPassword !== password) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (newPassword.length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }
    setPassword(newPassword);
    return { success: true, message: 'Password changed successfully.' };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
