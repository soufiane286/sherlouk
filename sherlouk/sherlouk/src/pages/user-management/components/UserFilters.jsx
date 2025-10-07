import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserFilters = ({ 
  searchTerm, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange, 
  statusFilter, 
  onStatusFilterChange,
  onClearFilters 
}) => {
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Viewer', label: 'Viewer' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const hasActiveFilters = searchTerm || roleFilter || statusFilter;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <Icon name="Filter" size={20} className="text-muted-foreground" />
        <h3 className="font-medium text-card-foreground">Filter Users</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={14}
            className="ml-auto"
          >
            Clear Filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="search"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e?.target?.value)}
        />

        <Select
          options={roleOptions}
          value={roleFilter}
          onChange={onRoleFilterChange}
          placeholder="Filter by role"
        />

        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={onStatusFilterChange}
          placeholder="Filter by status"
        />
      </div>
    </div>
  );
};

export default UserFilters;