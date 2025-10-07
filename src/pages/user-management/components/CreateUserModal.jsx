import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateUserModal = ({ isOpen, onClose, onCreateUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'Viewer', label: 'Viewer', description: 'Read-only access to tables and data' },
    { value: 'Editor', label: 'Editor', description: 'Can edit tables and data' },
    { value: 'Admin', label: 'Admin', description: 'Full system access and user management' }
  ];

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

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const newUser = {
        id: Date.now(),
        name: formData?.name?.trim(),
        email: formData?.email?.trim(),
        role: formData?.role,
        status: 'Active',
        lastLogin: null,
        createdAt: new Date()?.toISOString()
      };

      await onCreateUser(newUser);
      
      setFormData({
        name: '',
        email: '',
        role: 'Viewer',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to create user. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Viewer',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto elevation-2">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">Create New User</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              iconName="X"
              iconSize={20}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

            <Input
              label="Password"
              type="password"
              placeholder="Enter password (min. 8 characters)"
              value={formData?.password}
              onChange={(e) => handleInputChange('password', e?.target?.value)}
              error={errors?.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              value={formData?.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
              error={errors?.confirmPassword}
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
                iconName="UserPlus"
                iconPosition="left"
                iconSize={16}
              >
                Create User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateUserModal;