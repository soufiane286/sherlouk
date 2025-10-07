import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TableToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  selectedRows, 
  onSelectAll, 
  totalRows, 
  onExport, 
  onAddRow,
  onDeleteSelected,
  onColumnToggle,
  visibleColumns,
  allColumns 
}) => {
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportOptions = [
    { value: 'csv', label: 'Export as CSV', icon: 'FileText' },
    { value: 'excel', label: 'Export as Excel', icon: 'FileSpreadsheet' },
    { value: 'pdf', label: 'Export as PDF', icon: 'FileDown' }
  ];

  const handleExport = (format) => {
    onExport(format);
    setShowExportMenu(false);
  };

  const isAllSelected = selectedRows?.length === totalRows && totalRows > 0;
  const isPartiallySelected = selectedRows?.length > 0 && selectedRows?.length < totalRows;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Left Section - Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search table data..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
          
          {/* Select All Checkbox */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isPartiallySelected;
              }}
              onChange={onSelectAll}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
            />
            <span className="text-sm text-muted-foreground">
              {selectedRows?.length > 0 ? `${selectedRows?.length} selected` : 'Select all'}
            </span>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {/* Bulk Actions - Show when rows are selected */}
          {selectedRows?.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete ({selectedRows?.length})
            </Button>
          )}

          {/* Column Visibility Toggle */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              iconName="Columns"
              iconPosition="left"
            >
              Columns
            </Button>
            
            {showColumnMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowColumnMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg elevation-2 z-50 glass-morphism">
                  <div className="p-3 border-b border-border">
                    <h4 className="text-sm font-medium text-popover-foreground">Toggle Columns</h4>
                  </div>
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {allColumns?.map((column) => (
                      <label key={column?.key} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns?.includes(column?.key)}
                          onChange={() => onColumnToggle(column?.key)}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="text-sm text-popover-foreground">{column?.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Export Menu */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            
            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg elevation-2 z-50 glass-morphism">
                  <div className="p-2">
                    {exportOptions?.map((option) => (
                      <button
                        key={option?.value}
                        onClick={() => handleExport(option?.value)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth"
                      >
                        <Icon name={option?.icon} size={16} />
                        {option?.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Add Row Button */}
          <Button
            variant="default"
            size="sm"
            onClick={onAddRow}
            iconName="Plus"
            iconPosition="left"
          >
            Add Row
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableToolbar;