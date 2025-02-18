import React from 'react';
import { Navigation } from '../components/navigation/navigation';
import { Footer } from '../components/layout/footer';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
  onSignIn?: () => void;
  onNavigate?: (page: string) => void;
  isAuthenticated?: boolean;
}

export function Layout({ 
  children, 
  showNavigation = true, 
  showFooter = true,
  onSignIn,
  onNavigate,
  isAuthenticated
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {showNavigation && (
        <Navigation 
          onSignIn={onSignIn} 
          onNavigate={onNavigate}
          isAuthenticated={isAuthenticated}
        />
      )}
      {children}
      {showFooter && <Footer onNavigate={onNavigate} />}
    </div>
  );
}