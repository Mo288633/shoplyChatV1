import React, { useState, useEffect } from 'react';
import HomePage from './pages/home';
import DashboardPage from './pages/Dashboard';
import PricingPage from './pages/Pricing';
import DocsPage from './pages/Docs';
import AccountPage from './pages/Account';
import { AuthGuard } from './components/auth/AuthGuard';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { currentUser, sessionExpired } = useAuth();

  useEffect(() => {
    // Listen for navigation events from the sidebar
    const handleNavigate = (event: CustomEvent) => {
      setCurrentPage(event.detail.page);
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
    };
  }, []);

  useEffect(() => {
    // Redirect to home if session expires
    if (sessionExpired) {
      setCurrentPage('home');
    }
  }, [sessionExpired]);

  const handleSignIn = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <AuthGuard>
            <DashboardPage onNavigateHome={handleNavigateHome} />
          </AuthGuard>
        );
      case 'pricing':
        return (
          <PricingPage 
            onSignIn={handleSignIn}
            onNavigate={handleNavigate}
            isAuthenticated={!!currentUser}
          />
        );
      case 'docs':
        return (
          <DocsPage
            onSignIn={handleSignIn}
            onNavigate={handleNavigate}
            isAuthenticated={!!currentUser}
          />
        );
      case 'account':
        return (
          <AuthGuard>
            <AccountPage onNavigateHome={handleNavigateHome} />
          </AuthGuard>
        );
      default:
        return (
          <HomePage 
            onSignIn={handleSignIn}
            onNavigate={handleNavigate}
            isAuthenticated={!!currentUser}
          />
        );
    }
  };

  return renderPage();
}

export default App;