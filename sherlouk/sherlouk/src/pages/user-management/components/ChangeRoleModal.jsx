import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ChangeRoleModal = ({ isOpen, onClose, onChangeRole, user }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { 
      value: 'Viewer', 
      label: 'Viewer', 
      description: 'Read-only access to tables and data. Cannot modify or delete content.' 
    },
    { 
      value: 'Editor', 
      label: 'Editor', 
      description: 'Can create, edit, and delete tables and data. Cannot manage users.' 
    },
    { 
      value: 'Admin', 
      label: 'Admin', 
      description: 'Full system access including user management and system settings.' 
    }
  ];

  useEffect(() => {
    if (user) {
      setSelectedRole(user?.role || 'Viewer');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (selectedRole === user?.role) {
      onClose();
      return;
    }

    setIsLoading(true);
    
    try {
      await onChangeRole(user?.id, selectedRole);
      onClose();
    } catch (error) {
      console.error('Failed to change user role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return 'ShieldCheck';
      case 'Editor':
        return 'Edit';
      case 'Viewer':
        return 'Eye';
      default:
        return 'Shield';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'text-destructive';
      case 'Editor':
        return 'text-warning';
      case 'Viewer':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-md elevation-2">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">Change User Role</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
              iconSize={20}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-card-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Icon 
                  name={getRoleIcon(user?.role)} 
                  size={16} 
                  className={getRoleColor(user?.role)} 
                />
                <span className="text-sm font-medium text-card-foreground">{user?.role}</span>
              </div>
            </div>

            <div>
              <Select
                label="New Role"
                description="Select the new role for this user"
                options={roleOptions}
                value={selectedRole}
                onChange={setSelectedRole}
                required
              />
            </div>

            {selectedRole !== user?.role && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">Role Change Warning</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Changing this user's role will immediately affect their access permissions. 
                      This action will be logged in the audit trail.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                loading={isLoading}
                className="flex-1"
                iconName="Shield"
                iconPosition="left"
                iconSize={16}
                disabled={selectedRole === user?.role}
              >
                Change Role
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangeRoleModal;