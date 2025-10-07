import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EditUserModal = ({ isOpen, onClose, onUpdateUser, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'Viewer', label: 'Viewer', description: 'Read-only access to tables and data' },
    { value: 'Editor', label: 'Editor', description: 'Can edit tables and data' },
    { value: 'Admin', label: 'Admin', description: 'Full system access and user management' }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'Viewer'
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const updatedUser = {
        ...user,
        name: formData?.name?.trim(),
        email: formData?.email?.trim(),
        role: formData?.role,
        updatedAt: new Date()?.toISOString()
      };

      await onUpdateUser(updatedUser);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to update user. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto elevation-2">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">Edit User</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              iconName="X"
              iconSize={20}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">User ID: {user?.id}</p>
              </div>
            </div>

            <Input
              label="Full Name"
              type="text"
              placeholder="Enter user's full name"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
            />

            <Select
              label="User Role"
              description="Select the appropriate role for this user"
              options={roleOptions}
              value={formData?.role}
              onChange={(value) => handleInputChange('role', value)}
              required
            />

            {errors?.submit && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{errors?.submit}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
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
                variant="default"
                loading={isLoading}
                className="flex-1"
                iconName="Save"
                iconPosition="left"
                iconSize={16}
              >
                Update User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserModal;