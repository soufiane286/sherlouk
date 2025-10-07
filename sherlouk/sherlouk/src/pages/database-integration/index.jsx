import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ConnectionForm from './components/ConnectionForm';
import ConnectionCard from './components/ConnectionCard';
import TableMappingPanel from './components/TableMappingPanel';
import SyncHistoryPanel from './components/SyncHistoryPanel';
import APIEndpointsPanel from './components/APIEndpointsPanel';

const DatabaseIntegration = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('connections');
  const [showConnectionForm, setShowConnectionForm] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);

  // Mock database connections
  const [connections, setConnections] = useState([
    {
      id: 1,
      name: 'Production MySQL',
      host: '192.168.1.100',
      port: '3306',
      database: 'sherlouk_prod',
      username: 'admin',
      password: '••••••••',
      useSSL: true,
      connectionTimeout: '30',
      maxConnections: '20',
      status: 'active',
      syncedTables: 5,
      totalRecords: 12456,
      lastSync: '2025-10-01T21:45:00Z',
      avgResponseTime: 45,
      createdAt: '2025-09-15T10:30:00Z',
      updatedAt: '2025-10-01T21:45:00Z',
      lastTested: '2025-10-01T21:45:00Z'
    },
    {
      id: 2,
      name: 'Development MySQL',
      host: 'localhost',
      port: '3306',
      database: 'sherlouk_dev',
      username: 'dev_user',
      password: '••••••••',
      useSSL: false,
      connectionTimeout: '15',
      maxConnections: '10',
      status: 'active',
      syncedTables: 3,
      totalRecords: 2340,
      lastSync: '2025-10-01T21:30:00Z',
      avgResponseTime: 23,
      createdAt: '2025-09-20T14:15:00Z',
      updatedAt: '2025-10-01T21:30:00Z',
      lastTested: '2025-10-01T20:15:00Z'
    },
    {
      id: 3,
      name: 'Analytics MySQL',
      host: '10.0.0.50',
      port: '3306',
      database: 'analytics_db',
      username: 'analytics',
      password: '••••••••',
      useSSL: true,
      connectionTimeout: '45',
      maxConnections: '15',
      status: 'error',
      syncedTables: 0,
      totalRecords: 0,
      lastSync: null,
      avgResponseTime: 0,
      createdAt: '2025-09-25T16:45:00Z',
      updatedAt: '2025-09-30T12:20:00Z',
      lastTested: '2025-09-30T12:20:00Z'
    }
  ]);

  const tabs = [
    { id: 'connections', label: 'Connections', icon: 'Database' },
    { id: 'mapping', label: 'Table Mapping', icon: 'GitBranch' },
    { id: 'history', label: 'Sync History', icon: 'History' },
    { id: 'api', label: 'API Endpoints', icon: 'Code' }
  ];

  const handleSaveConnection = (connectionData) => {
    if (editingConnection) {
      setConnections(prev => prev?.map(conn => 
        conn?.id === editingConnection?.id ? connectionData : conn
      ));
    } else {
      setConnections(prev => [...prev, connectionData]);
    }
    setShowConnectionForm(false);
    setEditingConnection(null);
  };

  const handleEditConnection = (connection) => {
    setEditingConnection(connection);
    setShowConnectionForm(true);
  };

  const handleDeleteConnection = (connection) => {
    if (window.confirm(`Are you sure you want to delete the connection "${connection?.name}"? This action cannot be undone.`)) {
      setConnections(prev => prev?.filter(conn => conn?.id !== connection?.id));
    }
  };

  const handleToggleConnectionStatus = (connection) => {
    setConnections(prev => prev?.map(conn => 
      conn?.id === connection?.id 
        ? { ...conn, status: conn?.status === 'active' ? 'inactive' : 'active' }
        : conn
    ));
  };

  const handleSaveMapping = (mapping) => {
    console.log('Saving mapping:', mapping);
    // In a real app, this would save to the backend
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'connections':
        return (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-success mb-1">{connections?.filter(c => c?.status === 'active')?.length}</div>
                <div className="text-sm text-muted-foreground">Active Connections</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-card-foreground mb-1">{connections?.reduce((sum, c) => sum + c?.syncedTables, 0)}</div>
                <div className="text-sm text-muted-foreground">Synced Tables</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-card-foreground mb-1">{connections?.reduce((sum, c) => sum + c?.totalRecords, 0)?.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-card-foreground mb-1">{Math.round(connections?.reduce((sum, c) => sum + c?.avgResponseTime, 0) / connections?.length)}ms</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
            {/* Connection Form */}
            {showConnectionForm && (
              <ConnectionForm
                onSave={handleSaveConnection}
                onCancel={() => {
                  setShowConnectionForm(false);
                  setEditingConnection(null);
                }}
                editingConnection={editingConnection}
              />
            )}
            {/* Connections List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-card-foreground">Database Connections</h2>
                {!showConnectionForm && (
                  <Button
                    variant="default"
                    onClick={() => setShowConnectionForm(true)}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Add Connection
                  </Button>
                )}
              </div>

              {connections?.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <Icon name="Database" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-card-foreground mb-2">No Database Connections</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Get started by creating your first MySQL database connection to enable data synchronization.
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setShowConnectionForm(true)}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Create First Connection
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {connections?.map((connection) => (
                    <ConnectionCard
                      key={connection?.id}
                      connection={connection}
                      onEdit={handleEditConnection}
                      onDelete={handleDeleteConnection}
                      onToggleStatus={handleToggleConnectionStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'mapping':
        return <TableMappingPanel connections={connections} onSaveMapping={handleSaveMapping} />;

      case 'history':
        return <SyncHistoryPanel />;

      case 'api':
        return <APIEndpointsPanel />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Database Integration - SHERLOUK</title>
        <meta name="description" content="Configure and manage MySQL database connections with bidirectional synchronization capabilities" />
      </Helmet>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Database" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Database Integration</h1>
                <p className="text-muted-foreground">
                  Configure MySQL connections, manage table mappings, and monitor synchronization
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-smooth ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-7xl">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DatabaseIntegration;