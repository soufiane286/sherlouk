import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

const Header = ({ onMenuToggle, isSidebarOpen = false }) => {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getPageTitle = () => {
    const pathTitles = {
      '/': 'Table Dashboard',
      '/table-dashboard': 'Table Dashboard',
      '/table-editor': 'Table Editor',
      '/table-creation': 'Table Creation',
      '/user-management': 'User Management',
      '/audit-log': 'Audit Log',
      '/database-integration': 'Database Integration',
      '/documentation': 'Documentation',
      '/login': 'Login'
    };
    return pathTitles?.[location?.pathname] || 'SHERLOUK';
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    // Logout logic here
    console.log('Logging out...');
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border elevation-1 safe-area">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left Section - Menu Toggle & Title */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden touch-target"
            iconName="Menu"
            iconSize={20}
            aria-label="Toggle navigation menu"
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar-navigation"
          />
          
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-semibold text-sm" aria-hidden="true">S</span>
              </div>
              <span className="font-semibold text-foreground text-sm sm:text-base truncate">SHERLOUK</span>
            </div>
            <h1 className="text-base sm:text-lg font-medium text-foreground lg:block hidden truncate">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right Section - Theme Toggle & User Menu */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <ThemeToggle />
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUserMenuToggle}
              className="flex items-center gap-2 px-2 sm:px-3 touch-target"
              aria-label="User menu"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={16} className="text-muted-foreground" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                Admin User
              </span>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </Button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setUserMenuOpen(false)}
                  aria-hidden="true"
                />
                <div 
                  className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg elevation-2 z-50 glass-morphism"
                  role="menu"
                  aria-labelledby="user-menu-button"
                >
                  <div className="p-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name="User" size={20} className="text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-popover-foreground truncate">Admin User</p>
                        <p className="text-xs text-muted-foreground truncate">admin@sherlouk.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth touch-target"
                      role="menuitem"
                    >
                      <Icon name="Settings" size={16} aria-hidden="true" />
                      Account Settings
                    </button>
                    <button
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth touch-target"
                      role="menuitem"
                    >
                      <Icon name="HelpCircle" size={16} aria-hidden="true" />
                      Help & Support
                    </button>
                  </div>
                  
                  <div className="p-2 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-smooth touch-target"
                      role="menuitem"
                    >
                      <Icon name="LogOut" size={16} aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;