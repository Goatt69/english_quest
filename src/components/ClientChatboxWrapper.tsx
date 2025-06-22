"use client";
import { useAuth } from '@/hooks/useAuth'; 
import FloatingChatbox from '../components/floatingchatbox';

export default function ClientChatboxWrapper() {
  const { isLoggedIn, loading } = useAuth(); // Sử dụng hook kiểm tra đăng nhập

  if (loading) {
    return null; // Hoặc hiển thị một loader nhỏ nếu bạn muốn
  }

  // Chỉ render FloatingChatbox nếu người dùng đã đăng nhập
  return isLoggedIn ? <FloatingChatbox /> : null;
}