import React, { useState, useCallback, useRef } from 'react';
import { Upload, File, X, Check, AlertTriangle, Settings, Eye } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FileHandler = ({ onFileProcessed, fileData }) => {
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parseConfig, setParseConfig] = useState({
    delimiter: 'auto',
    encoding: 'utf-8',
    hasHeaders: true,
    skipRows: 0
  });
  const [parseResults, setParseResults] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['text/csv', 'application/csv', 'text/plain'];
    const isValidType = validTypes?.includes(file?.type) || file?.name?.endsWith('.csv');
    
    if (!isValidType) {
      alert('Please select a valid CSV file');
      return;
    }

    // Validate file size (10MB limit)
    if (file?.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    processFile(file);
  }, []);

  // Process the uploaded file
  const processFile = useCallback(async (file) => {
    setProcessing(true);
    
    try {
      const text = await file?.text();
      const results = parseCSV(text, parseConfig);
      setParseResults(results);
      
      if (results?.success) {
        onFileProcessed({
          file: file,
          columns: results?.columns,
          preview: results?.preview,
          totalRows: results?.totalRows,
          config: parseConfig
        });
      }
    } catch (error) {
      setParseResults({
        success: false,
        error: 'Failed to parse CSV file: ' + error?.message
      });
    } finally {
      setProcessing(false);
    }
  }, [parseConfig, onFileProcessed]);

  // CSV Parser function
  const parseCSV = (text, config) => {
    try {
      const lines = text?.split('\n')?.filter(line => line?.trim());
      
      if (lines?.length === 0) {
        return { success: false, error: 'File appears to be empty' };
      }

      // Auto-detect delimiter if needed
      let delimiter = config?.delimiter;
      if (delimiter === 'auto') {
        const delimiters = [',', ';', '\t', '|'];
        const counts = delimiters?.map(d => (lines?.[0]?.match(new RegExp(d, 'g')) || [])?.length);
        delimiter = delimiters?.[counts?.indexOf(Math.max(...counts))];
      }

      // Skip specified rows
      const dataLines = lines?.slice(config?.skipRows);
      
      if (dataLines?.length === 0) {
        return { success: false, error: 'No data found after skipping rows' };
      }

      // Parse headers
      const headerLine = dataLines?.[0];
      const headers = headerLine?.split(delimiter)?.map(h => h?.trim()?.replace(/['"]/g, ''));
      
      // Generate column names if no headers
      const columns = config?.hasHeaders 
        ? headers?.map((name, index) => ({
            name: name || `Column_${index + 1}`,
            originalName: name,
            index,
            dataType: 'text' // Will be inferred later
          }))
        : headers?.map((_, index) => ({
            name: `Column_${index + 1}`,
            originalName: null,
            index,
            dataType: 'text'
          }));

      // Parse preview data (first 10 rows)
      const dataStartIndex = config?.hasHeaders ? 1 : 0;
      const previewLines = dataLines?.slice(dataStartIndex, dataStartIndex + 10);
      const preview = previewLines?.map((line, rowIndex) => {
        const values = line?.split(delimiter)?.map(v => v?.trim()?.replace(/['"]/g, ''));
        const row = { _rowIndex: rowIndex };
        columns?.forEach((col, colIndex) => {
          row[col.name] = values?.[colIndex] || '';
        });
        return row;
      });

      // Infer data types from preview data
      columns?.forEach(column => {
        const values = preview?.map(row => row?.[column?.name])?.filter(v => v !== '');
        column.dataType = inferDataType(values);
      });

      return {
        success: true,
        columns,
        preview,
        totalRows: dataLines?.length - (config?.hasHeaders ? 1 : 0),
        delimiter,
        encoding: config?.encoding
      };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  };

  // Infer data type from values
  const inferDataType = (values) => {
    if (values?.length === 0) return 'text';
    
    const patterns = {
      integer: /^-?\d+$/,
      decimal: /^-?\d+\.\d+$/,
      boolean: /^(true|false|yes|no|1|0)$/i,
      date: /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    // Check each pattern
    for (const [type, pattern] of Object.entries(patterns)) {
      if (values?.every(v => pattern?.test(v))) {
        return type;
      }
    }

    return 'text';
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    setDragOver(false);
    const file = e?.dataTransfer?.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  // Handle config changes
  const handleConfigChange = useCallback((key, value) => {
    const newConfig = { ...parseConfig, [key]: value };
    setParseConfig(newConfig);
    
    // Re-process file if uploaded
    if (uploadedFile) {
      processFile(uploadedFile);
    }
  }, [parseConfig, uploadedFile, processFile]);

  // Remove file
  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setParseResults(null);
    onFileProcessed(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileProcessed]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">File Upload</h2>
        <p className="text-gray-600">Upload your CSV file to automatically detect table structure</p>
      </div>
      {!uploadedFile ? (
        // File Upload Area
        (<div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop your CSV file here
          </h3>
          <p className="text-gray-600 mb-4">
            or click to browse and select a file
          </p>
          <Button
            onClick={() => fileInputRef?.current?.click()}
            className="mb-4"
          >
            Choose File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,application/csv"
            onChange={(e) => handleFileSelect(e?.target?.files?.[0])}
            className="hidden"
          />
          <div className="text-sm text-gray-500">
            Supported: CSV files up to 10MB
          </div>
        </div>)
      ) : (
        // File Info and Configuration
        (<div className="space-y-6">
          {/* Uploaded File Info */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">{uploadedFile?.name}</div>
                <div className="text-sm text-gray-600">
                  {(uploadedFile?.size / 1024)?.toFixed(1)} KB
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveFile}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {/* Configuration Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Parse Configuration</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delimiter
                </label>
                <Select
                  value={parseConfig?.delimiter}
                  onChange={(value) => handleConfigChange('delimiter', value)}
                  options={[
                    { value: 'auto', label: 'Auto Detect' },
                    { value: ',', label: 'Comma (,)' },
                    { value: ';', label: 'Semicolon (;)' },
                    { value: '\t', label: 'Tab' },
                    { value: '|', label: 'Pipe (|)' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Encoding
                </label>
                <Select
                  value={parseConfig?.encoding}
                  onChange={(value) => handleConfigChange('encoding', value)}
                  options={[
                    { value: 'utf-8', label: 'UTF-8' },
                    { value: 'latin1', label: 'Latin-1' },
                    { value: 'windows-1252', label: 'Windows-1252' }
                  ]}
                />
              </div>

              {showAdvanced && (
                <>
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={parseConfig?.hasHeaders}
                        onChange={(e) => handleConfigChange('hasHeaders', e?.target?.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        First row contains headers
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skip Rows
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={parseConfig?.skipRows}
                      onChange={(e) => handleConfigChange('skipRows', parseInt(e?.target?.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Processing Status */}
          {processing && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Processing file...</span>
            </div>
          )}
          {/* Parse Results */}
          {parseResults && (
            <div className={`p-4 rounded-lg ${parseResults?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {parseResults?.success ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${parseResults?.success ? 'text-green-800' : 'text-red-800'}`}>
                  {parseResults?.success ? 'File parsed successfully' : 'Parsing failed'}
                </span>
              </div>
              
              {parseResults?.success ? (
                <div className="text-sm text-green-700">
                  Found {parseResults?.columns?.length} columns and {parseResults?.totalRows} data rows
                </div>
              ) : (
                <div className="text-sm text-red-700">
                  {parseResults?.error}
                </div>
              )}
            </div>
          )}
          {/* Quick Preview */}
          {parseResults?.success && parseResults?.preview?.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Quick Preview</span>
              </div>
              
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {parseResults?.columns?.map((column) => (
                        <th key={column?.name} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {column?.name}
                          <span className="ml-1 text-xs text-gray-400">({column?.dataType})</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parseResults?.preview?.slice(0, 3)?.map((row, index) => (
                      <tr key={index}>
                        {parseResults?.columns?.map((column) => (
                          <td key={column?.name} className="px-3 py-2 text-sm text-gray-900 max-w-32 truncate">
                            {row?.[column?.name]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {parseResults?.preview?.length > 3 && (
                <div className="text-sm text-gray-600 text-center">
                  ... and {parseResults?.totalRows - 3} more rows
                </div>
              )}
            </div>
          )}
        </div>)
      )}
    </div>
  );
};

export default FileHandler;