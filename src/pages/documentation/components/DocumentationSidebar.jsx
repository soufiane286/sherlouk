import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DocumentationSidebar = ({ activeSection, onSectionChange, userRole = 'Admin' }) => {
  const [expandedCategories, setExpandedCategories] = useState(['getting-started']);

  const documentationSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'BookOpen',
      items: [
        { id: 'overview', title: 'Overview', roles: ['Viewer', 'Editor', 'Admin'] },
        { id: 'quick-start', title: 'Quick Start Guide', roles: ['Viewer', 'Editor', 'Admin'] },
        { id: 'navigation', title: 'Navigation Basics', roles: ['Viewer', 'Editor', 'Admin'] }
      ]
    },
    {
      id: 'table-management',
      title: 'Table Management',
      icon: 'Table',
      items: [
        { id: 'csv-upload', title: 'CSV File Upload', roles: ['Editor', 'Admin'] },
        { id: 'table-editing', title: 'Editing Tables', roles: ['Editor', 'Admin'] },
        { id: 'row-operations', title: 'Row Operations', roles: ['Editor', 'Admin'] },
        { id: 'export-options', title: 'Export Options', roles: ['Viewer', 'Editor', 'Admin'] },
        { id: 'search-filter', title: 'Search & Filtering', roles: ['Viewer', 'Editor', 'Admin'] }
      ]
    },
    {
      id: 'database-integration',
      title: 'Database Integration',
      icon: 'Database',
      items: [
        { id: 'mysql-setup', title: 'MySQL Setup', roles: ['Admin'] },
        { id: 'connection-config', title: 'Connection Configuration', roles: ['Admin'] },
        { id: 'data-sync', title: 'Data Synchronization', roles: ['Admin'] },
        { id: 'api-endpoints', title: 'API Endpoints', roles: ['Admin'] }
      ]
    },
    {
      id: 'user-management',
      title: 'User Management',
      icon: 'Users',
      items: [
        { id: 'user-roles', title: 'User Roles & Permissions', roles: ['Admin'] },
        { id: 'account-management', title: 'Account Management', roles: ['Admin'] },
        { id: 'audit-logging', title: 'Audit Logging', roles: ['Admin'] }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: 'AlertCircle',
      items: [
        { id: 'common-issues', title: 'Common Issues', roles: ['Viewer', 'Editor', 'Admin'] },
        { id: 'error-messages', title: 'Error Messages', roles: ['Viewer', 'Editor', 'Admin'] },
        { id: 'performance', title: 'Performance Tips', roles: ['Editor', 'Admin'] }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev?.includes(categoryId) 
        ? prev?.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isItemVisible = (item) => {
    return item?.roles?.includes(userRole);
  };

  const getVisibleItems = (items) => {
    return items?.filter(item => isItemVisible(item));
  };

  return (
    <div className="w-64 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">Documentation</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Role: <span className="font-medium text-primary">{userRole}</span>
        </p>
      </div>
      <nav className="p-4 space-y-2">
        {documentationSections?.map((section) => {
          const visibleItems = getVisibleItems(section?.items);
          if (visibleItems?.length === 0) return null;

          const isExpanded = expandedCategories?.includes(section?.id);

          return (
            <div key={section?.id} className="space-y-1">
              <button
                onClick={() => toggleCategory(section?.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-card-foreground hover:bg-muted rounded-lg transition-smooth"
              >
                <div className="flex items-center gap-2">
                  <Icon name={section?.icon} size={16} className="text-muted-foreground" />
                  <span>{section?.title}</span>
                </div>
                <Icon 
                  name="ChevronRight" 
                  size={14} 
                  className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>
              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {visibleItems?.map((item) => (
                    <button
                      key={item?.id}
                      onClick={() => onSectionChange(item?.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-smooth ${
                        activeSection === item?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
                      }`}
                    >
                      {item?.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default DocumentationSidebar;