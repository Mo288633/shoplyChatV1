import React, { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { NavigationLinks } from './navigation-links';
import { MobileMenu } from './mobile-menu';
import { SignInDialog } from '../auth/SignInDialog';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  onSignIn?: () => void;
  onNavigate?: (page: string) => void;
  isAuthenticated?: boolean;
}

export function Navigation({ onSignIn, onNavigate, isAuthenticated }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { currentUser } = useAuth();

  const handleSignInClick = () => {
    setShowSignInDialog(true);
  };

  const handleSignInSuccess = () => {
    setShowSignInDialog(false);
    onSignIn?.();
  };

  return (
    <>
      <nav className="fixed w-full bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo onClick={() => onNavigate?.('home')} />
          
          <div className="hidden md:flex items-center space-x-8">
            <NavigationLinks 
              onSignIn={handleSignInClick} 
              onNavigate={onNavigate}
              isAuthenticated={isAuthenticated}
            />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            {!currentUser && (
              <Button
                onClick={handleSignInClick}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Sign in to your account"
              >
                Sign in
              </Button>
            )}
            <button 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <MobileMenu 
          open={mobileMenuOpen} 
          onOpenChange={setMobileMenuOpen}
          onSignIn={handleSignInClick}
          onNavigate={onNavigate}
          isAuthenticated={isAuthenticated}
        />
      </nav>

      {showSignInDialog && (
        <SignInDialog 
          open={showSignInDialog}
          onOpenChange={setShowSignInDialog}
          onSuccess={handleSignInSuccess}
        />
      )}
    </>
  );
}