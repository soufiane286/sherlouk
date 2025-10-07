import React, { useState, useCallback } from 'react';
import { ArrowLeft, Save, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import MethodSelector from './components/MethodSelector';
import FileHandler from './components/FileHandler';
import ColumnConfigurator from './components/ColumnConfigurator';
import DataTypeManager from './components/DataTypeManager';
import ValidationEngine from './components/ValidationEngine';
import PreviewGenerator from './components/PreviewGenerator';
import CreationFinalizer from './components/CreationFinalizer';

const TableCreation = () => {
  const navigate = useNavigate();
  
  // Central state management for all components
  const [creationState, setCreationState] = useState({
    method: null, // 'csv', 'manual', 'template'
    fileData: null,
    columns: [],
    dataTypes: {},
    validationRules: {},
    previewData: [],
    tableName: '',
    isValid: false,
    errors: [],
    progress: 0
  });

  // Update creation state
  const updateCreationState = useCallback((updates) => {
    setCreationState(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle method selection
  const handleMethodSelect = useCallback((method) => {
    updateCreationState({
      method,
      progress: 20,
      errors: []
    });
  }, [updateCreationState]);

  // Handle file upload and parsing
  const handleFileProcessed = useCallback((fileData) => {
    updateCreationState({
      fileData,
      columns: fileData?.columns || [],
      previewData: fileData?.preview || [],
      progress: 40,
      errors: []
    });
  }, [updateCreationState]);

  // Handle column configuration
  const handleColumnsConfigured = useCallback((columns) => {
    updateCreationState({
      columns,
      progress: 60,
      errors: []
    });
  }, [updateCreationState]);

  // Handle data type assignments
  const handleDataTypesAssigned = useCallback((dataTypes) => {
    updateCreationState({
      dataTypes,
      progress: 70,
      errors: []
    });
  }, [updateCreationState]);

  // Handle validation rules
  const handleValidationRulesSet = useCallback((validationRules, isValid, errors) => {
    updateCreationState({
      validationRules,
      isValid,
      errors,
      progress: isValid ? 90 : 70
    });
  }, [updateCreationState]);

  // Handle table creation
  const handleTableCreated = useCallback(async (tableName) => {
    try {
      updateCreationState({
        tableName,
        progress: 100
      });
      
      // Here you would typically make an API call to create the table
      console.log('Creating table:', {
        name: tableName,
        columns: creationState?.columns,
        dataTypes: creationState?.dataTypes,
        validationRules: creationState?.validationRules
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to table dashboard on success
      navigate('/table-dashboard');
    } catch (error) {
      updateCreationState({
        errors: ['Failed to create table: ' + error?.message],
        progress: 90
      });
    }
  }, [creationState?.columns, creationState?.dataTypes, creationState?.validationRules, navigate, updateCreationState]);

  // Render progress indicator
  const renderProgressIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{creationState?.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${creationState?.progress}%` }}
        />
      </div>
    </div>
  );

  // Render error messages
  const renderErrors = () => {
    if (!creationState?.errors?.length) return null;
    
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-800 mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">Issues Found</span>
        </div>
        <ul className="text-red-700 text-sm space-y-1">
          {creationState?.errors?.map((error, index) => (
            <li key={index}>• {error}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => {}} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/table-dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Table</h1>
              <p className="text-gray-600">Build your table with CSV upload or manual configuration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={!creationState?.previewData?.length}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              size="sm"
              disabled={!creationState?.isValid || creationState?.progress < 90}
              onClick={() => document.getElementById('finalizer')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Create Table
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Error Messages */}
        {renderErrors()}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Method Selection */}
            <MethodSelector
              selectedMethod={creationState?.method}
              onMethodSelect={handleMethodSelect}
            />

            {/* File Handler - Show only for CSV method */}
            {creationState?.method === 'csv' && (
              <FileHandler
                onFileProcessed={handleFileProcessed}
                fileData={creationState?.fileData}
              />
            )}

            {/* Column Configuration - Show when we have columns */}
            {creationState?.columns?.length > 0 && (
              <ColumnConfigurator
                columns={creationState?.columns}
                method={creationState?.method}
                onColumnsConfigured={handleColumnsConfigured}
              />
            )}

            {/* Data Type Management */}
            {creationState?.columns?.length > 0 && (
              <DataTypeManager
                columns={creationState?.columns}
                dataTypes={creationState?.dataTypes}
                onDataTypesAssigned={handleDataTypesAssigned}
              />
            )}

            {/* Validation Engine */}
            {creationState?.columns?.length > 0 && (
              <ValidationEngine
                columns={creationState?.columns}
                dataTypes={creationState?.dataTypes}
                validationRules={creationState?.validationRules}
                onValidationRulesSet={handleValidationRulesSet}
              />
            )}

            {/* Creation Finalizer */}
            {creationState?.isValid && creationState?.progress >= 90 && (
              <div id="finalizer">
                <CreationFinalizer
                  creationState={creationState}
                  onTableCreated={handleTableCreated}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PreviewGenerator
                columns={creationState?.columns}
                previewData={creationState?.previewData}
                dataTypes={creationState?.dataTypes}
                validationRules={creationState?.validationRules}
                method={creationState?.method}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableCreation;