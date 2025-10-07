import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "default",
  loading = false 
}) => {
  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-error',
          confirmVariant: 'destructive'
        };
      case 'warning':
        return {
          icon: 'AlertCircle',
          iconColor: 'text-warning',
          confirmVariant: 'warning'
        };
      default:
        return {
          icon: 'HelpCircle',
          iconColor: 'text-primary',
          confirmVariant: 'default'
        };
    }
  };

  const config = getTypeConfig();

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-lg max-w-md w-full elevation-2 glass-morphism">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full bg-muted ${config?.iconColor}`}>
              <Icon name={config?.icon} size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config?.confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;