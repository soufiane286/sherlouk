import React, { useState, useCallback, useEffect } from 'react';
import { Database, Wand2, AlertTriangle, Check } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DataTypeManager = ({ columns = [], dataTypes = {}, onDataTypesAssigned }) => {
  const [localDataTypes, setLocalDataTypes] = useState({});
  const [autoInferenceResults, setAutoInferenceResults] = useState({});
  const [showAdvancedTypes, setShowAdvancedTypes] = useState(false);

  // Data type definitions with constraints and validation
  const dataTypeDefinitions = {
    // Basic Types
    text: {
      label: 'Text',
      description: 'Variable length text',
      category: 'basic',
      constraints: ['maxLength'],
      validation: null
    },
    integer: {
      label: 'Integer',
      description: 'Whole numbers',
      category: 'basic',
      constraints: ['min', 'max'],
      validation: /^-?\d+$/
    },
    decimal: {
      label: 'Decimal',
      description: 'Decimal numbers',
      category: 'basic',
      constraints: ['min', 'max', 'precision', 'scale'],
      validation: /^-?\d+(\.\d+)?$/
    },
    boolean: {
      label: 'Boolean',
      description: 'True/false values',
      category: 'basic',
      constraints: [],
      validation: /^(true|false|1|0|yes|no)$/i
    },
    date: {
      label: 'Date',
      description: 'Date values (YYYY-MM-DD)',
      category: 'basic',
      constraints: ['min', 'max'],
      validation: /^\d{4}-\d{2}-\d{2}$/
    },
    datetime: {
      label: 'DateTime',
      description: 'Date and time values',
      category: 'basic',
      constraints: ['min', 'max'],
      validation: /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/
    },
    // Advanced Types
    email: {
      label: 'Email',
      description: 'Email addresses',
      category: 'advanced',
      constraints: ['domain'],
      validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    url: {
      label: 'URL',
      description: 'Web addresses',
      category: 'advanced',
      constraints: ['protocol'],
      validation: /^https?:\/\/.+/
    },
    json: {
      label: 'JSON',
      description: 'JSON objects',
      category: 'advanced',
      constraints: ['schema'],
      validation: null
    },
    uuid: {
      label: 'UUID',
      description: 'Universally unique identifiers',
      category: 'advanced',
      constraints: [],
      validation: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    },
    phone: {
      label: 'Phone',
      description: 'Phone numbers',
      category: 'advanced',
      constraints: ['format'],
      validation: /^[\+]?[1-9][\d]{0,15}$/
    },
    currency: {
      label: 'Currency',
      description: 'Monetary values',
      category: 'advanced',
      constraints: ['min', 'max', 'currency'],
      validation: /^\d+(\.\d{1,2})?$/
    }
  };

  // Initialize local state
  useEffect(() => {
    const initialTypes = {};
    columns?.forEach(column => {
      initialTypes[column.id || column.name] = dataTypes?.[column?.id || column?.name] || column?.dataType || 'text';
    });
    setLocalDataTypes(initialTypes);
  }, [columns, dataTypes]);

  // Notify parent of changes
  useEffect(() => {
    if (Object.keys(localDataTypes)?.length > 0) {
      onDataTypesAssigned(localDataTypes);
    }
  }, [localDataTypes, onDataTypesAssigned]);

  // Auto-infer data types based on sample data
  const handleAutoInference = useCallback(() => {
    const results = {};
    
    columns?.forEach(column => {
      if (column?.sampleData) {
        const inferredType = inferDataTypeFromSamples(column?.sampleData);
        results[column.id || column.name] = {
          suggested: inferredType,
          confidence: calculateConfidence(column?.sampleData, inferredType),
          current: localDataTypes?.[column?.id || column?.name] || 'text'
        };
      }
    });
    
    setAutoInferenceResults(results);
  }, [columns, localDataTypes]);

  // Infer data type from sample values
  const inferDataTypeFromSamples = (samples) => {
    if (!samples || samples?.length === 0) return 'text';
    
    const validSamples = samples?.filter(s => s !== null && s !== '');
    if (validSamples?.length === 0) return 'text';
    
    // Check each type in order of specificity
    for (const [type, definition] of Object.entries(dataTypeDefinitions)) {
      if (!definition?.validation) continue;
      
      const matches = validSamples?.filter(sample => 
        definition?.validation?.test(String(sample))
      );
      
      if (matches?.length / validSamples?.length > 0.8) {
        return type;
      }
    }
    
    return 'text';
  };

  // Calculate confidence score for inference
  const calculateConfidence = (samples, type) => {
    const definition = dataTypeDefinitions?.[type];
    if (!definition?.validation || !samples) return 0;
    
    const validSamples = samples?.filter(s => s !== null && s !== '');
    if (validSamples?.length === 0) return 0;
    
    const matches = validSamples?.filter(sample => 
      definition?.validation?.test(String(sample))
    );
    
    return Math.round((matches?.length / validSamples?.length) * 100);
  };

  // Update data type for a column
  const handleDataTypeChange = useCallback((columnId, newType) => {
    setLocalDataTypes(prev => ({
      ...prev,
      [columnId]: newType
    }));
  }, []);

  // Apply auto-inference suggestions
  const handleApplyAutoInference = useCallback(() => {
    const updates = {};
    Object.entries(autoInferenceResults)?.forEach(([columnId, result]) => {
      if (result?.confidence > 70) {
        updates[columnId] = result?.suggested;
      }
    });
    setLocalDataTypes(prev => ({ ...prev, ...updates }));
    setAutoInferenceResults({});
  }, [autoInferenceResults]);

  // Get data type options for select
  const getDataTypeOptions = () => {
    const basicTypes = Object.entries(dataTypeDefinitions)?.filter(([_, def]) => def?.category === 'basic')?.map(([key, def]) => ({ value: key, label: def?.label }));
    
    if (!showAdvancedTypes) {
      return basicTypes;
    }
    
    const advancedTypes = Object.entries(dataTypeDefinitions)?.filter(([_, def]) => def?.category === 'advanced')?.map(([key, def]) => ({ value: key, label: def?.label }));
    
    return [
      ...basicTypes,
      { value: 'divider', label: '--- Advanced Types ---', disabled: true },
      ...advancedTypes
    ];
  };

  // Validate data type compatibility
  const validateDataTypeCompatibility = (columnId, samples) => {
    const dataType = localDataTypes?.[columnId];
    const definition = dataTypeDefinitions?.[dataType];
    
    if (!definition?.validation || !samples) return { valid: true, errors: [] };
    
    const errors = [];
    const invalidSamples = samples?.filter(sample => 
      sample && !definition?.validation?.test(String(sample))
    );
    
    if (invalidSamples?.length > 0) {
      errors?.push(`${invalidSamples?.length} value(s) don't match ${definition?.label} format`);
    }
    
    return {
      valid: errors?.length === 0,
      errors,
      invalidSamples: invalidSamples?.slice(0, 3) // Show first 3 examples
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Type Management</h2>
          <p className="text-gray-600">Assign appropriate data types to optimize storage and validation</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedTypes(!showAdvancedTypes)}
          >
            {showAdvancedTypes ? 'Hide' : 'Show'} Advanced Types
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoInference}
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            Auto-Infer
          </Button>
        </div>
      </div>
      {/* Auto-Inference Results */}
      {Object.keys(autoInferenceResults)?.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Auto-Inference Suggestions</span>
            </div>
            <Button
              size="sm"
              onClick={handleApplyAutoInference}
              disabled={!Object.values(autoInferenceResults)?.some(r => r?.confidence > 70)}
            >
              Apply High-Confidence Suggestions
            </Button>
          </div>
          
          <div className="space-y-2">
            {Object.entries(autoInferenceResults)?.map(([columnId, result]) => {
              const column = columns?.find(c => (c?.id || c?.name) === columnId);
              if (!column) return null;
              
              return (
                <div key={columnId} className="flex items-center justify-between text-sm">
                  <span className="text-blue-800">
                    {column?.name}: {result?.current} → {result?.suggested}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      result?.confidence > 90 ? 'bg-green-100 text-green-800' :
                      result?.confidence > 70 ? 'bg-yellow-100 text-yellow-800': 'bg-red-100 text-red-800'
                    }`}>
                      {result?.confidence}% confidence
                    </span>
                    {result?.confidence > 70 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDataTypeChange(columnId, result?.suggested)}
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Column Data Types */}
      <div className="space-y-4">
        {columns?.map((column) => {
          const columnId = column?.id || column?.name;
          const currentType = localDataTypes?.[columnId] || 'text';
          const definition = dataTypeDefinitions?.[currentType];
          const validation = column?.sampleData ? validateDataTypeCompatibility(columnId, column?.sampleData) : { valid: true, errors: [] };
          
          return (
            <div key={columnId} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                {/* Column Info */}
                <div>
                  <div className="font-medium text-gray-900 mb-1">
                    {column?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {column?.comment || 'No description'}
                  </div>
                  {column?.sampleData && column?.sampleData?.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Sample: {column?.sampleData?.slice(0, 3)?.join(', ')}
                      {column?.sampleData?.length > 3 && '...'}
                    </div>
                  )}
                </div>

                {/* Data Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Type
                  </label>
                  <Select
                    value={currentType}
                    onChange={(value) => handleDataTypeChange(columnId, value)}
                    options={getDataTypeOptions()}
                  />
                  {definition && (
                    <div className="mt-1 text-xs text-gray-500">
                      {definition?.description}
                    </div>
                  )}
                </div>

                {/* Validation Status */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Validation Status
                  </div>
                  {validation?.valid ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">All values compatible</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">Validation issues</span>
                      </div>
                      {validation?.errors?.map((error, index) => (
                        <div key={index} className="text-xs text-red-600">
                          • {error}
                        </div>
                      ))}
                      {validation?.invalidSamples && validation?.invalidSamples?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Examples: {validation?.invalidSamples?.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Data Type Summary */}
      {columns?.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Data Type Distribution</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(
              columns?.reduce((acc, column) => {
                const type = localDataTypes?.[column?.id || column?.name] || 'text';
                const definition = dataTypeDefinitions?.[type];
                const label = definition?.label || type;
                acc[label] = (acc?.[label] || 0) + 1;
                return acc;
              }, {})
            )?.map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="text-gray-600">{type}:</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTypeManager;