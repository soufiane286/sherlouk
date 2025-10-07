import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentationHeader = ({ 
  onPrint, 
  onExportPDF, 
  onToggleSidebar, 
  isSidebarOpen,
  activeSection 
}) => {
  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log('Exporting documentation as PDF...');
    if (onExportPDF) onExportPDF();
  };

  const getSectionTitle = () => {
    const sectionTitles = {
      'overview': 'SHERLOUK Overview',
      'quick-start': 'Quick Start Guide',
      'navigation': 'Navigation Basics',
      'csv-upload': 'CSV File Upload',
      'table-editing': 'Editing Tables',
      'row-operations': 'Row Operations',
      'export-options': 'Export Options',
      'search-filter': 'Search & Filtering',
      'mysql-setup': 'MySQL Database Setup',
      'connection-config': 'Connection Configuration',
      'data-sync': 'Data Synchronization',
      'api-endpoints': 'API Endpoints',
      'user-roles': 'User Roles & Permissions',
      'account-management': 'Account Management',
      'audit-logging': 'Audit Logging',
      'common-issues': 'Common Issues & Solutions',
      'error-messages': 'Error Messages',
      'performance': 'Performance Tips'
    };
    
    return sectionTitles?.[activeSection] || 'Documentation';
  };

  return (
    <div className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Mobile Menu & Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
            iconName="Menu"
            iconSize={20}
          >
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="BookOpen" size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground">
                {getSectionTitle()}
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                SHERLOUK Documentation
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Feedback Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName="MessageSquare"
            iconSize={16}
            className="hidden sm:flex"
          >
            Feedback
          </Button>

          {/* Print Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            iconName="Printer"
            iconSize={16}
            className="hidden md:flex"
          >
            Print
          </Button>

          {/* Export PDF Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            iconName="Download"
            iconSize={16}
          >
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>

          {/* More Actions Menu */}
          <div className="relative group">
            <Button
              variant="ghost"
              size="icon"
              iconName="MoreVertical"
              iconSize={16}
            >
              <span className="sr-only">More actions</span>
            </Button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg elevation-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth">
                  <Icon name="Share" size={16} />
                  Share Documentation
                </button>
                <button 
                  onClick={handlePrint}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth md:hidden"
                >
                  <Icon name="Printer" size={16} />
                  Print Page
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth">
                  <Icon name="ExternalLink" size={16} />
                  Open in New Tab
                </button>
                <div className="border-t border-border my-2" />
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth sm:hidden">
                  <Icon name="MessageSquare" size={16} />
                  Send Feedback
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-smooth">
                  <Icon name="Flag" size={16} />
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
        <Icon name="Home" size={14} />
        <span>Documentation</span>
        <Icon name="ChevronRight" size={14} />
        <span className="text-card-foreground font-medium">{getSectionTitle()}</span>
      </div>
    </div>
  );
};

export default DocumentationHeader;