import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown, Copy, Settings } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ColumnConfigurator = ({ columns = [], method, onColumnsConfigured }) => {
  const [localColumns, setLocalColumns] = useState([]);
  const [editingColumn, setEditingColumn] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(new Set());

  // Initialize local columns state
  useEffect(() => {
    if (columns?.length > 0) {
      setLocalColumns(columns?.map((col, index) => ({
        id: col?.id || `col_${index}`,
        name: col?.name || `Column_${index + 1}`,
        originalName: col?.originalName || col?.name,
        dataType: col?.dataType || 'text',
        nullable: col?.nullable !== false,
        primaryKey: col?.primaryKey || false,
        unique: col?.unique || false,
        defaultValue: col?.defaultValue || '',
        comment: col?.comment || '',
        index: index
      })));
    }
  }, [columns]);

  // Notify parent of changes
  useEffect(() => {
    if (localColumns?.length > 0) {
      onColumnsConfigured(localColumns);
    }
  }, [localColumns, onColumnsConfigured]);

  // Add new column (manual mode)
  const handleAddColumn = useCallback(() => {
    const newColumn = {
      id: `col_${Date.now()}`,
      name: `Column_${localColumns?.length + 1}`,
      originalName: null,
      dataType: 'text',
      nullable: true,
      primaryKey: false,
      unique: false,
      defaultValue: '',
      comment: '',
      index: localColumns?.length
    };
    setLocalColumns(prev => [...prev, newColumn]);
    setEditingColumn(newColumn?.id);
  }, [localColumns?.length]);

  // Remove column
  const handleRemoveColumn = useCallback((columnId) => {
    setLocalColumns(prev => prev?.filter(col => col?.id !== columnId));
    setSelectedColumns(prev => {
      const newSet = new Set(prev);
      newSet?.delete(columnId);
      return newSet;
    });
    if (editingColumn === columnId) {
      setEditingColumn(null);
    }
  }, [editingColumn]);

  // Update column
  const handleUpdateColumn = useCallback((columnId, updates) => {
    setLocalColumns(prev => prev?.map(col => 
      col?.id === columnId ? { ...col, ...updates } : col
    ));
  }, []);

  // Move column
  const handleMoveColumn = useCallback((columnId, direction) => {
    setLocalColumns(prev => {
      const currentIndex = prev?.findIndex(col => col?.id === columnId);
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev?.length) return prev;
      
      const newColumns = [...prev];
      [newColumns[currentIndex], newColumns[newIndex]] = [newColumns?.[newIndex], newColumns?.[currentIndex]];
      
      // Update index values
      return newColumns?.map((col, index) => ({ ...col, index }));
    });
  }, []);

  // Duplicate column
  const handleDuplicateColumn = useCallback((columnId) => {
    const column = localColumns?.find(col => col?.id === columnId);
    if (!column) return;
    
    const duplicatedColumn = {
      ...column,
      id: `col_${Date.now()}`,
      name: `${column?.name}_copy`,
      primaryKey: false, // Don't duplicate primary key
      index: localColumns?.length
    };
    setLocalColumns(prev => [...prev, duplicatedColumn]);
  }, [localColumns]);

  // Toggle column selection
  const handleToggleSelection = useCallback((columnId) => {
    setSelectedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(columnId)) {
        newSet?.delete(columnId);
      } else {
        newSet?.add(columnId);
      }
      return newSet;
    });
  }, []);

  // Bulk actions
  const handleBulkAction = useCallback((action) => {
    const selectedIds = Array.from(selectedColumns);
    
    switch (action) {
      case 'delete':
        setLocalColumns(prev => prev?.filter(col => !selectedIds?.includes(col?.id)));
        setSelectedColumns(new Set());
        break;
      case 'make-nullable':
        setLocalColumns(prev => prev?.map(col => 
          selectedIds?.includes(col?.id) ? { ...col, nullable: true } : col
        ));
        break;
      case 'make-required':
        setLocalColumns(prev => prev?.map(col => 
          selectedIds?.includes(col?.id) ? { ...col, nullable: false } : col
        ));
        break;
      case 'set-text':
        setLocalColumns(prev => prev?.map(col => 
          selectedIds?.includes(col?.id) ? { ...col, dataType: 'text' } : col
        ));
        break;
    }
  }, [selectedColumns]);

  // Column editor component
  const ColumnEditor = ({ column }) => (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Column Name *
          </label>
          <Input
            value={column?.name}
            onChange={(e) => handleUpdateColumn(column?.id, { name: e?.target?.value })}
            placeholder="Enter column name"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Type *
          </label>
          <Select
            value={column?.dataType}
            onChange={(value) => handleUpdateColumn(column?.id, { dataType: value })}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'integer', label: 'Integer' },
              { value: 'decimal', label: 'Decimal' },
              { value: 'boolean', label: 'Boolean' },
              { value: 'date', label: 'Date' },
              { value: 'datetime', label: 'DateTime' },
              { value: 'email', label: 'Email' },
              { value: 'url', label: 'URL' },
              { value: 'json', label: 'JSON' }
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Value
          </label>
          <Input
            value={column?.defaultValue}
            onChange={(e) => handleUpdateColumn(column?.id, { defaultValue: e?.target?.value })}
            placeholder="Enter default value"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <Input
            value={column?.comment}
            onChange={(e) => handleUpdateColumn(column?.id, { comment: e?.target?.value })}
            placeholder="Add a comment"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={column?.nullable}
            onChange={(e) => handleUpdateColumn(column?.id, { nullable: e?.target?.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">Nullable</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={column?.primaryKey}
            onChange={(e) => {
              if (e?.target?.checked) {
                // Only one primary key allowed
                setLocalColumns(prev => prev?.map(col => ({
                  ...col,
                  primaryKey: col?.id === column?.id
                })));
              } else {
                handleUpdateColumn(column?.id, { primaryKey: false });
              }
            }}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">Primary Key</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={column?.unique}
            onChange={(e) => handleUpdateColumn(column?.id, { unique: e?.target?.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">Unique</span>
        </label>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => setEditingColumn(null)}
        >
          Done
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingColumn(null)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Column Configuration</h2>
          <p className="text-gray-600">
            {method === 'csv' ?'Configure the detected columns from your CSV file' :'Define your table columns with data types and constraints'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          {localColumns?.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Bulk Actions
            </Button>
          )}
          
          {method === 'manual' && (
            <Button
              size="sm"
              onClick={handleAddColumn}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Column
            </Button>
          )}
        </div>
      </div>
      {/* Bulk Actions Panel */}
      {showBulkActions && selectedColumns?.size > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedColumns?.size} column{selectedColumns?.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('make-nullable')}
              >
                Make Nullable
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('make-required')}
              >
                Make Required
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('set-text')}
              >
                Set to Text
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('delete')}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Columns List */}
      <div className="space-y-4">
        {localColumns?.map((column, index) => (
          <div key={column?.id} className="border border-gray-200 rounded-lg">
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                {showBulkActions && (
                  <input
                    type="checkbox"
                    checked={selectedColumns?.has(column?.id)}
                    onChange={() => handleToggleSelection(column?.id)}
                    className="rounded"
                  />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {column?.name}
                    </span>
                    {column?.primaryKey && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        PRIMARY KEY
                      </span>
                    )}
                    {column?.unique && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        UNIQUE
                      </span>
                    )}
                    {!column?.nullable && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        REQUIRED
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {column?.dataType} • {column?.nullable ? 'Nullable' : 'Required'}
                    {column?.comment && ` • ${column?.comment}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMoveColumn(column?.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMoveColumn(column?.id, 'down')}
                  disabled={index === localColumns?.length - 1}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicateColumn(column?.id)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingColumn(editingColumn === column?.id ? null : column?.id)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveColumn(column?.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Column Editor */}
            {editingColumn === column?.id && (
              <div className="border-t border-gray-200">
                <ColumnEditor column={column} />
              </div>
            )}
          </div>
        ))}

        {localColumns?.length === 0 && method === 'manual' && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-gray-600 mb-4">No columns defined yet</div>
            <Button onClick={handleAddColumn} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Add Your First Column
            </Button>
          </div>
        )}
      </div>
      {/* Summary */}
      {localColumns?.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <strong>{localColumns?.length}</strong> column{localColumns?.length !== 1 ? 's' : ''} defined
            {localColumns?.filter(col => col?.primaryKey)?.length > 0 && (
              <span> • <strong>1</strong> primary key</span>
            )}
            {localColumns?.filter(col => col?.unique)?.length > 0 && (
              <span> • <strong>{localColumns?.filter(col => col?.unique)?.length}</strong> unique constraint{localColumns?.filter(col => col?.unique)?.length !== 1 ? 's' : ''}</span>
            )}
            {localColumns?.filter(col => !col?.nullable)?.length > 0 && (
              <span> • <strong>{localColumns?.filter(col => !col?.nullable)?.length}</strong> required field{localColumns?.filter(col => !col?.nullable)?.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnConfigurator;