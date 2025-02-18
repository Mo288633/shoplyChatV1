import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from '../../hooks/useNavigate';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { currentUser, loading, sessionExpired, refreshSession } = useAuth();
  const { navigate } = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('home');
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (sessionExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Expired</h2>
          <p className="text-gray-600 mb-6">
            Your session has expired. Please sign in again to continue.
          </p>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={refreshSession}
              className="mr-2"
            >
              Refresh Session
            </Button>
            <Button
              onClick={() => navigate('home')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access this page.
          </p>
          <Button onClick={() => navigate('home')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}