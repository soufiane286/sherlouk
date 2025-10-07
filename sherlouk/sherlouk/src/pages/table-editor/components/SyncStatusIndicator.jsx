import React from 'react';
import Icon from '../../../components/AppIcon';

const SyncStatusIndicator = ({ status, lastSync, pendingChanges }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'synced':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          text: 'Synced',
          description: 'All changes saved to database'
        };
      case 'syncing':
        return {
          icon: 'RefreshCw',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          text: 'Syncing...',
          description: 'Saving changes to database'
        };
      case 'pending':
        return {
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          text: 'Pending',
          description: `${pendingChanges} changes waiting to sync`
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          text: 'Sync Error',
          description: 'Failed to sync with database'
        };
      case 'offline':
        return {
          icon: 'WifiOff',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          text: 'Offline',
          description: 'No database connection'
        };
      default:
        return {
          icon: 'Database',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          text: 'Unknown',
          description: 'Database status unknown'
        };
    }
  };

  const config = getStatusConfig();
  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffMs = now - syncTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return syncTime?.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config?.bgColor}`}>
            <Icon 
              name={config?.icon} 
              size={20} 
              className={`${config?.color} ${status === 'syncing' ? 'animate-spin' : ''}`} 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Database Status: {config?.text}
              </span>
              {status === 'pending' && pendingChanges > 0 && (
                <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">
                  {pendingChanges}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {config?.description}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Last sync</p>
          <p className="text-sm font-medium text-foreground">
            {formatLastSync(lastSync)}
          </p>
        </div>
      </div>
      {/* Progress bar for syncing */}
      {status === 'syncing' && (
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-1">
            <div className="bg-warning h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncStatusIndicator;