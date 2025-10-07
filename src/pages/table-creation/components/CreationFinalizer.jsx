import React, { useState, useCallback } from 'react';
import { Save, AlertCircle, CheckCircle, Settings, Database, Clock } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreationFinalizer = ({ creationState, onTableCreated }) => {
  const [tableName, setTableName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    createIndexes: true,
    addConstraints: true,
    enableAuditing: false,
    backupBeforeCreate: true
  });

  // Validate table name
  const validateTableName = useCallback((name) => {
    const errors = [];
    
    if (!name) {
      errors?.push('Table name is required');
    } else {
      if (name?.length < 2) {
        errors?.push('Table name must be at least 2 characters long');
      }
      if (name?.length > 63) {
        errors?.push('Table name must be less than 64 characters');
      }
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/?.test(name)) {
        errors?.push('Table name must start with a letter and contain only letters, numbers, and underscores');
      }
      
      // Check for reserved words (basic list)
      const reservedWords = ['table', 'select', 'insert', 'update', 'delete', 'create', 'drop', 'alter', 'index'];
      if (reservedWords?.includes(name?.toLowerCase())) {
        errors?.push('Table name cannot be a reserved SQL keyword');
      }
    }
    
    return errors;
  }, []);

  // Get validation errors
  const nameErrors = validateTableName(tableName);
  const isNameValid = nameErrors?.length === 0;

  // Handle table creation
  const handleCreateTable = useCallback(async () => {
    if (!isNameValid || creating) return;
    
    setCreating(true);
    
    try {
      // Prepare table creation data
      const tableData = {
        name: tableName,
        method: creationState?.method,
        columns: creationState?.columns,
        dataTypes: creationState?.dataTypes,
        validationRules: creationState?.validationRules,
        options: advancedOptions,
        fileData: creationState?.fileData
      };
      
      await onTableCreated(tableData);
    } catch (error) {
      console.error('Table creation failed:', error);
    } finally {
      setCreating(false);
    }
  }, [isNameValid, creating, tableName, creationState, advancedOptions, onTableCreated]);

  // Generate suggested table name
  const generateSuggestedName = useCallback(() => {
    const baseNames = [];
    
    if (creationState?.method === 'csv' && creationState?.fileData?.file) {
      const fileName = creationState?.fileData?.file?.name;
      const baseName = fileName?.replace('.csv', '')?.replace(/[^a-zA-Z0-9]/g, '_');
      baseNames?.push(baseName);
    }
    
    // Add generic suggestions
    baseNames?.push('my_table', 'data_table', 'new_table');
    
    // Find first valid name
    for (const name of baseNames) {
      if (validateTableName(name)?.length === 0) {
        return name;
      }
    }
    
    return 'table_' + Date.now();
  }, [creationState, validateTableName]);

  // Calculate creation summary statistics
  const getSummaryStats = () => {
    const stats = {
      columns: creationState?.columns?.length || 0,
      primaryKeys: creationState?.columns?.filter(col => col?.primaryKey)?.length || 0,
      requiredFields: creationState?.columns?.filter(col => !col?.nullable)?.length || 0,
      uniqueConstraints: creationState?.columns?.filter(col => col?.unique)?.length || 0,
      validationRules: Object.values(creationState?.validationRules || {})?.reduce((sum, rules) => sum + rules?.length, 0),
      dataTypes: new Set(Object.values(creationState.dataTypes || {}))?.size
    };
    
    return stats;
  };

  const stats = getSummaryStats();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Finalize Table Creation</h2>
        <p className="text-gray-600">Review your configuration and create the table</p>
      </div>
      {/* Table Name Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Table Name *
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={tableName}
              onChange={(e) => setTableName(e?.target?.value)}
              placeholder="Enter table name"
              className={`${nameErrors?.length > 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {nameErrors?.length > 0 && (
              <div className="mt-1 space-y-1">
                {nameErrors?.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setTableName(generateSuggestedName())}
          >
            Suggest Name
          </Button>
        </div>
      </div>
      {/* Configuration Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Configuration Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Columns:</span>
            <span className="font-medium">{stats?.columns}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">Primary Keys:</span>
            <span className="font-medium">{stats?.primaryKeys}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-gray-600">Required:</span>
            <span className="font-medium">{stats?.requiredFields}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-600" />
            <span className="text-gray-600">Validation Rules:</span>
            <span className="font-medium">{stats?.validationRules}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-orange-600" />
            <span className="text-gray-600">Data Types:</span>
            <span className="font-medium">{stats?.dataTypes}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Unique:</span>
            <span className="font-medium">{stats?.uniqueConstraints}</span>
          </div>
        </div>
      </div>
      {/* Advanced Options */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="flex items-center gap-2 mb-4"
        >
          <Settings className="w-4 h-4" />
          {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
        </Button>
        
        {showAdvancedOptions && (
          <div className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={advancedOptions?.createIndexes}
                  onChange={(e) => setAdvancedOptions(prev => ({
                    ...prev,
                    createIndexes: e?.target?.checked
                  }))}
                  className="rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Create Indexes</span>
                  <p className="text-xs text-gray-500">Automatically create indexes for primary keys and unique constraints</p>
                </div>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={advancedOptions?.addConstraints}
                  onChange={(e) => setAdvancedOptions(prev => ({
                    ...prev,
                    addConstraints: e?.target?.checked
                  }))}
                  className="rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Add Constraints</span>
                  <p className="text-xs text-gray-500">Apply all defined validation rules as database constraints</p>
                </div>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={advancedOptions?.enableAuditing}
                  onChange={(e) => setAdvancedOptions(prev => ({
                    ...prev,
                    enableAuditing: e?.target?.checked
                  }))}
                  className="rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Enable Auditing</span>
                  <p className="text-xs text-gray-500">Track changes with created_at and updated_at columns</p>
                </div>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={advancedOptions?.backupBeforeCreate}
                  onChange={(e) => setAdvancedOptions(prev => ({
                    ...prev,
                    backupBeforeCreate: e?.target?.checked
                  }))}
                  className="rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Backup Before Create</span>
                  <p className="text-xs text-gray-500">Create a backup point before executing the table creation</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
      {/* Pre-creation Checklist */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Pre-creation Checklist
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked disabled className="rounded" />
            <span className="text-blue-800">Table structure defined ({stats?.columns} columns)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={stats?.primaryKeys > 0} 
              disabled 
              className="rounded" 
            />
            <span className={stats?.primaryKeys > 0 ? 'text-blue-800' : 'text-gray-600'}>
              Primary key configured ({stats?.primaryKeys > 0 ? 'Yes' : 'Recommended'})
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <input type="checkbox" checked disabled className="rounded" />
            <span className="text-blue-800">Data types assigned</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={isNameValid} disabled className="rounded" />
            <span className={isNameValid ? 'text-blue-800' : 'text-red-600'}>
              Valid table name ({isNameValid ? 'Valid' : 'Please fix errors'})
            </span>
          </div>
        </div>
      </div>
      {/* Create Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {creating && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              Creating table...
            </div>
          )}
        </div>
        
        <Button
          size="lg"
          onClick={handleCreateTable}
          disabled={!isNameValid || creating || stats?.columns === 0}
          className="flex items-center gap-2 min-w-[140px]"
        >
          {creating ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Create Table
            </>
          )}
        </Button>
      </div>
      {/* Warning for missing primary key */}
      {stats?.primaryKeys === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">No Primary Key Defined</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Consider adding a primary key column for better database performance and data integrity.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreationFinalizer;