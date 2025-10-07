import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const TableMappingPanel = ({ connections, onSaveMapping }) => {
  const [selectedConnection, setSelectedConnection] = useState('');
  const [mappings, setMappings] = useState([]);
  const [showAddMapping, setShowAddMapping] = useState(false);

  // Mock SHERLOUK tables
  const sherloukTables = [
    { value: 'users', label: 'Users Table', description: '1,245 rows' },
    { value: 'products', label: 'Products Table', description: '3,567 rows' },
    { value: 'orders', label: 'Orders Table', description: '8,901 rows' },
    { value: 'customers', label: 'Customers Table', description: '2,134 rows' },
    { value: 'inventory', label: 'Inventory Table', description: '4,789 rows' }
  ];

  // Mock MySQL tables
  const mysqlTables = [
    { value: 'user_accounts', label: 'user_accounts', description: 'User management table' },
    { value: 'product_catalog', label: 'product_catalog', description: 'Product information' },
    { value: 'order_history', label: 'order_history', description: 'Order tracking' },
    { value: 'customer_data', label: 'customer_data', description: 'Customer profiles' },
    { value: 'stock_levels', label: 'stock_levels', description: 'Inventory tracking' }
  ];

  const syncDirections = [
    { value: 'bidirectional', label: 'Bidirectional', description: 'Read and write both ways' },
    { value: 'read_only', label: 'Read Only', description: 'SHERLOUK reads from MySQL' },
    { value: 'write_only', label: 'Write Only', description: 'SHERLOUK writes to MySQL' }
  ];

  const syncSchedules = [
    { value: 'real_time', label: 'Real-time', description: 'Instant synchronization' },
    { value: 'every_5min', label: 'Every 5 minutes', description: 'High frequency sync' },
    { value: 'every_15min', label: 'Every 15 minutes', description: 'Regular sync' },
    { value: 'hourly', label: 'Hourly', description: 'Standard sync' },
    { value: 'daily', label: 'Daily', description: 'Low frequency sync' },
    { value: 'manual', label: 'Manual', description: 'Sync on demand only' }
  ];

  const [newMapping, setNewMapping] = useState({
    sherloukTable: '',
    mysqlTable: '',
    syncDirection: 'bidirectional',
    syncSchedule: 'every_15min',
    enabled: true,
    fieldMappings: []
  });

  // Mock existing mappings
  const existingMappings = [
    {
      id: 1,
      sherloukTable: 'users',
      mysqlTable: 'user_accounts',
      syncDirection: 'bidirectional',
      syncSchedule: 'every_5min',
      enabled: true,
      lastSync: '2025-10-01T21:45:00Z',
      status: 'active',
      recordsSync: 1245
    },
    {
      id: 2,
      sherloukTable: 'products',
      mysqlTable: 'product_catalog',
      syncDirection: 'read_only',
      syncSchedule: 'hourly',
      enabled: true,
      lastSync: '2025-10-01T21:00:00Z',
      status: 'active',
      recordsSync: 3567
    },
    {
      id: 3,
      sherloukTable: 'orders',
      mysqlTable: 'order_history',
      syncDirection: 'write_only',
      syncSchedule: 'real_time',
      enabled: false,
      lastSync: '2025-10-01T20:30:00Z',
      status: 'paused',
      recordsSync: 0
    }
  ];

  const handleAddMapping = () => {
    const mapping = {
      ...newMapping,
      id: Date.now(),
      lastSync: null,
      status: newMapping?.enabled ? 'active' : 'paused',
      recordsSync: 0
    };
    
    onSaveMapping(mapping);
    setNewMapping({
      sherloukTable: '',
      mysqlTable: '',
      syncDirection: 'bidirectional',
      syncSchedule: 'every_15min',
      enabled: true,
      fieldMappings: []
    });
    setShowAddMapping(false);
  };

  const getSyncDirectionIcon = (direction) => {
    switch (direction) {
      case 'bidirectional': return 'ArrowLeftRight';
      case 'read_only': return 'ArrowLeft';
      case 'write_only': return 'ArrowRight';
      default: return 'ArrowLeftRight';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10 border-success';
      case 'paused': return 'text-warning bg-warning/10 border-warning';
      case 'error': return 'text-destructive bg-destructive/10 border-destructive';
      default: return 'text-muted-foreground bg-muted border-border';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Table Mapping</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure synchronization between SHERLOUK tables and MySQL database tables
          </p>
        </div>
        
        <Button
          variant="default"
          onClick={() => setShowAddMapping(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Mapping
        </Button>
      </div>
      {/* Connection Selection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-card-foreground mb-4">Select Database Connection</h3>
        <Select
          label="Active Connection"
          placeholder="Choose a database connection"
          options={connections?.map(conn => ({
            value: conn?.id,
            label: conn?.name,
            description: `${conn?.host}:${conn?.port}/${conn?.database}`
          }))}
          value={selectedConnection}
          onChange={setSelectedConnection}
          className="max-w-md"
        />
      </div>
      {/* Add New Mapping Form */}
      {showAddMapping && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-card-foreground">Create Table Mapping</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowAddMapping(false)}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="SHERLOUK Table"
              placeholder="Select SHERLOUK table"
              options={sherloukTables}
              value={newMapping?.sherloukTable}
              onChange={(value) => setNewMapping(prev => ({ ...prev, sherloukTable: value }))}
            />

            <Select
              label="MySQL Table"
              placeholder="Select MySQL table"
              options={mysqlTables}
              value={newMapping?.mysqlTable}
              onChange={(value) => setNewMapping(prev => ({ ...prev, mysqlTable: value }))}
            />

            <Select
              label="Sync Direction"
              options={syncDirections}
              value={newMapping?.syncDirection}
              onChange={(value) => setNewMapping(prev => ({ ...prev, syncDirection: value }))}
            />

            <Select
              label="Sync Schedule"
              options={syncSchedules}
              value={newMapping?.syncSchedule}
              onChange={(value) => setNewMapping(prev => ({ ...prev, syncSchedule: value }))}
            />
          </div>

          <div className="mt-6">
            <Checkbox
              label="Enable mapping immediately"
              checked={newMapping?.enabled}
              onChange={(e) => setNewMapping(prev => ({ ...prev, enabled: e?.target?.checked }))}
              description="Start synchronization as soon as the mapping is created"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setShowAddMapping(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleAddMapping}
              disabled={!newMapping?.sherloukTable || !newMapping?.mysqlTable}
            >
              Create Mapping
            </Button>
          </div>
        </div>
      )}
      {/* Existing Mappings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-card-foreground">Active Mappings</h3>
        
        {existingMappings?.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Icon name="Database" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-card-foreground mb-2">No Table Mappings</h4>
            <p className="text-muted-foreground mb-4">
              Create your first table mapping to start synchronizing data between SHERLOUK and MySQL.
            </p>
            <Button variant="default" onClick={() => setShowAddMapping(true)}>
              Create First Mapping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {existingMappings?.map((mapping) => (
              <div key={mapping?.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium text-card-foreground">
                        {mapping?.sherloukTable} ↔ {mapping?.mysqlTable}
                      </h4>
                      <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(mapping?.status)}`}>
                        {mapping?.status?.charAt(0)?.toUpperCase() + mapping?.status?.slice(1)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name={getSyncDirectionIcon(mapping?.syncDirection)} size={14} />
                        {syncDirections?.find(d => d?.value === mapping?.syncDirection)?.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {syncSchedules?.find(s => s?.value === mapping?.syncSchedule)?.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="RotateCcw" size={14} />
                        Last sync: {formatLastSync(mapping?.lastSync)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Icon name="Settings" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold text-card-foreground">{mapping?.recordsSync?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Records Synced</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold text-card-foreground">99.8%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold text-card-foreground">0</div>
                    <div className="text-xs text-muted-foreground">Conflicts</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName={mapping?.enabled ? 'Pause' : 'Play'}
                    iconPosition="left"
                  >
                    {mapping?.enabled ? 'Pause' : 'Resume'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Sync Now
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="BarChart3"
                    iconPosition="left"
                  >
                    View Logs
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableMappingPanel;