import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectionCard = ({ connection, onEdit, onDelete, onToggleStatus }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10 border-success';
      case 'inactive': return 'text-muted-foreground bg-muted border-border';
      case 'error': return 'text-destructive bg-destructive/10 border-destructive';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'inactive': return 'Circle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/20 transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-card-foreground">{connection?.name}</h3>
            <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(connection?.status)}`}>
              <div className="flex items-center gap-1">
                <Icon name={getStatusIcon(connection?.status)} size={12} />
                {connection?.status?.charAt(0)?.toUpperCase() + connection?.status?.slice(1)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Server" size={14} />
              {connection?.host}:{connection?.port}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Database" size={14} />
              {connection?.database}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDetails(!showDetails)}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Icon name={showDetails ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(connection)}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="Edit" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(connection)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-semibold text-card-foreground">{connection?.syncedTables || 0}</div>
          <div className="text-xs text-muted-foreground">Synced Tables</div>
        </div>
        
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-semibold text-card-foreground">{connection?.totalRecords || 0}</div>
          <div className="text-xs text-muted-foreground">Total Records</div>
        </div>
        
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-semibold text-card-foreground">{formatLastSync(connection?.lastSync)}</div>
          <div className="text-xs text-muted-foreground">Last Sync</div>
        </div>
        
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-semibold text-card-foreground">{connection?.avgResponseTime || 0}ms</div>
          <div className="text-xs text-muted-foreground">Avg Response</div>
        </div>
      </div>
      {/* Detailed Information */}
      {showDetails && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Connection Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="text-card-foreground">{connection?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SSL:</span>
                  <span className="text-card-foreground">{connection?.useSSL ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timeout:</span>
                  <span className="text-card-foreground">{connection?.connectionTimeout}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Connections:</span>
                  <span className="text-card-foreground">{connection?.maxConnections}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Sync Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-card-foreground">{new Date(connection.createdAt)?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="text-card-foreground">{new Date(connection.updatedAt)?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Tested:</span>
                  <span className="text-card-foreground">
                    {connection?.lastTested ? new Date(connection.lastTested)?.toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(connection)}
              iconName={connection?.status === 'active' ? 'Pause' : 'Play'}
              iconPosition="left"
            >
              {connection?.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
            >
              Test Connection
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
            >
              Force Sync
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionCard;