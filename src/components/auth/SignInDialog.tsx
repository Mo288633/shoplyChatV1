import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';

type AuthView = 'signin' | 'signup' | 'forgot-password';

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SignInDialog({ open, onOpenChange, onSuccess }: SignInDialogProps) {
  const [view, setView] = useState<AuthView>('signin');
  const [error, setError] = useState<string | null>(null);
  const { isOnline } = useAuth();

  const handleSuccess = useCallback(() => {
    setError(null);
    onSuccess();
    onOpenChange(false);
  }, [onSuccess, onOpenChange]);

  const handleError = useCallback((error: string) => {
    setError(error);
  }, []);

  const handleViewChange = useCallback((newView: AuthView) => {
    setError(null);
    setView(newView);
  }, []);

  if (!isOnline) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offline Mode</DialogTitle>
            <DialogDescription>
              Authentication is not available while offline. Please check your internet connection and try again.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {view === 'signin' && 'Sign in to your account'}
            {view === 'signup' && 'Create an account'}
            {view === 'forgot-password' && 'Reset your password'}
          </DialogTitle>
          <DialogDescription>
            {view === 'signin' && 'Enter your email below to sign in to your account'}
            {view === 'signup' && 'Enter your details below to create your account'}
            {view === 'forgot-password' && "Enter your email and we'll send you a reset link"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {view === 'signin' && (
          <>
            <SignInForm
              onSuccess={handleSuccess}
              onError={handleError}
              onForgotPassword={() => handleViewChange('forgot-password')}
            />
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">Don't have an account?</span>{' '}
              <Button
                variant="link"
                className="text-sm"
                onClick={() => handleViewChange('signup')}
              >
                Sign up
              </Button>
            </div>
          </>
        )}

        {view === 'signup' && (
          <>
            <SignUpForm 
              onSuccess={handleSuccess}
              onError={handleError}
            />
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">Already have an account?</span>{' '}
              <Button
                variant="link"
                className="text-sm"
                onClick={() => handleViewChange('signin')}
              >
                Sign in
              </Button>
            </div>
          </>
        )}

        {view === 'forgot-password' && (
          <ForgotPasswordForm
            onSuccess={handleSuccess}
            onError={handleError}
            onCancel={() => handleViewChange('signin')}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}