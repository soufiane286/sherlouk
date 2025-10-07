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
  tableName = ""
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'delete':
        return { icon: 'Trash2', color: 'text-destructive' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'info':
        return { icon: 'Info', color: 'text-primary' };
      default:
        return { icon: 'HelpCircle', color: 'text-muted-foreground' };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-popover border border-border rounded-lg w-full max-w-md elevation-2">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-2 rounded-full bg-muted ${color}`}>
                <Icon name={icon} size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-popover-foreground mb-2">
                  {title}
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>{message}</p>
                  {tableName && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-popover-foreground">
                        Table: {tableName}
                      </p>
                    </div>
                  )}
                  {type === 'delete' && (
                    <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5" />
                      <div className="text-xs">
                        <p className="font-medium text-destructive mb-1">Warning:</p>
                        <p className="text-destructive/80">This action cannot be undone. All data will be permanently deleted.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
              >
                {cancelText}
              </Button>
              <Button
                variant={type === 'delete' ? 'destructive' : 'default'}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationDialog;