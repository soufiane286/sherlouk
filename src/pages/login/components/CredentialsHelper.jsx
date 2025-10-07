import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CredentialsHelper = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockCredentials = [
    {
      role: 'Admin',
      email: 'admin@sherlouk.com',
      password: 'admin123',
      permissions: 'Full system access'
    },
    {
      role: 'Editor',
      email: 'editor@sherlouk.com',
      password: 'editor123',
      permissions: 'Read and write tables'
    },
    {
      role: 'Viewer',
      email: 'viewer@sherlouk.com',
      password: 'viewer123',
      permissions: 'Read-only access'
    }
  ];

  return (
    <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
        iconPosition="right"
        className="w-full justify-between p-2"
      >
        <span className="text-sm font-medium">Demo Credentials</span>
      </Button>
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {mockCredentials?.map((cred, index) => (
            <div key={index} className="p-3 bg-background rounded-md border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{cred?.role}</span>
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {cred?.permissions}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">{cred?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Key" size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">{cred?.password}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;