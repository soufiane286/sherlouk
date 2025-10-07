import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AuditEntryDetails from './AuditEntryDetails';

const AuditTable = ({ entries, loading, onSort, sortConfig }) => {
  const [expandedEntry, setExpandedEntry] = useState(null);

  const getActionIcon = (actionType) => {
    const iconMap = {
      'table_create': 'Plus',
      'table_edit': 'Edit',
      'table_delete': 'Trash2',
      'row_add': 'PlusCircle',
      'row_edit': 'Edit3',
      'row_delete': 'MinusCircle',
      'user_create': 'UserPlus',
      'user_edit': 'UserCheck',
      'user_delete': 'UserMinus',
      'login': 'LogIn',
      'logout': 'LogOut'
    };
    return iconMap?.[actionType] || 'Activity';
  };

  const getActionColor = (actionType) => {
    const colorMap = {
      'table_create': 'text-green-600',
      'table_edit': 'text-blue-600',
      'table_delete': 'text-red-600',
      'row_add': 'text-green-500',
      'row_edit': 'text-blue-500',
      'row_delete': 'text-red-500',
      'user_create': 'text-purple-600',
      'user_edit': 'text-purple-500',
      'user_delete': 'text-red-600',
      'login': 'text-green-600',
      'logout': 'text-gray-600'
    };
    return colorMap?.[actionType] || 'text-gray-600';
  };

  const formatActionType = (actionType) => {
    const formatMap = {
      'table_create': 'Table Created',
      'table_edit': 'Table Edited',
      'table_delete': 'Table Deleted',
      'row_add': 'Row Added',
      'row_edit': 'Row Edited',
      'row_delete': 'Row Deleted',
      'user_create': 'User Created',
      'user_edit': 'User Modified',
      'user_delete': 'User Deleted',
      'login': 'User Login',
      'logout': 'User Logout'
    };
    return formatMap?.[actionType] || actionType;
  };

  const handleSort = (column) => {
    onSort(column);
  };

  const getSortIcon = (column) => {
    if (sortConfig?.column !== column) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleRowClick = (entryId) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-center justify-center">
          <Icon name="Loader2" size={24} className="text-muted-foreground animate-spin mr-2" />
          <span className="text-muted-foreground">Loading audit logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('timestamp')}
                  iconName={getSortIcon('timestamp')}
                  iconPosition="right"
                  className="font-medium text-muted-foreground hover:text-card-foreground"
                >
                  Timestamp
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('user')}
                  iconName={getSortIcon('user')}
                  iconPosition="right"
                  className="font-medium text-muted-foreground hover:text-card-foreground"
                >
                  User
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('actionType')}
                  iconName={getSortIcon('actionType')}
                  iconPosition="right"
                  className="font-medium text-muted-foreground hover:text-card-foreground"
                >
                  Action
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('resource')}
                  iconName={getSortIcon('resource')}
                  iconPosition="right"
                  className="font-medium text-muted-foreground hover:text-card-foreground"
                >
                  Resource
                </Button>
              </th>
              <th className="text-left p-4">
                <span className="font-medium text-muted-foreground">Details</span>
              </th>
              <th className="text-left p-4">
                <span className="font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((entry) => (
              <React.Fragment key={entry?.id}>
                <tr 
                  className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(entry?.id)}
                >
                  <td className="p-4">
                    <div className="text-sm text-card-foreground">
                      {new Date(entry.timestamp)?.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp)?.toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <Icon name="User" size={14} className="text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-card-foreground">
                          {entry?.userName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry?.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Icon 
                        name={getActionIcon(entry?.actionType)} 
                        size={16} 
                        className={getActionColor(entry?.actionType)} 
                      />
                      <span className="text-sm text-card-foreground">
                        {formatActionType(entry?.actionType)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-card-foreground">{entry?.resource}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground truncate max-w-xs block">
                      {entry?.description}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={expandedEntry === entry?.id ? "ChevronUp" : "ChevronDown"}
                      iconSize={16}
                    >
                      <span className="sr-only">Toggle details</span>
                    </Button>
                  </td>
                </tr>
                {expandedEntry === entry?.id && (
                  <tr>
                    <td colSpan="6" className="p-0 border-b border-border">
                      <AuditEntryDetails entry={entry} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden">
        {entries?.map((entry) => (
          <div key={entry?.id} className="border-b border-border last:border-b-0">
            <div 
              className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => handleRowClick(entry?.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon 
                    name={getActionIcon(entry?.actionType)} 
                    size={16} 
                    className={getActionColor(entry?.actionType)} 
                  />
                  <span className="text-sm font-medium text-card-foreground">
                    {formatActionType(entry?.actionType)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(entry.timestamp)?.toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={12} className="text-muted-foreground" />
                </div>
                <span className="text-sm text-card-foreground">{entry?.userName}</span>
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                Resource: {entry?.resource}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {entry?.description}
              </div>
              
              <div className="flex justify-end mt-3">
                <Icon 
                  name={expandedEntry === entry?.id ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground" 
                />
              </div>
            </div>
            
            {expandedEntry === entry?.id && (
              <div className="border-t border-border">
                <AuditEntryDetails entry={entry} />
              </div>
            )}
          </div>
        ))}
      </div>
      {entries?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No audit logs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search criteria to find audit entries.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditTable;