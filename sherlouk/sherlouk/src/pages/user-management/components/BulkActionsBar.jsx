import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ 
  selectedCount, 
  onBulkRoleChange, 
  onBulkStatusChange, 
  onBulkDelete, 
  onClearSelection 
}) => {
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const roleOptions = [
    { value: 'Viewer', label: 'Viewer' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Admin', label: 'Admin' }
  ];

  const handleRoleChange = () => {
    if (selectedRole) {
      onBulkRoleChange(selectedRole);
      setSelectedRole('');
      setShowRoleSelect(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <Icon name="Users" size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-card-foreground">
              {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
            </p>
            <p className="text-sm text-muted-foreground">
              Choose an action to apply to selected users
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          iconName="X"
          iconSize={16}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        {!showRoleSelect ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRoleSelect(true)}
            iconName="Shield"
            iconPosition="left"
            iconSize={14}
          >
            Change Role
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={setSelectedRole}
              placeholder="Select role"
              className="w-32"
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleRoleChange}
              disabled={!selectedRole}
              iconName="Check"
              iconSize={14}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowRoleSelect(false);
                setSelectedRole('');
              }}
              iconName="X"
              iconSize={14}
            />
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusChange('Active')}
          iconName="UserCheck"
          iconPosition="left"
          iconSize={14}
        >
          Activate
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusChange('Inactive')}
          iconName="UserX"
          iconPosition="left"
          iconSize={14}
        >
          Deactivate
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          iconName="Trash2"
          iconPosition="left"
          iconSize={14}
        >
          Delete Selected
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;