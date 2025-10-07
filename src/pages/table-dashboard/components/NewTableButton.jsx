import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NewTableButton = ({ onFileUpload, userRole }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  const canCreate = userRole === 'Admin' || userRole === 'Editor';

  const handleDragOver = (e) => {
    e?.preventDefault();
    if (canCreate) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    if (!canCreate) return;
    
    const files = Array.from(e?.dataTransfer?.files);
    const csvFiles = files?.filter(file => file?.type === 'text/csv' || file?.name?.endsWith('.csv'));
    
    if (csvFiles?.length > 0) {
      onFileUpload(csvFiles?.[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file && canCreate) {
      onFileUpload(file);
      setShowUploadModal(false);
    }
  };

  const handleButtonClick = () => {
    if (!canCreate) return;
    setShowUploadModal(true);
  };

  if (!canCreate) {
    return (
      <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Icon name="Lock" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          View Only Access
        </h3>
        <p className="text-sm text-muted-foreground">
          Contact your administrator to create new tables
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`
          bg-card border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-smooth hover:elevation-1
          ${isDragOver 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <Icon 
          name="Upload" 
          size={48} 
          className={`mx-auto mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} 
        />
        <h3 className="text-lg font-medium text-card-foreground mb-2">
          Create New Table
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a CSV file or drag and drop to get started
        </p>
        <Button variant="outline" size="sm">
          Choose File
        </Button>
      </div>
      {/* Upload Modal */}
      {showUploadModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50" 
            onClick={() => setShowUploadModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-popover border border-border rounded-lg w-full max-w-md elevation-2">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-popover-foreground">
                    Upload CSV File
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUploadModal(false)}
                    iconName="X"
                    iconSize={20}
                  />
                </div>
                
                <div className="space-y-4">
                  <div
                    className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                      transition-smooth
                      ${isDragOver 
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef?.current?.click()}
                  >
                    <Icon 
                      name="FileText" 
                      size={32} 
                      className={`mx-auto mb-3 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} 
                    />
                    <p className="text-sm text-popover-foreground font-medium mb-1">
                      Drop your CSV file here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Icon name="Info" size={16} className="text-primary mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Supported format:</p>
                      <p>CSV files with headers in the first row</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NewTableButton;