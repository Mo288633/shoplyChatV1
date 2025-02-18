import React, { useState } from 'react';
import { resetPassword } from '../../services/auth';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ForgotPasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ForgotPasswordForm({ onSuccess, onCancel }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {message && (
        <div className="p-3 rounded bg-green-50 text-green-600 text-sm">
          {message}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          className="flex-1"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </Button>
      </div>
    </form>
  );
}