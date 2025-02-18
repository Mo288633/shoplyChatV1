import React from 'react';

interface NavigationLinksProps {
  onSignIn?: () => void;
  onNavigate?: (page: string) => void;
  isAuthenticated?: boolean;
}

export function NavigationLinks({ onSignIn, onNavigate, isAuthenticated }: NavigationLinksProps) {
  return (
    <>
      <a href="#solutions" className="text-gray-600 hover:text-gray-900">Solutions</a>
      <button 
        onClick={() => onNavigate?.('pricing')} 
        className="text-gray-600 hover:text-gray-900"
      >
        Pricing
      </button>
      <button 
        onClick={() => onNavigate?.('docs')} 
        className="text-gray-600 hover:text-gray-900"
      >
        Documentation
      </button>
      {isAuthenticated ? (
        <button 
          onClick={() => onNavigate?.('dashboard')}
          className="text-gray-600 hover:text-gray-900"
        >
          Dashboard
        </button>
      ) : (
        <button 
          onClick={onSignIn}
          className="text-gray-600 hover:text-gray-900"
        >
          Sign in
        </button>
      )}
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Start free trial
      </button>
    </>
  );
}