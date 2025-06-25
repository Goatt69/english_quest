"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  user: any; // Add user data
  login: (token: string, user: any) => void;
  logout: () => void;
  isAdmin: () => boolean; // Add admin check
}

// Tạo Context với giá trị mặc định (sẽ được ghi đè bởi Provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // Add user state
  const [mounted, setMounted] = useState(false); // Add mounted state for hydration

  // Add mounted check to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hàm để thực hiện đăng nhập
  const login = useCallback((token: string, userData: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData); // Set user data
    setLoading(false); // Đảm bảo loading được đặt lại
    // console.log("AuthContext: User logged in and state updated.");
  }, []);

  // Hàm để thực hiện đăng xuất
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null); // Clear user data
    setLoading(false); // Đảm bảo loading được đặt lại
    // console.log("AuthContext: User logged out and state updated.");
  }, []);

  // Add admin check function
  const isAdmin = useCallback(() => {
    return user?.roles?.includes('Admin') || false;
  }, [user]);

  // useEffect để kiểm tra trạng thái ban đầu từ localStorage
  useEffect(() => {
    if (!mounted) return; // Wait for component to mount

    console.log("AuthContext: useEffect running for initial check.");
    const userToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (userToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser); // Set user data from localStorage
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    setLoading(false);
    console.log("AuthContext: Initial loading check complete.");
  }, [mounted]); // Add mounted dependency

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      loading, 
      user, // Add user to context value
      login, 
      logout, 
      isAdmin // Add isAdmin to context value
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}