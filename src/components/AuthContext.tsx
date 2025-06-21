"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

// Tạo Context với giá trị mặc định (sẽ được ghi đè bởi Provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hàm để thực hiện đăng nhập
  const login = useCallback((token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setLoading(false); // Đảm bảo loading được đặt lại
    // console.log("AuthContext: User logged in and state updated.");
  }, []);

  // Hàm để thực hiện đăng xuất
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setLoading(false); // Đảm bảo loading được đặt lại
    // console.log("AuthContext: User logged out and state updated.");
  }, []);

  // useEffect để kiểm tra trạng thái ban đầu từ localStorage
  useEffect(() => {
    console.log("AuthContext: useEffect running for initial check.");
    const userToken = localStorage.getItem('token');
    if (userToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
    console.log("AuthContext: Initial loading check complete.");
  }, []); // Chạy chỉ một lần khi component mount

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
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
};