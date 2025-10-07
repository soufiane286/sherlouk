import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DeleteUserModal = ({ isOpen, onClose, onDeleteUser, user }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const expectedConfirmText = 'DELETE';
  const isConfirmValid = confirmText === expectedConfirmText;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!isConfirmValid) return;

    setIsLoading(true);
    
    try {
      await onDeleteUser(user?.id);
      setConfirmText('');
      onClose();
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-md elevation-2">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-card-foreground">Delete User</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              iconName="X"
              iconSize={20}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" size={20} className="text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Warning: This action cannot be undone</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Deleting this user will permanently remove their account and all associated data. 
                      This action will be logged in the audit trail.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground">Role: {user?.role}</p>
                </div>
              </div>
            </div>

            <div>
              <Input
                label={`Type "${expectedConfirmText}" to confirm deletion`}
                type="text"
                placeholder="Type DELETE to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e?.target?.value)}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                loading={isLoading}
                className="flex-1"
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
                disabled={!isConfirmValid}
              >
                Delete User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeleteUserModal;