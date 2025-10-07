import React, { useState, useCallback, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle, Trash2, Settings } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ValidationEngine = ({ columns = [], dataTypes = {}, validationRules = {}, onValidationRulesSet }) => {
  const [localRules, setLocalRules] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [showAdvancedRules, setShowAdvancedRules] = useState(false);

  // Rule templates for different data types
  const ruleTemplates = {
    text: [
      { type: 'minLength', label: 'Minimum Length', value: '' },
      { type: 'maxLength', label: 'Maximum Length', value: '' },
      { type: 'pattern', label: 'Regex Pattern', value: '' },
      { type: 'enum', label: 'Allowed Values', value: '' }
    ],
    integer: [
      { type: 'min', label: 'Minimum Value', value: '' },
      { type: 'max', label: 'Maximum Value', value: '' },
      { type: 'positive', label: 'Positive Only', value: false }
    ],
    decimal: [
      { type: 'min', label: 'Minimum Value', value: '' },
      { type: 'max', label: 'Maximum Value', value: '' },
      { type: 'precision', label: 'Precision', value: '' },
      { type: 'scale', label: 'Scale', value: '' }
    ],
    email: [
      { type: 'domain', label: 'Allowed Domains', value: '' },
      { type: 'disposable', label: 'Block Disposable', value: false }
    ],
    url: [
      { type: 'protocol', label: 'Required Protocol', value: 'https' },
      { type: 'domain', label: 'Allowed Domains', value: '' }
    ],
    date: [
      { type: 'min', label: 'Earliest Date', value: '' },
      { type: 'max', label: 'Latest Date', value: '' },
      { type: 'future', label: 'Future Dates Only', value: false }
    ]
  };

  // Initialize local rules
  useEffect(() => {
    const initialRules = {};
    columns?.forEach(column => {
      const columnId = column?.id || column?.name;
      initialRules[columnId] = validationRules?.[columnId] || [];
    });
    setLocalRules(initialRules);
  }, [columns, validationRules]);

  // Validate rules and notify parent
  useEffect(() => {
    const results = validateAllRules();
    setValidationResults(results);
    
    const isValid = Object.values(results)?.every(r => r?.valid);
    const errors = Object.values(results)?.flatMap(r => r?.errors || []);
    
    onValidationRulesSet(localRules, isValid, errors);
  }, [localRules, columns, dataTypes, onValidationRulesSet]);

  // Add validation rule to column
  const handleAddRule = useCallback((columnId, ruleType) => {
    const column = columns?.find(c => (c?.id || c?.name) === columnId);
    const dataType = dataTypes?.[columnId] || column?.dataType || 'text';
    const templates = ruleTemplates?.[dataType] || ruleTemplates?.text;
    const template = templates?.find(t => t?.type === ruleType);
    
    if (!template) return;
    
    const newRule = {
      id: `rule_${Date.now()}`,
      type: ruleType,
      value: template?.value,
      message: `Invalid ${template?.label?.toLowerCase()}`
    };
    
    setLocalRules(prev => ({
      ...prev,
      [columnId]: [...(prev?.[columnId] || []), newRule]
    }));
  }, [columns, dataTypes]);

  // Update validation rule
  const handleUpdateRule = useCallback((columnId, ruleId, updates) => {
    setLocalRules(prev => ({
      ...prev,
      [columnId]: (prev?.[columnId] || [])?.map(rule =>
        rule?.id === ruleId ? { ...rule, ...updates } : rule
      )
    }));
  }, []);

  // Remove validation rule
  const handleRemoveRule = useCallback((columnId, ruleId) => {
    setLocalRules(prev => ({
      ...prev,
      [columnId]: (prev?.[columnId] || [])?.filter(rule => rule?.id !== ruleId)
    }));
  }, []);

  // Validate all rules
  const validateAllRules = useCallback(() => {
    const results = {};
    
    Object.entries(localRules)?.forEach(([columnId, rules]) => {
      const column = columns?.find(c => (c?.id || c?.name) === columnId);
      if (!column) return;
      
      const columnResult = validateColumnRules(column, rules);
      results[columnId] = columnResult;
    });
    
    return results;
  }, [localRules, columns]);

  // Validate rules for a specific column
  const validateColumnRules = (column, rules) => {
    const errors = [];
    const warnings = [];
    
    // Check for conflicting rules
    const ruleTypes = rules?.map(r => r?.type);
    const duplicates = ruleTypes?.filter((type, index) => ruleTypes?.indexOf(type) !== index);
    
    if (duplicates?.length > 0) {
      errors?.push(`Duplicate rules found: ${duplicates?.join(', ')}`);
    }
    
    // Validate individual rules
    rules?.forEach(rule => {
      const ruleValidation = validateIndividualRule(column, rule);
      if (ruleValidation?.error) {
        errors?.push(ruleValidation?.error);
      }
      if (ruleValidation?.warning) {
        warnings?.push(ruleValidation?.warning);
      }
    });
    
    // Check rule compatibility with sample data
    if (column?.sampleData && column?.sampleData?.length > 0) {
      const sampleValidation = validateRulesAgainstSamples(column?.sampleData, rules);
      errors?.push(...sampleValidation?.errors);
      warnings?.push(...sampleValidation?.warnings);
    }
    
    return {
      valid: errors?.length === 0,
      errors,
      warnings,
      rulesCount: rules?.length
    };
  };

  // Validate individual rule
  const validateIndividualRule = (column, rule) => {
    const result = { error: null, warning: null };
    
    switch (rule?.type) {
      case 'minLength': case'maxLength':
        if (isNaN(rule?.value) || rule?.value < 0) {
          result.error = `${rule?.type} must be a non-negative number`;
        }
        break;
        
      case 'min': case'max':
        if (isNaN(rule?.value)) {
          result.error = `${rule?.type} must be a valid number`;
        }
        break;
        
      case 'pattern':
        try {
          new RegExp(rule.value);
        } catch (e) {
          result.error = 'Invalid regex pattern';
        }
        break;
        
      case 'enum':
        if (!rule?.value || rule?.value?.trim() === '') {
          result.error = 'Allowed values cannot be empty';
        }
        break;
    }
    
    return result;
  };

  // Validate rules against sample data
  const validateRulesAgainstSamples = (samples, rules) => {
    const errors = [];
    const warnings = [];
    
    const validSamples = samples?.filter(s => s !== null && s !== '');
    if (validSamples?.length === 0) return { errors, warnings };
    
    rules?.forEach(rule => {
      let failedSamples = 0;
      
      validSamples?.forEach(sample => {
        if (!validateSampleAgainstRule(sample, rule)) {
          failedSamples++;
        }
      });
      
      if (failedSamples > 0) {
        const percentage = Math.round((failedSamples / validSamples?.length) * 100);
        if (percentage > 50) {
          errors?.push(`Rule "${rule?.type}" fails for ${percentage}% of sample data`);
        } else if (percentage > 20) {
          warnings?.push(`Rule "${rule?.type}" fails for ${percentage}% of sample data`);
        }
      }
    });
    
    return { errors, warnings };
  };

  // Validate single sample against rule
  const validateSampleAgainstRule = (sample, rule) => {
    const value = String(sample);
    
    switch (rule?.type) {
      case 'minLength':
        return value?.length >= parseInt(rule?.value);
      case 'maxLength':
        return value?.length <= parseInt(rule?.value);
      case 'min':
        return parseFloat(value) >= parseFloat(rule?.value);
      case 'max':
        return parseFloat(value) <= parseFloat(rule?.value);
      case 'pattern':
        try {
          return new RegExp(rule.value)?.test(value);
        } catch {
          return false;
        }
      case 'enum':
        const allowedValues = rule?.value?.split(',')?.map(v => v?.trim());
        return allowedValues?.includes(value);
      case 'positive':
        return parseFloat(value) > 0;
      default:
        return true;
    }
  };

  // Get available rule types for a column
  const getAvailableRuleTypes = (columnId) => {
    const column = columns?.find(c => (c?.id || c?.name) === columnId);
    const dataType = dataTypes?.[columnId] || column?.dataType || 'text';
    const templates = ruleTemplates?.[dataType] || ruleTemplates?.text;
    const existingTypes = (localRules?.[columnId] || [])?.map(r => r?.type);
    
    return templates?.filter(t => !existingTypes?.includes(t?.type))?.map(t => ({ value: t?.type, label: t?.label }));
  };

  // Render rule input based on type
  const renderRuleInput = (rule, columnId) => {
    switch (rule?.type) {
      case 'positive': case'future': case'disposable':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rule?.value}
              onChange={(e) => handleUpdateRule(columnId, rule?.id, { value: e?.target?.checked })}
              className="rounded"
            />
            <span className="text-sm">Enabled</span>
          </label>
        );
      
      case 'protocol':
        return (
          <Select
            value={rule?.value}
            onChange={(value) => handleUpdateRule(columnId, rule?.id, { value })}
            options={[
              { value: 'http', label: 'HTTP' },
              { value: 'https', label: 'HTTPS' },
              { value: 'any', label: 'Any Protocol' }
            ]}
          />
        );
      
      default:
        return (
          <Input
            value={rule?.value}
            onChange={(e) => handleUpdateRule(columnId, rule?.id, { value: e?.target?.value })}
            placeholder={`Enter ${rule?.type}`}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Validation Engine</h2>
          <p className="text-gray-600">Define validation rules to ensure data quality and integrity</p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedRules(!showAdvancedRules)}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          {showAdvancedRules ? 'Hide' : 'Show'} Advanced
        </Button>
      </div>
      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Valid Columns</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {Object.values(validationResults)?.filter(r => r?.valid)?.length}
          </div>
        </div>
        
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Issues Found</span>
          </div>
          <div className="text-2xl font-bold text-red-900">
            {Object.values(validationResults)?.filter(r => !r?.valid)?.length}
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Total Rules</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {Object.values(localRules)?.reduce((sum, rules) => sum + rules?.length, 0)}
          </div>
        </div>
      </div>
      {/* Column Rules */}
      <div className="space-y-6">
        {columns?.map((column) => {
          const columnId = column?.id || column?.name;
          const columnRules = localRules?.[columnId] || [];
          const result = validationResults?.[columnId] || { valid: true, errors: [], warnings: [] };
          const availableRules = getAvailableRuleTypes(columnId);

          return (
            <div key={columnId} className="border border-gray-200 rounded-lg p-4">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-gray-900">{column?.name}</h3>
                  <span className="text-sm text-gray-500">
                    ({dataTypes?.[columnId] || column?.dataType || 'text'})
                  </span>
                  
                  {result?.valid ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  
                  {columnRules?.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {columnRules?.length} rule{columnRules?.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {availableRules?.length > 0 && (
                  <Select
                    value=""
                    onChange={(ruleType) => {
                      if (ruleType) {
                        handleAddRule(columnId, ruleType);
                      }
                    }}
                    options={[
                      { value: '', label: 'Add Rule...' },
                      ...availableRules
                    ]}
                    className="w-48"
                  />
                )}
              </div>
              {/* Validation Messages */}
              {(result?.errors?.length > 0 || result?.warnings?.length > 0) && (
                <div className="mb-4 space-y-2">
                  {result?.errors?.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  ))}
                  {result?.warnings?.map((warning, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      {warning}
                    </div>
                  ))}
                </div>
              )}
              {/* Rules List */}
              <div className="space-y-3">
                {columnRules?.map((rule) => (
                  <div key={rule?.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-24">
                      <span className="text-sm font-medium text-gray-700">
                        {ruleTemplates?.[dataTypes?.[columnId]]?.find(t => t?.type === rule?.type)?.label || rule?.type}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      {renderRuleInput(rule, columnId)}
                    </div>
                    
                    {showAdvancedRules && (
                      <div className="flex-1">
                        <Input
                          value={rule?.message || ''}
                          onChange={(e) => handleUpdateRule(columnId, rule?.id, { message: e?.target?.value })}
                          placeholder="Custom error message"
                          className="text-sm"
                        />
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveRule(columnId, rule?.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {columnRules?.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No validation rules defined
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Global Validation Status */}
      {columns?.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Validation Status</span>
            </div>
            
            <div className="text-sm text-gray-600">
              {Object.values(validationResults)?.every(r => r?.valid) ? (
                <span className="text-green-600 font-medium">All validations passing</span>
              ) : (
                <span className="text-red-600 font-medium">
                  {Object.values(validationResults)?.filter(r => !r?.valid)?.length} column{Object.values(validationResults)?.filter(r => !r?.valid)?.length !== 1 ? 's' : ''} with issues
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationEngine;