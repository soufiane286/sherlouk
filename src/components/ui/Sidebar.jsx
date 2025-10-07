import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isOpen = false, onClose }) => {
  const location = useLocation();

  const navigationGroups = [
    {
      label: 'Tables',
      items: [
        {
          label: 'Dashboard',
          path: '/table-dashboard',
          icon: 'LayoutDashboard'
        },
        {
          label: 'Table Creator',
          path: '/table-creation',
          icon: 'PlusCircle'
        },
        {
          label: 'Table Editor',
          path: '/table-editor',
          icon: 'Table'
        }
      ]
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'User Management',
          path: '/user-management',
          icon: 'Users'
        },
        {
          label: 'Audit Log',
          path: '/audit-log',
          icon: 'FileText'
        },
        {
          label: 'Database Integration',
          path: '/database-integration',
          icon: 'Database'
        }
      ]
    },
    {
      label: 'Support',
      items: [
        {
          label: 'Documentation',
          path: '/documentation',
          icon: 'BookOpen'
        }
      ]
    }
  ];

  const isActivePath = (path) => {
    if (path === '/table-dashboard') {
      return location?.pathname === path || location?.pathname === '/';
    }
    return location?.pathname === path;
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      onClose?.();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Sidebar */}
      <aside 
        id="sidebar-navigation"
        className={`
          fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 
          transform transition-transform duration-300 ease-out scrollbar-thin
          lg:translate-x-0 lg:z-30 safe-area
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 p-4 sm:p-6 border-b border-border">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-lg" aria-hidden="true">S</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-card-foreground truncate">SHERLOUK</h1>
              <p className="text-xs text-muted-foreground truncate">Data Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin" role="navigation">
            {navigationGroups?.map((group, groupIndex) => (
              <div key={group?.label}>
                {/* Group Label */}
                <div className="mb-3">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {group?.label}
                  </h3>
                </div>

                {/* Group Items */}
                <div className="space-y-1" role="menu" aria-label={group?.label}>
                  {group?.items?.map((item) => {
                    const isActive = isActivePath(item?.path);
                    
                    return (
                      <Link
                        key={item?.path}
                        to={item?.path}
                        onClick={handleLinkClick}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                          transition-smooth group touch-target
                          ${isActive 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'text-card-foreground hover:bg-muted hover:text-card-foreground'
                          }
                        `}
                        role="menuitem"
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon 
                          name={item?.icon} 
                          size={18} 
                          className={`
                            transition-smooth flex-shrink-0
                            ${isActive 
                              ? 'text-primary-foreground' 
                              : 'text-muted-foreground group-hover:text-card-foreground'
                            }
                          `}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item?.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Group Separator */}
                {groupIndex < navigationGroups?.length - 1 && (
                  <div className="mt-6 border-t border-border" />
                )}
              </div>
            ))}
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={16} className="text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@sherlouk.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden touch-target"
          iconName="X"
          iconSize={20}
          aria-label="Close navigation menu"
        />
      </aside>
    </>
  );
};

export default Sidebar;