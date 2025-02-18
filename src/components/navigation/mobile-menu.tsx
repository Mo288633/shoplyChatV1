import React from 'react';
import { NavigationLinks } from './navigation-links';

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn?: () => void;
  onNavigate?: (page: string) => void;
  isAuthenticated?: boolean;
}

export function MobileMenu({ 
  open, 
  onOpenChange,
  onSignIn,
  onNavigate,
  isAuthenticated
}: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 py-4 space-y-4">
        <NavigationLinks 
          onSignIn={onSignIn} 
          onNavigate={onNavigate}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}