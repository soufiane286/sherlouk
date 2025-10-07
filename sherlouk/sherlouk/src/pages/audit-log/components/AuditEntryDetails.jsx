import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditEntryDetails = ({ entry }) => {
  const renderChangeDetails = () => {
    if (!entry?.changes || entry?.changes?.length === 0) {
      return (
        <div className="text-sm text-muted-foreground">
          No detailed changes recorded for this action.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {entry?.changes?.map((change, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-3">
            <div className="text-sm font-medium text-card-foreground mb-2">
              Field: {change?.field}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Previous Value
                </div>
                <div className="text-sm text-card-foreground bg-red-50 border border-red-200 rounded p-2">
                  {change?.oldValue || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  New Value
                </div>
                <div className="text-sm text-card-foreground bg-green-50 border border-green-200 rounded p-2">
                  {change?.newValue || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMetadata = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            IP Address
          </div>
          <div className="text-sm text-card-foreground">
            {entry?.ipAddress || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            User Agent
          </div>
          <div className="text-sm text-card-foreground truncate">
            {entry?.userAgent || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            Session ID
          </div>
          <div className="text-sm text-card-foreground font-mono">
            {entry?.sessionId || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            Request ID
          </div>
          <div className="text-sm text-card-foreground font-mono">
            {entry?.requestId || 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            Duration
          </div>
          <div className="text-sm text-card-foreground">
            {entry?.duration ? `${entry?.duration}ms` : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">
            Status
          </div>
          <div className={`text-sm font-medium ${
            entry?.status === 'success' ? 'text-green-600' : 
            entry?.status === 'error'? 'text-red-600' : 'text-yellow-600'
          }`}>
            {entry?.status || 'N/A'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-muted/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Icon name="Info" size={18} className="text-primary" />
          <h4 className="text-lg font-medium text-card-foreground">
            Audit Entry Details
          </h4>
        </div>

        {/* Basic Information */}
        <div>
          <h5 className="text-sm font-medium text-card-foreground mb-3">
            Basic Information
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Full Description
              </div>
              <div className="text-sm text-card-foreground">
                {entry?.fullDescription || entry?.description}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Affected Resource
              </div>
              <div className="text-sm text-card-foreground">
                {entry?.resource}
              </div>
            </div>
          </div>
        </div>

        {/* Change Details */}
        {entry?.changes && entry?.changes?.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-card-foreground mb-3">
              Change Details
            </h5>
            {renderChangeDetails()}
          </div>
        )}

        {/* Technical Metadata */}
        <div>
          <h5 className="text-sm font-medium text-card-foreground mb-3">
            Technical Information
          </h5>
          {renderMetadata()}
        </div>

        {/* Additional Context */}
        {entry?.context && (
          <div>
            <h5 className="text-sm font-medium text-card-foreground mb-3">
              Additional Context
            </h5>
            <div className="bg-muted/30 rounded-lg p-3">
              <pre className="text-sm text-card-foreground whitespace-pre-wrap font-mono">
                {JSON.stringify(entry?.context, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditEntryDetails;