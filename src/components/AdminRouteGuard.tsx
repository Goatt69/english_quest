'use client';

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isLoggedIn, loading, isAdmin } = useAuth(); // Use correct property names
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    if (!isLoggedIn) { // Use isLoggedIn instead of isAuthenticated
      router.push('/login?redirect=/admin');
      return;
    }

    // Check if user has admin role using the isAdmin function
    const hasAdminRole = isAdmin();

    if (!hasAdminRole) {
      router.push('/unauthorized');
      return;
    }

    setIsAuthorized(true);
  }, [isLoggedIn, user, loading, router, mounted, isAdmin]);

  if (!mounted || loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  if (!isAuthorized) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Checking Access...</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
    );
  }

  return <>{children}</>;
}
