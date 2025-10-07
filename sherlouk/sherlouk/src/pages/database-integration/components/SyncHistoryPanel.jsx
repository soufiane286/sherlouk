import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SyncHistoryPanel = () => {
  const [filters, setFilters] = useState({
    dateRange: 'last_7_days',
    table: '',
    status: '',
    operation: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Mock sync history data
  const syncHistory = [
    {
      id: 1,
      timestamp: '2025-10-01T21:45:32Z',
      table: 'users → user_accounts',
      operation: 'Bidirectional Sync',
      status: 'success',
      recordsProcessed: 1245,
      recordsUpdated: 23,
      recordsInserted: 5,
      recordsDeleted: 2,
      duration: 2.3,
      message: 'Sync completed successfully'
    },
    {
      id: 2,
      timestamp: '2025-10-01T21:30:15Z',
      table: 'products → product_catalog',
      operation: 'Read Only Sync',
      status: 'success',
      recordsProcessed: 3567,
      recordsUpdated: 0,
      recordsInserted: 45,
      recordsDeleted: 0,
      duration: 4.7,
      message: 'Read sync completed'
    },
    {
      id: 3,
      timestamp: '2025-10-01T21:15:08Z',
      table: 'orders → order_history',
      operation: 'Write Only Sync',
      status: 'error',
      recordsProcessed: 0,
      recordsUpdated: 0,
      recordsInserted: 0,
      recordsDeleted: 0,
      duration: 0.1,
      message: 'Connection timeout - unable to reach MySQL server'
    },
    {
      id: 4,
      timestamp: '2025-10-01T21:00:42Z',
      table: 'customers → customer_data',
      operation: 'Bidirectional Sync',
      status: 'warning',
      recordsProcessed: 2134,
      recordsUpdated: 156,
      recordsInserted: 12,
      recordsDeleted: 0,
      duration: 3.1,
      message: '3 records had validation conflicts and were skipped'
    },
    {
      id: 5,
      timestamp: '2025-10-01T20:45:19Z',
      table: 'inventory → stock_levels',
      operation: 'Real-time Sync',
      status: 'success',
      recordsProcessed: 4789,
      recordsUpdated: 234,
      recordsInserted: 67,
      recordsDeleted: 12,
      duration: 1.8,
      message: 'Real-time sync completed'
    }
  ];

  const dateRangeOptions = [
    { value: 'last_hour', label: 'Last Hour' },
    { value: 'last_24_hours', label: 'Last 24 Hours' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const tableOptions = [
    { value: '', label: 'All Tables' },
    { value: 'users', label: 'Users Table' },
    { value: 'products', label: 'Products Table' },
    { value: 'orders', label: 'Orders Table' },
    { value: 'customers', label: 'Customers Table' },
    { value: 'inventory', label: 'Inventory Table' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ];

  const operationOptions = [
    { value: '', label: 'All Operations' },
    { value: 'bidirectional', label: 'Bidirectional Sync' },
    { value: 'read_only', label: 'Read Only Sync' },
    { value: 'write_only', label: 'Write Only Sync' },
    { value: 'real_time', label: 'Real-time Sync' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success bg-success/10 border-success';
      case 'warning': return 'text-warning bg-warning/10 border-warning';
      case 'error': return 'text-destructive bg-destructive/10 border-destructive';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    if (seconds < 1) return `${(seconds * 1000)?.toFixed(0)}ms`;
    return `${seconds?.toFixed(1)}s`;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Sync History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View detailed logs of all synchronization operations and their results
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export Logs
          </Button>
          <Button variant="outline" iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-card-foreground mb-4">Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
          
          <Select
            label="Table"
            options={tableOptions}
            value={filters?.table}
            onChange={(value) => handleFilterChange('table', value)}
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
          
          <Select
            label="Operation"
            options={operationOptions}
            value={filters?.operation}
            onChange={(value) => handleFilterChange('operation', value)}
          />
          
          <Input
            label="Search"
            type="search"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-success mb-1">156</div>
          <div className="text-sm text-muted-foreground">Successful Syncs</div>
          <div className="text-xs text-success mt-1">+12 today</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-warning mb-1">8</div>
          <div className="text-sm text-muted-foreground">Warnings</div>
          <div className="text-xs text-warning mt-1">2 unresolved</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-destructive mb-1">3</div>
          <div className="text-sm text-muted-foreground">Errors</div>
          <div className="text-xs text-destructive mt-1">1 recent</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-card-foreground mb-1">2.4s</div>
          <div className="text-sm text-muted-foreground">Avg Duration</div>
          <div className="text-xs text-success mt-1">-0.3s improved</div>
        </div>
      </div>
      {/* History Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-card-foreground">Timestamp</th>
                <th className="text-left p-4 font-medium text-card-foreground">Table Mapping</th>
                <th className="text-left p-4 font-medium text-card-foreground">Operation</th>
                <th className="text-left p-4 font-medium text-card-foreground">Status</th>
                <th className="text-left p-4 font-medium text-card-foreground">Records</th>
                <th className="text-left p-4 font-medium text-card-foreground">Duration</th>
                <th className="text-left p-4 font-medium text-card-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {syncHistory?.map((entry) => (
                <tr key={entry?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                  <td className="p-4">
                    <div className="text-sm text-card-foreground">{formatTimestamp(entry?.timestamp)}</div>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm font-medium text-card-foreground">{entry?.table}</div>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm text-card-foreground">{entry?.operation}</div>
                  </td>
                  
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(entry?.status)}`}>
                      <Icon name={getStatusIcon(entry?.status)} size={12} />
                      {entry?.status?.charAt(0)?.toUpperCase() + entry?.status?.slice(1)}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm text-card-foreground">
                      {entry?.recordsProcessed?.toLocaleString()} processed
                    </div>
                    {entry?.recordsUpdated > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {entry?.recordsUpdated} updated, {entry?.recordsInserted} inserted
                      </div>
                    )}
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm text-card-foreground">{formatDuration(entry?.duration)}</div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Icon name="Eye" size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Icon name="Download" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing 1-5 of 167 sync operations
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <Button variant="outline" size="sm">
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncHistoryPanel;