import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const APIEndpointsPanel = () => {
  const [showCreateToken, setShowCreateToken] = useState(false);
  const [newToken, setNewToken] = useState({
    name: '',
    permissions: [],
    expiresIn: '30_days',
    ipRestrictions: '',
    rateLimit: '1000'
  });

  // Mock API endpoints
  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/v1/tables',
      description: 'List all available tables',
      authentication: 'Bearer Token',
      rateLimit: '100/hour'
    },
    {
      method: 'GET',
      path: '/api/v1/tables/{table_id}',
      description: 'Get table data with optional filtering',
      authentication: 'Bearer Token',
      rateLimit: '500/hour'
    },
    {
      method: 'POST',
      path: '/api/v1/tables/{table_id}/rows',
      description: 'Insert new rows into a table',
      authentication: 'Bearer Token',
      rateLimit: '200/hour'
    },
    {
      method: 'PUT',
      path: '/api/v1/tables/{table_id}/rows/{row_id}',
      description: 'Update existing row data',
      authentication: 'Bearer Token',
      rateLimit: '300/hour'
    },
    {
      method: 'DELETE',
      path: '/api/v1/tables/{table_id}/rows/{row_id}',
      description: 'Delete a specific row',
      authentication: 'Bearer Token',
      rateLimit: '100/hour'
    },
    {
      method: 'POST',
      path: '/api/v1/sync/trigger',
      description: 'Manually trigger table synchronization',
      authentication: 'Bearer Token',
      rateLimit: '10/hour'
    }
  ];

  // Mock API tokens
  const apiTokens = [
    {
      id: 1,
      name: 'Production App Integration',
      token: 'sk_live_4f8b2c1a9e3d7f6b2c8a5e9d3f7b1c4a',
      permissions: ['read', 'write', 'sync'],
      created: '2025-09-15T10:30:00Z',
      lastUsed: '2025-10-01T21:45:00Z',
      expiresAt: '2025-11-15T10:30:00Z',
      status: 'active',
      requestCount: 15420,
      ipRestrictions: '192.168.1.0/24, 10.0.0.0/8'
    },
    {
      id: 2,
      name: 'Analytics Dashboard',
      token: 'sk_test_7a3b9c2d8f4e1a6b5c9d2e8f4a1b7c3d',
      permissions: ['read'],
      created: '2025-09-20T14:15:00Z',
      lastUsed: '2025-10-01T20:30:00Z',
      expiresAt: '2025-12-20T14:15:00Z',
      status: 'active',
      requestCount: 8750,
      ipRestrictions: 'None'
    },
    {
      id: 3,
      name: 'Mobile App Backend',
      token: 'sk_live_2e5f8b1c4a7d9e3f6b2c8a5e9d3f7b1c',
      permissions: ['read', 'write'],
      created: '2025-08-10T09:45:00Z',
      lastUsed: '2025-09-28T16:20:00Z',
      expiresAt: '2025-10-10T09:45:00Z',
      status: 'expired',
      requestCount: 23680,
      ipRestrictions: 'None'
    }
  ];

  const permissionOptions = [
    { value: 'read', label: 'Read Access', description: 'View table data and structure' },
    { value: 'write', label: 'Write Access', description: 'Create, update, and delete rows' },
    { value: 'sync', label: 'Sync Control', description: 'Trigger manual synchronization' },
    { value: 'admin', label: 'Admin Access', description: 'Full API access including user management' }
  ];

  const expirationOptions = [
    { value: '7_days', label: '7 Days' },
    { value: '30_days', label: '30 Days' },
    { value: '90_days', label: '90 Days' },
    { value: '1_year', label: '1 Year' },
    { value: 'never', label: 'Never Expires' }
  ];

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'text-success bg-success/10 border-success';
      case 'POST': return 'text-primary bg-primary/10 border-primary';
      case 'PUT': return 'text-warning bg-warning/10 border-warning';
      case 'DELETE': return 'text-destructive bg-destructive/10 border-destructive';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10 border-success';
      case 'expired': return 'text-destructive bg-destructive/10 border-destructive';
      case 'revoked': return 'text-muted-foreground bg-muted border-border';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatLastUsed = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  const handleCreateToken = () => {
    // Mock token creation
    const token = {
      ...newToken,
      id: Date.now(),
      token: `sk_live_${Math.random()?.toString(36)?.substring(2, 34)}`,
      created: new Date()?.toISOString(),
      lastUsed: null,
      expiresAt: newToken?.expiresIn === 'never' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toISOString(),
      status: 'active',
      requestCount: 0
    };
    
    console.log('Created token:', token);
    setShowCreateToken(false);
    setNewToken({
      name: '',
      permissions: [],
      expiresIn: '30_days',
      ipRestrictions: '',
      rateLimit: '1000'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">API Endpoints</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage external API access and authentication tokens for third-party integrations
          </p>
        </div>
        
        <Button
          variant="default"
          onClick={() => setShowCreateToken(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Create Token
        </Button>
      </div>
      {/* API Documentation */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-card-foreground mb-4">Available Endpoints</h3>
        
        <div className="space-y-4">
          {apiEndpoints?.map((endpoint, index) => (
            <div key={index} className="border border-border rounded-lg p-4 hover:border-primary/20 transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded border text-xs font-mono font-medium ${getMethodColor(endpoint?.method)}`}>
                    {endpoint?.method}
                  </div>
                  <code className="text-sm font-mono text-card-foreground bg-muted px-2 py-1 rounded">
                    {endpoint?.path}
                  </code>
                </div>
                
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(endpoint?.path)}>
                  <Icon name="Copy" size={14} />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{endpoint?.description}</p>
              
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="Shield" size={12} />
                  {endpoint?.authentication}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Zap" size={12} />
                  Rate limit: {endpoint?.rateLimit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Create Token Form */}
      {showCreateToken && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-card-foreground">Create API Token</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowCreateToken(false)}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Token Name"
                placeholder="e.g., Production App Integration"
                value={newToken?.name}
                onChange={(e) => setNewToken(prev => ({ ...prev, name: e?.target?.value }))}
                description="A descriptive name for this token"
              />
              
              <Select
                label="Expires In"
                options={expirationOptions}
                value={newToken?.expiresIn}
                onChange={(value) => setNewToken(prev => ({ ...prev, expiresIn: value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-3">Permissions</label>
              <div className="space-y-2">
                {permissionOptions?.map((permission) => (
                  <Checkbox
                    key={permission?.value}
                    label={permission?.label}
                    description={permission?.description}
                    checked={newToken?.permissions?.includes(permission?.value)}
                    onChange={(e) => {
                      if (e?.target?.checked) {
                        setNewToken(prev => ({
                          ...prev,
                          permissions: [...prev?.permissions, permission?.value]
                        }));
                      } else {
                        setNewToken(prev => ({
                          ...prev,
                          permissions: prev?.permissions?.filter(p => p !== permission?.value)
                        }));
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="IP Restrictions (Optional)"
                placeholder="192.168.1.0/24, 10.0.0.0/8"
                value={newToken?.ipRestrictions}
                onChange={(e) => setNewToken(prev => ({ ...prev, ipRestrictions: e?.target?.value }))}
                description="Comma-separated IP addresses or CIDR blocks"
              />
              
              <Input
                label="Rate Limit (requests/hour)"
                type="number"
                placeholder="1000"
                value={newToken?.rateLimit}
                onChange={(e) => setNewToken(prev => ({ ...prev, rateLimit: e?.target?.value }))}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowCreateToken(false)}>
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={handleCreateToken}
                disabled={!newToken?.name || newToken?.permissions?.length === 0}
              >
                Create Token
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Existing Tokens */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-card-foreground mb-4">API Tokens</h3>
        
        <div className="space-y-4">
          {apiTokens?.map((token) => (
            <div key={token?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-medium text-card-foreground">{token?.name}</h4>
                    <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(token?.status)}`}>
                      {token?.status?.charAt(0)?.toUpperCase() + token?.status?.slice(1)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-card-foreground">
                      {token?.token?.substring(0, 20)}...
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(token?.token)}
                      iconName="Copy"
                      iconSize={14}
                    >
                      Copy
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Permissions: {token?.permissions?.join(', ')}</span>
                    <span>Created: {formatDate(token?.created)}</span>
                    <span>Last used: {formatLastUsed(token?.lastUsed)}</span>
                    {token?.expiresAt && <span>Expires: {formatDate(token?.expiresAt)}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Icon name="Settings" size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-card-foreground">{token?.requestCount?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Requests</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-card-foreground">99.9%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-card-foreground">45ms</div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold text-card-foreground">{token?.ipRestrictions === 'None' ? '0' : '2'}</div>
                  <div className="text-xs text-muted-foreground">IP Restrictions</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-card-foreground mb-1">47,850</div>
          <div className="text-sm text-muted-foreground">Total API Calls</div>
          <div className="text-xs text-success mt-1">+2,340 today</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-card-foreground mb-1">3</div>
          <div className="text-sm text-muted-foreground">Active Tokens</div>
          <div className="text-xs text-muted-foreground mt-1">1 expires soon</div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-card-foreground mb-1">99.8%</div>
          <div className="text-sm text-muted-foreground">Uptime</div>
          <div className="text-xs text-success mt-1">All systems operational</div>
        </div>
      </div>
    </div>
  );
};

export default APIEndpointsPanel;