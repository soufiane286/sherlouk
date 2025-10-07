import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TableCard = ({ table, onEdit, onClone, onExport, onDelete, userRole }) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSyncStatusColor = (status) => {
    switch (status) {
      case 'synced':
        return 'text-success';
      case 'syncing':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'synced':
        return 'CheckCircle';
      case 'syncing':
        return 'RefreshCw';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Database';
    }
  };

  const canEdit = userRole === 'Admin' || userRole === 'Editor';
  const canDelete = userRole === 'Admin';

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:elevation-2 transition-smooth group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-card-foreground truncate mb-1">
            {table?.name}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Table" size={14} />
              {table?.rowCount?.toLocaleString()} rows
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              {formatDate(table?.lastModified)}
            </span>
          </div>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowActions(!showActions)}
            className="opacity-0 group-hover:opacity-100 transition-smooth"
          >
            <Icon name="MoreVertical" size={16} />
          </Button>

          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg elevation-2 z-50 glass-morphism">
                <div className="p-2">
                  <button
                    onClick={() => {
                      onEdit(table?.id);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth"
                  >
                    <Icon name="Edit" size={16} />
                    Edit Table
                  </button>
                  
                  {canEdit && (
                    <button
                      onClick={() => {
                        onClone(table?.id);
                        setShowActions(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth"
                    >
                      <Icon name="Copy" size={16} />
                      Clone Table
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      onExport(table?.id);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth"
                  >
                    <Icon name="Download" size={16} />
                    Export
                  </button>
                  
                  {canDelete && (
                    <>
                      <div className="my-2 border-t border-border" />
                      <button
                        onClick={() => {
                          onDelete(table?.id);
                          setShowActions(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-smooth"
                      >
                        <Icon name="Trash2" size={16} />
                        Delete Table
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Sync Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon 
            name={getSyncStatusIcon(table?.syncStatus)} 
            size={16} 
            className={getSyncStatusColor(table?.syncStatus)}
          />
          <span className={`text-sm font-medium ${getSyncStatusColor(table?.syncStatus)}`}>
            {table?.syncStatus === 'synced' && 'Synced'}
            {table?.syncStatus === 'syncing' && 'Syncing...'}
            {table?.syncStatus === 'error' && 'Sync Error'}
            {table?.syncStatus === 'offline' && 'Offline'}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Icon name="Shield" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{userRole}</span>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(table?.id)}
          className="flex-1"
          iconName="Edit"
          iconPosition="left"
          iconSize={14}
        >
          Edit
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExport(table?.id)}
          iconName="Download"
          iconSize={14}
        >
          <span className="sr-only">Export</span>
        </Button>
        
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClone(table?.id)}
            iconName="Copy"
            iconSize={14}
          >
            <span className="sr-only">Clone</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableCard;