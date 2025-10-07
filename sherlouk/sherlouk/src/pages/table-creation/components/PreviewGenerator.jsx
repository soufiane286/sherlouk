import React, { useState, useEffect } from 'react';
import { Eye, Code, Database, Download, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';

const PreviewGenerator = ({ columns = [], previewData = [], dataTypes = {}, validationRules = {}, method }) => {
  const [previewMode, setPreviewMode] = useState('table');
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [sampleData, setSampleData] = useState([]);

  // Generate SQL CREATE TABLE statement
  useEffect(() => {
    if (columns?.length > 0) {
      let sql = generateCreateTableSQL();
      setGeneratedSQL(sql);
    }
  }, [columns, dataTypes, validationRules]);

  // Generate sample data
  useEffect(() => {
    if (previewData?.length > 0) {
      setSampleData(previewData);
    } else if (columns?.length > 0 && method === 'manual') {
      setSampleData(generateSampleData());
    }
  }, [columns, previewData, method]);

  // Generate CREATE TABLE SQL
  const generateCreateTableSQL = () => {
    if (!columns?.length) return '';

    const tableName = 'my_table';
    let sql = `CREATE TABLE ${tableName} (\n`;

    const columnDefinitions = columns?.map((column, index) => {
      const columnId = column?.id || column?.name;
      const dataType = dataTypes?.[columnId] || column?.dataType || 'text';
      const rules = validationRules?.[columnId] || [];
      
      let def = `  ${column?.name} ${getSQLDataType(dataType, rules)}`;
      
      // Add constraints
      if (column?.primaryKey) {
        def += ' PRIMARY KEY';
      } else {
        if (!column?.nullable) {
          def += ' NOT NULL';
        }
        if (column?.unique) {
          def += ' UNIQUE';
        }
      }
      
      // Add default value
      if (column?.defaultValue) {
        def += ` DEFAULT '${column?.defaultValue}'`;
      }
      
      return def;
    });

    sql += columnDefinitions?.join(',\n');
    sql += '\n);';

    // Add comments
    const commentsSQL = columns?.filter(col => col?.comment)?.map(col => `COMMENT ON COLUMN ${tableName}.${col?.name} IS '${col?.comment}';`)?.join('\n');

    if (commentsSQL) {
      sql += '\n\n-- Column Comments\n' + commentsSQL;
    }

    return sql;
  };

  // Convert data type to SQL type
  const getSQLDataType = (dataType, rules = []) => {
    const maxLengthRule = rules?.find(r => r?.type === 'maxLength');
    const precisionRule = rules?.find(r => r?.type === 'precision');
    const scaleRule = rules?.find(r => r?.type === 'scale');

    switch (dataType) {
      case 'text':
        return maxLengthRule && maxLengthRule?.value 
          ? `VARCHAR(${maxLengthRule?.value})` 
          : 'TEXT';
      case 'integer':
        return 'INTEGER';
      case 'decimal':
        if (precisionRule && scaleRule) {
          return `DECIMAL(${precisionRule?.value}, ${scaleRule?.value})`;
        }
        return 'DECIMAL(10, 2)';
      case 'boolean':
        return 'BOOLEAN';
      case 'date':
        return 'DATE';
      case 'datetime':
        return 'TIMESTAMP';
      case 'email': case'url': case'phone':
        return 'VARCHAR(255)';
      case 'uuid':
        return 'UUID';
      case 'json':
        return 'JSON';
      case 'currency':
        return 'DECIMAL(15, 2)';
      default:
        return 'TEXT';
    }
  };

  // Generate sample data for manual mode
  const generateSampleData = () => {
    const samples = [];
    
    for (let i = 0; i < 5; i++) {
      const row = { _rowIndex: i };
      
      columns?.forEach(column => {
        const columnId = column?.id || column?.name;
        const dataType = dataTypes?.[columnId] || column?.dataType || 'text';
        row[column.name] = generateSampleValue(dataType, i);
      });
      
      samples?.push(row);
    }
    
    return samples;
  };

  // Generate sample value based on data type
  const generateSampleValue = (dataType, index) => {
    switch (dataType) {
      case 'text':
        return `Sample text ${index + 1}`;
      case 'integer':
        return Math.floor(Math.random() * 1000) + 1;
      case 'decimal':
        return (Math.random() * 1000)?.toFixed(2);
      case 'boolean':
        return Math.random() > 0.5;
      case 'date':
        const date = new Date();
        date?.setDate(date?.getDate() + index);
        return date?.toISOString()?.split('T')?.[0];
      case 'datetime':
        const datetime = new Date();
        datetime?.setHours(datetime?.getHours() + index);
        return datetime?.toISOString();
      case 'email':
        return `user${index + 1}@example.com`;
      case 'url':
        return `https://example.com/page${index + 1}`;
      case 'phone':
        return `+1-555-${String(index + 1)?.padStart(4, '0')}`;
      case 'uuid':
        return `550e8400-e29b-41d4-a716-44665544000${index}`;
      case 'currency':
        return (Math.random() * 10000)?.toFixed(2);
      default:
        return `Value ${index + 1}`;
    }
  };

  // Copy SQL to clipboard
  const handleCopySQL = async () => {
    try {
      await navigator.clipboard?.writeText(generatedSQL);
      // You could show a toast notification here
    } catch (err) {
      console.error('Failed to copy SQL:', err);
    }
  };

  // Export preview data as JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(sampleData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'table_preview.json';
    
    const linkElement = document.createElement('a');
    linkElement?.setAttribute('href', dataUri);
    linkElement?.setAttribute('download', exportFileDefaultName);
    linkElement?.click();
  };

  // Refresh sample data
  const handleRefreshSample = () => {
    if (method === 'manual') {
      setSampleData(generateSampleData());
    }
  };

  if (!columns?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-12">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Available</h3>
          <p className="text-gray-600">Configure your table columns to see a preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
          <div className="flex items-center gap-2">
            {method === 'manual' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshSample}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              disabled={!sampleData?.length}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Preview Mode Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setPreviewMode('table')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            Table View
          </button>
          
          <button
            onClick={() => setPreviewMode('sql')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'sql' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Code className="w-4 h-4" />
            SQL Schema
          </button>
          
          <button
            onClick={() => setPreviewMode('structure')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'structure' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-4 h-4" />
            Structure
          </button>
        </div>
      </div>
      {/* Preview Content */}
      <div className="p-4">
        {previewMode === 'table' && (
          <div className="space-y-4">
            {sampleData?.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns?.map((column) => (
                        <th
                          key={column?.id || column?.name}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex flex-col">
                            <span>{column?.name}</span>
                            <span className="text-xs text-gray-400 normal-case">
                              {dataTypes?.[column?.id || column?.name] || column?.dataType || 'text'}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleData?.map((row, index) => (
                      <tr key={index}>
                        {columns?.map((column) => (
                          <td
                            key={column?.id || column?.name}
                            className="px-4 py-2 text-sm text-gray-900 max-w-32 truncate"
                            title={String(row?.[column?.name])}
                          >
                            {String(row?.[column?.name])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No sample data available
              </div>
            )}
            
            <div className="text-xs text-gray-500 text-center">
              {method === 'csv' ? 'Showing preview from CSV file' : 'Showing generated sample data'}
            </div>
          </div>
        )}

        {previewMode === 'sql' && (
          <div className="space-y-4">
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{generatedSQL}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySQL}
                className="absolute top-2 right-2"
              >
                Copy
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              SQL DDL statement for creating your table structure
            </div>
          </div>
        )}

        {previewMode === 'structure' && (
          <div className="space-y-4">
            {columns?.map((column) => {
              const columnId = column?.id || column?.name;
              const columnDataType = dataTypes?.[columnId] || column?.dataType || 'text';
              const columnRules = validationRules?.[columnId] || [];
              
              return (
                <div key={columnId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{column?.name}</h4>
                    <div className="flex items-center gap-2">
                      {column?.primaryKey && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          PRIMARY
                        </span>
                      )}
                      {column?.unique && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          UNIQUE
                        </span>
                      )}
                      {!column?.nullable && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          NOT NULL
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-medium">{columnDataType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Nullable:</span>
                      <span className="ml-2 font-medium">{column?.nullable ? 'Yes' : 'No'}</span>
                    </div>
                    {column?.defaultValue && (
                      <div>
                        <span className="text-gray-600">Default:</span>
                        <span className="ml-2 font-medium">{column?.defaultValue}</span>
                      </div>
                    )}
                    {columnRules?.length > 0 && (
                      <div>
                        <span className="text-gray-600">Rules:</span>
                        <span className="ml-2 font-medium">{columnRules?.length}</span>
                      </div>
                    )}
                  </div>
                  {column?.comment && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Comment:</span> {column?.comment}
                    </div>
                  )}
                  {columnRules?.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Validation Rules:</span>
                      <ul className="mt-1 space-y-1">
                        {columnRules?.map((rule) => (
                          <li key={rule?.id} className="text-xs text-gray-600">
                            • {rule?.type}: {typeof rule?.value === 'boolean' ? (rule?.value ? 'enabled' : 'disabled') : rule?.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Summary Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              <strong>{columns?.length}</strong> column{columns?.length !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-600">
              <strong>{Object.values(validationRules)?.reduce((sum, rules) => sum + rules?.length, 0)}</strong> validation rule{Object.values(validationRules)?.reduce((sum, rules) => sum + rules?.length, 0) !== 1 ? 's' : ''}
            </span>
            {sampleData?.length > 0 && (
              <span className="text-gray-600">
                <strong>{sampleData?.length}</strong> sample row{sampleData?.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="text-gray-500">
            Updated automatically
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewGenerator;