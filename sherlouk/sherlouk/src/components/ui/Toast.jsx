import React, { useState, useEffect, createContext, useContext } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, newToast?.duration);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev?.filter(toast => toast?.id !== id));
  };

  const success = (message, options = {}) => addToast({ ...options, message, type: 'success' });
  const error = (message, options = {}) => addToast({ ...options, message, type: 'error' });
  const warning = (message, options = {}) => addToast({ ...options, message, type: 'warning' });
  const info = (message, options = {}) => addToast({ ...options, message, type: 'info' });

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts?.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts?.map((toast) => (
        <Toast key={toast?.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast?.id), 150);
  };

  const getToastStyles = () => {
    const baseStyles = `
      transform transition-all duration-300 ease-out
      bg-card border border-border rounded-lg elevation-2 
      p-4 flex items-start gap-3 min-w-0
    `;
    
    const visibilityStyles = isVisible 
      ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';

    return `${baseStyles} ${visibilityStyles}`;
  };

  const getIconAndColors = () => {
    switch (toast?.type) {
      case 'success':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'error':
        return { icon: 'XCircle', color: 'text-error' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      default:
        return { icon: 'Info', color: 'text-primary' };
    }
  };

  const { icon, color } = getIconAndColors();

  return (
    <div className={getToastStyles()}>
      <div className={`flex-shrink-0 ${color} mt-0.5`}>
        <Icon name={icon} size={18} />
      </div>
      <div className="flex-1 min-w-0">
        {toast?.title && (
          <p className="text-sm font-medium text-card-foreground mb-1">
            {toast?.title}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {toast?.message}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="flex-shrink-0 w-6 h-6 -mt-1 -mr-1"
        iconName="X"
        iconSize={14}
      >
        <span className="sr-only">Close</span>
      </Button>
    </div>
  );
};

export default Toast;