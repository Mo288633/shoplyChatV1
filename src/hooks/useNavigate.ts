import { useCallback } from 'react';

export function useNavigate() {
  const navigate = useCallback((page: string) => {
    const event = new CustomEvent('navigate', { detail: { page } });
    window.dispatchEvent(event);
  }, []);

  return { navigate };
}