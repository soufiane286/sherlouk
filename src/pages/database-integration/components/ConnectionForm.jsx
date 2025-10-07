import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConnectionForm = ({ onSave, onCancel, editingConnection = null }) => {
  const [formData, setFormData] = useState({
    name: editingConnection?.name || '',
    host: editingConnection?.host || '',
    port: editingConnection?.port || '3306',
    database: editingConnection?.database || '',
    username: editingConnection?.username || '',
    password: editingConnection?.password || '',
    useSSL: editingConnection?.useSSL || false,
    connectionTimeout: editingConnection?.connectionTimeout || '30',
    maxConnections: editingConnection?.maxConnections || '10'
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) newErrors.name = 'Connection name is required';
    if (!formData?.host?.trim()) newErrors.host = 'Host is required';
    if (!formData?.port?.trim()) newErrors.port = 'Port is required';
    if (!formData?.database?.trim()) newErrors.database = 'Database name is required';
    if (!formData?.username?.trim()) newErrors.username = 'Username is required';
    if (!formData?.password?.trim()) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateForm()) return;
    
    setTesting(true);
    setTestResult(null);
    
    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResult({
        success,
        message: success 
          ? 'Connection successful! Database is accessible.' :'Connection failed. Please check your credentials and network settings.',
        timestamp: new Date()?.toLocaleString()
      });
      setTesting(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    
    onSave({
      ...formData,
      id: editingConnection?.id || Date.now(),
      status: 'active',
      lastTested: testResult?.success ? new Date()?.toISOString() : null,
      createdAt: editingConnection?.createdAt || new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">
          {editingConnection ? 'Edit Connection' : 'New Database Connection'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <Icon name="X" size={20} />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-card-foreground">Basic Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Connection Name"
              name="name"
              value={formData?.name}
              onChange={handleInputChange}
              placeholder="Production MySQL"
              error={errors?.name}
              required
            />
            
            <Input
              label="Database Name"
              name="database"
              value={formData?.database}
              onChange={handleInputChange}
              placeholder="sherlouk_db"
              error={errors?.database}
              required
            />
          </div>
        </div>

        {/* Connection Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-card-foreground">Connection Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Host"
                name="host"
                value={formData?.host}
                onChange={handleInputChange}
                placeholder="localhost or IP address"
                error={errors?.host}
                required
              />
            </div>
            
            <Input
              label="Port"
              name="port"
              type="number"
              value={formData?.port}
              onChange={handleInputChange}
              placeholder="3306"
              error={errors?.port}
              required
            />
          </div>
        </div>

        {/* Authentication */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-card-foreground">Authentication</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Username"
              name="username"
              value={formData?.username}
              onChange={handleInputChange}
              placeholder="database_user"
              error={errors?.username}
              required
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData?.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              error={errors?.password}
              required
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-card-foreground">Advanced Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Connection Timeout (seconds)"
              name="connectionTimeout"
              type="number"
              value={formData?.connectionTimeout}
              onChange={handleInputChange}
              placeholder="30"
            />
            
            <Input
              label="Max Connections"
              name="maxConnections"
              type="number"
              value={formData?.maxConnections}
              onChange={handleInputChange}
              placeholder="10"
            />
          </div>
          
          <Checkbox
            label="Use SSL Connection"
            name="useSSL"
            checked={formData?.useSSL}
            onChange={handleInputChange}
            description="Enable SSL encryption for secure database connections"
          />
        </div>

        {/* Test Connection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-card-foreground">Connection Test</h4>
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              loading={testing}
              iconName="Zap"
              iconPosition="left"
            >
              Test Connection
            </Button>
          </div>
          
          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult?.success 
                ? 'bg-success/10 border-success text-success' :'bg-destructive/10 border-destructive text-destructive'
            }`}>
              <div className="flex items-start gap-3">
                <Icon 
                  name={testResult?.success ? "CheckCircle" : "XCircle"} 
                  size={20} 
                  className="mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="font-medium">{testResult?.message}</p>
                  <p className="text-sm opacity-80 mt-1">Tested at {testResult?.timestamp}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="default">
            {editingConnection ? 'Update Connection' : 'Create Connection'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConnectionForm;