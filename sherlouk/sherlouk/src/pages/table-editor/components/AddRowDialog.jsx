import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddRowDialog = ({ isOpen, onClose, onAdd, columns, loading = false }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (columnKey, value) => {
    setFormData(prev => ({
      ...prev,
      [columnKey]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[columnKey]) {
      setErrors(prev => ({
        ...prev,
        [columnKey]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    columns?.forEach(column => {
      if (column?.required && (!formData?.[column?.key] || formData?.[column?.key]?.trim() === '')) {
        newErrors[column.key] = `${column?.label} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      onAdd(formData);
      setFormData({});
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden elevation-2 glass-morphism">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Plus" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Add New Row</h3>
              <p className="text-sm text-muted-foreground">Fill in the details for the new row</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            iconName="X"
            iconSize={20}
          />
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {columns?.map((column) => (
                <div key={column?.key} className={column?.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <Input
                    label={column?.label}
                    type={column?.type || 'text'}
                    placeholder={`Enter ${column?.label?.toLowerCase()}`}
                    value={formData?.[column?.key] || ''}
                    onChange={(e) => handleInputChange(column?.key, e?.target?.value)}
                    error={errors?.[column?.key]}
                    required={column?.required}
                    description={column?.description}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={loading}
              iconName="Plus"
              iconPosition="left"
            >
              Add Row
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRowDialog;