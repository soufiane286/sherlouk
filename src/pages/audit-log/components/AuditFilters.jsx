import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AuditFilters = ({ filters, onFiltersChange, onExport, onRefresh }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actionTypeOptions = [
    { value: 'all', label: 'All Actions' },
    { value: 'table_create', label: 'Table Created' },
    { value: 'table_edit', label: 'Table Edited' },
    { value: 'table_delete', label: 'Table Deleted' },
    { value: 'row_add', label: 'Row Added' },
    { value: 'row_edit', label: 'Row Edited' },
    { value: 'row_delete', label: 'Row Deleted' },
    { value: 'user_create', label: 'User Created' },
    { value: 'user_edit', label: 'User Modified' },
    { value: 'user_delete', label: 'User Deleted' },
    { value: 'login', label: 'User Login' },
    { value: 'logout', label: 'User Logout' }
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'admin@sherlouk.com', label: 'Admin User' },
    { value: 'john.doe@company.com', label: 'John Doe' },
    { value: 'jane.smith@company.com', label: 'Jane Smith' },
    { value: 'mike.wilson@company.com', label: 'Mike Wilson' },
    { value: 'sarah.johnson@company.com', label: 'Sarah Johnson' }
  ];

  const resourceOptions = [
    { value: 'all', label: 'All Resources' },
    { value: 'employees', label: 'Employees Table' },
    { value: 'products', label: 'Products Table' },
    { value: 'sales', label: 'Sales Data Table' },
    { value: 'customers', label: 'Customers Table' },
    { value: 'inventory', label: 'Inventory Table' },
    { value: 'users', label: 'User Management' },
    { value: 'system', label: 'System Settings' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      dateFrom: '',
      dateTo: '',
      user: 'all',
      actionType: 'all',
      resource: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters?.dateFrom || filters?.dateTo || 
    filters?.user !== 'all' || filters?.actionType !== 'all' || 
    filters?.resource !== 'all' || filters?.search;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-medium text-card-foreground">Audit Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search audit logs..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="max-w-md"
        />
      </div>
      {/* Expandable Filters */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="From Date"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            />
            <Input
              type="date"
              label="To Date"
              value={filters?.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="User"
              options={userOptions}
              value={filters?.user}
              onChange={(value) => handleFilterChange('user', value)}
            />
            <Select
              label="Action Type"
              options={actionTypeOptions}
              value={filters?.actionType}
              onChange={(value) => handleFilterChange('actionType', value)}
            />
            <Select
              label="Resource"
              options={resourceOptions}
              value={filters?.resource}
              onChange={(value) => handleFilterChange('resource', value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => onExport('csv')}
                iconName="Download"
                iconPosition="left"
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => onExport('pdf')}
                iconName="FileText"
                iconPosition="left"
              >
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditFilters;