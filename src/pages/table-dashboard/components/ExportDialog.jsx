import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportDialog = ({ isOpen, onClose, onExport, tableName }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const exportFormats = [
    { value: 'csv', label: 'CSV', icon: 'FileText', description: 'Comma-separated values' },
    { value: 'excel', label: 'Excel', icon: 'FileSpreadsheet', description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF', icon: 'FileText', description: 'Portable document format' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        format: exportFormat,
        includeHeaders,
        columns: selectedColumns
      });
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-popover border border-border rounded-lg w-full max-w-lg elevation-2">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-popover-foreground">
                  Export Table
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tableName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                iconName="X"
                iconSize={20}
              />
            </div>

            <div className="space-y-6">
              {/* Export Format */}
              <div>
                <label className="text-sm font-medium text-popover-foreground mb-3 block">
                  Export Format
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {exportFormats?.map((format) => (
                    <label
                      key={format?.value}
                      className={`
                        flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-smooth
                        ${exportFormat === format?.value 
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="exportFormat"
                        value={format?.value}
                        checked={exportFormat === format?.value}
                        onChange={(e) => setExportFormat(e?.target?.value)}
                        className="sr-only"
                      />
                      <Icon 
                        name={format?.icon} 
                        size={20} 
                        className={exportFormat === format?.value ? 'text-primary' : 'text-muted-foreground'} 
                      />
                      <div className="flex-1">
                        <p className="font-medium text-popover-foreground">{format?.label}</p>
                        <p className="text-xs text-muted-foreground">{format?.description}</p>
                      </div>
                      {exportFormat === format?.value && (
                        <Icon name="Check" size={16} className="text-primary" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="text-sm font-medium text-popover-foreground mb-3 block">
                  Export Options
                </label>
                <div className="space-y-3">
                  <Checkbox
                    label="Include column headers"
                    checked={includeHeaders}
                    onChange={(e) => setIncludeHeaders(e?.target?.checked)}
                  />
                  
                  <div>
                    <label className="text-sm text-popover-foreground mb-2 block">
                      Columns to export
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="columns"
                          value="all"
                          checked={selectedColumns === 'all'}
                          onChange={(e) => setSelectedColumns(e?.target?.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm text-popover-foreground">All columns</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="columns"
                          value="visible"
                          checked={selectedColumns === 'visible'}
                          onChange={(e) => setSelectedColumns(e?.target?.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm text-popover-foreground">Visible columns only</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Info */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Export Preview:</p>
                    <p>Format: {exportFormats?.find(f => f?.value === exportFormat)?.label}</p>
                    <p>Headers: {includeHeaders ? 'Included' : 'Excluded'}</p>
                    <p>Columns: {selectedColumns === 'all' ? 'All columns' : 'Visible only'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                loading={isExporting}
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                {isExporting ? 'Exporting...' : 'Export Table'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportDialog;