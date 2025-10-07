// Error handling utilities
export const handleApiError = (error) => {
  if (error?.response?.data?.message) {
    return error?.response?.data?.message;
  }
  if (error?.message) {
    return error?.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return !error?.response || error?.code === 'NETWORK_ERROR';
};

export const isValidationError = (error) => {
  return error?.response?.status === 400 || error?.response?.status === 422;
};

export const isAuthenticationError = (error) => {
  return error?.response?.status === 401;
};

export const isAuthorizationError = (error) => {
  return error?.response?.status === 403;
};

export const isNotFoundError = (error) => {
  return error?.response?.status === 404;
};

export const isServerError = (error) => {
  return error?.response?.status >= 500;
};

export const getErrorType = (error) => {
  if (isNetworkError(error)) return 'network';
  if (isValidationError(error)) return 'validation';
  if (isAuthenticationError(error)) return 'authentication';
  if (isAuthorizationError(error)) return 'authorization';
  if (isNotFoundError(error)) return 'not_found';
  if (isServerError(error)) return 'server';
  return 'unknown';
};

export const logError = (error, context = {}) => {
  const errorInfo = {
    message: handleApiError(error),
    type: getErrorType(error),
    timestamp: new Date()?.toISOString(),
    context,
    stack: error?.stack
  };

  if (process.env?.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
  }

  // In production, send to error tracking service
  // Example: Sentry.captureException(error, { extra: errorInfo });
  
  return errorInfo;
};