import { useState, useCallback } from 'react';

const useErrorBoundary = () => {
  const [error, setError] = useState(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error, errorInfo) => {
    setError({ error, errorInfo });
    // Log to console in development
    if (process.env?.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }, []);

  return { error, resetError, captureError };
};

export default useErrorBoundary;