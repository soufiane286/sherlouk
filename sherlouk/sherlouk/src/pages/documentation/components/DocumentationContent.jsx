import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentationContent = ({ activeSection, userRole = 'Admin' }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [bookmarkedSections, setBookmarkedSections] = useState(['overview']);

  const copyToClipboard = (text, codeId) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(codeId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleBookmark = (sectionId) => {
    setBookmarkedSections(prev => 
      prev?.includes(sectionId)
        ? prev?.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const CodeBlock = ({ code, language = 'javascript', id }) => (
    <div className="relative bg-muted rounded-lg p-4 my-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(code, id)}
          iconName={copiedCode === id ? "Check" : "Copy"}
          iconSize={14}
        >
          {copiedCode === id ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre className="text-sm text-card-foreground overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  const getContentForSection = () => {
    const isBookmarked = bookmarkedSections?.includes(activeSection);

    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-card-foreground">SHERLOUK Overview</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(activeSection)}
                iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
                iconSize={16}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                SHERLOUK is an advanced React web application designed for comprehensive table management 
                with database integration and role-based access control.
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Upload" size={20} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Data Import</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Upload CSV files to create new tables with automatic data parsing and validation.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name="Edit" size={20} className="text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Real-time Editing</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Edit table structure and data with real-time synchronization to your database.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="Users" size={20} className="text-warning" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Role Management</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Comprehensive user management with Viewer, Editor, and Admin role permissions.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="Database" size={20} className="text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Database Sync</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Bidirectional synchronization with MySQL databases for enterprise integration.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-6 my-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Icon name="Info" size={18} className="text-primary" />
                  Getting Started
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Navigate to the Table Dashboard to view existing tables</li>
                  <li>Use the "New Table" button to upload your first CSV file</li>
                  <li>Explore the Table Editor for advanced data manipulation</li>
                  <li>Configure database integration for real-time synchronization</li>
                </ol>
              </div>
            </div>
          </div>
        );

      case 'quick-start':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-card-foreground">Quick Start Guide</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(activeSection)}
                iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
                iconSize={16}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Get up and running with SHERLOUK in just a few minutes.
              </p>

              <div className="space-y-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">Upload Your First Table</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Start by uploading a CSV file to create your first table in SHERLOUK.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-card-foreground mb-2">Steps:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Click the "New Table" button in the top toolbar</li>
                      <li>Select your CSV file (max 10MB)</li>
                      <li>Review the data preview and column mapping</li>
                      <li>Click "Create Table" to import your data</li>
                    </ul>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">Explore Your Data</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Use the Table Editor to view, search, and filter your imported data.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium text-card-foreground mb-2 flex items-center gap-2">
                        <Icon name="Search" size={16} />
                        Search & Filter
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Use the search bar to find specific records or apply column filters.
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium text-card-foreground mb-2 flex items-center gap-2">
                        <Icon name="Eye" size={16} />
                        View Options
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Adjust pagination, sort columns, and customize your table view.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">Edit and Export</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Make changes to your data and export in multiple formats.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Icon name="Edit" size={16} className="text-primary" />
                      <span className="text-sm text-card-foreground">Click any cell to edit data inline</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Icon name="Download" size={16} className="text-accent" />
                      <span className="text-sm text-card-foreground">Export to CSV, Excel, or PDF formats</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <Icon name="Lightbulb" size={18} className="text-primary" />
                  Pro Tips
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="ArrowRight" size={14} className="mt-1 text-primary flex-shrink-0" />
                    <span className="text-sm">Use keyboard shortcuts: Del to delete rows, Ctrl+S to save changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="ArrowRight" size={14} className="mt-1 text-primary flex-shrink-0" />
                    <span className="text-sm">Bookmark frequently used documentation sections for quick access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="ArrowRight" size={14} className="mt-1 text-primary flex-shrink-0" />
                    <span className="text-sm">Enable database sync for real-time collaboration with your team</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'mysql-setup':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-card-foreground">MySQL Database Setup</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(activeSection)}
                iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
                iconSize={16}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Configure MySQL database integration for real-time data synchronization.
              </p>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                  <h3 className="text-lg font-semibold text-card-foreground">Prerequisites</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>MySQL Server 5.7 or higher</li>
                  <li>Database user with CREATE, SELECT, INSERT, UPDATE, DELETE privileges</li>
                  <li>Network access to your MySQL server from SHERLOUK</li>
                  <li>SSL certificate (recommended for production)</li>
                </ul>
              </div>

              <div className="space-y-8">
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">1. Database Configuration</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a dedicated database and user for SHERLOUK integration.
                  </p>
                  
                  <CodeBlock
                    id="mysql-setup"
                    language="sql"
                    code={`-- Create database
CREATE DATABASE sherlouk_data CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with appropriate privileges
CREATE USER 'sherlouk_user'@'%' IDENTIFIED BY 'secure_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER ON sherlouk_data.* TO 'sherlouk_user'@'%';
FLUSH PRIVILEGES;

-- Test connection
SELECT 'Connection successful' AS status;`}
                  />
                </div>

                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">2. Environment Configuration</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your database credentials to the SHERLOUK environment configuration.
                  </p>
                  
                  <CodeBlock
                    id="env-config"
                    language="bash"
                    code={`# Database Configuration
DB_HOST=your-mysql-host.com
DB_PORT=3306
DB_NAME=sherlouk_data
DB_USER=sherlouk_user
DB_PASSWORD=secure_password_here
DB_SSL=true

# Connection Pool Settings
DB_CONNECTION_LIMIT=10
DB_TIMEOUT=60000`}
                  />
                </div>

                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">3. Table Schema</h3>
                  <p className="text-muted-foreground mb-4">
                    SHERLOUK automatically creates tables with the following structure for imported data.
                  </p>
                  
                  <CodeBlock
                    id="table-schema"
                    language="sql"
                    code={`-- Example table structure for imported CSV data
CREATE TABLE user_data_table (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sherlouk_row_id VARCHAR(36) UNIQUE NOT NULL,
    column_1 TEXT,
    column_2 TEXT,
    column_3 TEXT,
    -- Additional columns based on CSV structure
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    INDEX idx_sherlouk_row_id (sherlouk_row_id),
    INDEX idx_created_at (created_at)
);`}
                  />
                </div>

                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">4. Connection Testing</h3>
                  <p className="text-muted-foreground mb-4">
                    Use the Database Integration page to test your connection settings.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                        <Icon name="CheckCircle" size={16} />
                        Successful Connection
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Green status indicator with connection details and latency information.
                      </p>
                    </div>
                    <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                      <h4 className="font-medium text-error mb-2 flex items-center gap-2">
                        <Icon name="XCircle" size={16} />
                        Connection Failed
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Red status with detailed error message and troubleshooting suggestions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Icon name="Shield" size={18} className="text-primary" />
                  Security Best Practices
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="ArrowRight" size={14} className="mt-1 text-primary flex-shrink-0" />
                    <span className="text-sm">Use strong passwords with at least 12 characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="ArrowRight" size={14} className="mt-1 text-primary flex-shrink-0" />
                    <span className="text-sm">Enable SSL/TLS encryption for database connections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="ArrowRight" size={14} className="mt-1 text-primary flex-shrink-0" />
                    <span className="text-sm">Restrict database user privileges to minimum required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="ArrowRight" size={14} className="mt-1 text-primary flex-shrink-0" />
                    <span className="text-sm">Regularly rotate database passwords and API keys</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'user-roles':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-card-foreground">User Roles & Permissions</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(activeSection)}
                iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
                iconSize={16}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                SHERLOUK implements a comprehensive role-based access control system with three distinct user levels.
              </p>

              <div className="grid gap-6">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name="Eye" size={24} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground">Viewer Role</h3>
                      <p className="text-sm text-muted-foreground">Read-only access to data and reports</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                        <Icon name="Check" size={16} />
                        Allowed Actions
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• View all tables and data</li>
                        <li>• Search and filter records</li>
                        <li>• Export data (CSV, Excel, PDF)</li>
                        <li>• Access documentation</li>
                        <li>• View audit logs (own actions only)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-error mb-2 flex items-center gap-2">
                        <Icon name="X" size={16} />
                        Restricted Actions
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Cannot edit or delete data</li>
                        <li>• Cannot upload new tables</li>
                        <li>• Cannot modify table structure</li>
                        <li>• Cannot access user management</li>
                        <li>• Cannot configure database settings</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Edit" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground">Editor Role</h3>
                      <p className="text-sm text-muted-foreground">Full data manipulation capabilities</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                        <Icon name="Check" size={16} />
                        Allowed Actions
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• All Viewer permissions</li>
                        <li>• Upload and create new tables</li>
                        <li>• Edit table data and structure</li>
                        <li>• Add, modify, and delete rows</li>
                        <li>• Clone and duplicate tables</li>
                        <li>• Manage table permissions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-error mb-2 flex items-center gap-2">
                        <Icon name="X" size={16} />
                        Restricted Actions
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Cannot manage user accounts</li>
                        <li>• Cannot access system settings</li>
                        <li>• Cannot configure database integration</li>
                        <li>• Cannot view all audit logs</li>
                        <li>• Cannot delete other users' tables</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="Shield" size={24} className="text-warning" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground">Admin Role</h3>
                      <p className="text-sm text-muted-foreground">Complete system administration access</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                        <Icon name="Check" size={16} />
                        Full System Access
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• All Editor permissions</li>
                        <li>• Create, edit, and delete users</li>
                        <li>• Assign and modify user roles</li>
                        <li>• Configure database integration</li>
                        <li>• Access complete audit logs</li>
                        <li>• System configuration and settings</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-warning mb-2 flex items-center gap-2">
                        <Icon name="AlertTriangle" size={16} />
                        Admin Responsibilities
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Monitor system performance</li>
                        <li>• Ensure data security compliance</li>
                        <li>• Manage database connections</li>
                        <li>• Review audit logs regularly</li>
                        <li>• Maintain user access controls</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Icon name="Users" size={18} className="text-primary" />
                  Role Assignment Guidelines
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <Icon name="Eye" size={32} className="text-muted-foreground mx-auto mb-2" />
                    <h4 className="font-medium text-card-foreground mb-1">Viewer</h4>
                    <p className="text-xs text-muted-foreground">Analysts, Stakeholders, Report Consumers</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <Icon name="Edit" size={32} className="text-primary mx-auto mb-2" />
                    <h4 className="font-medium text-card-foreground mb-1">Editor</h4>
                    <p className="text-xs text-muted-foreground">Data Entry, Content Managers, Team Leads</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <Icon name="Shield" size={32} className="text-warning mx-auto mb-2" />
                    <h4 className="font-medium text-card-foreground mb-1">Admin</h4>
                    <p className="text-xs text-muted-foreground">System Administrators, IT Managers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'common-issues':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-card-foreground">Common Issues & Solutions</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(activeSection)}
                iconName={isBookmarked ? "BookmarkCheck" : "Bookmark"}
                iconSize={16}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Quick solutions to frequently encountered issues in SHERLOUK.
              </p>

              <div className="space-y-6">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon name="AlertCircle" size={20} className="text-error" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">CSV Upload Fails</h3>
                      <p className="text-muted-foreground mb-4">
                        File upload errors or data parsing issues when importing CSV files.
                      </p>
                      
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-card-foreground mb-2">Common Causes:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>File size exceeds 10MB limit</li>
                          <li>Invalid CSV format or encoding</li>
                          <li>Special characters in column headers</li>
                          <li>Mixed data types in columns</li>
                        </ul>
                      </div>

                      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                        <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                          <Icon name="CheckCircle" size={16} />
                          Solutions:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Ensure file is under 10MB and properly formatted</li>
                          <li>Use UTF-8 encoding and standard CSV delimiters</li>
                          <li>Remove special characters from column headers</li>
                          <li>Validate data consistency before upload</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon name="Database" size={20} className="text-warning" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">Database Connection Issues</h3>
                      <p className="text-muted-foreground mb-4">
                        Unable to connect to MySQL database or sync failures.
                      </p>
                      
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-card-foreground mb-2">Troubleshooting Steps:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Verify database credentials and connection string</li>
                          <li>Check network connectivity and firewall settings</li>
                          <li>Ensure database user has required privileges</li>
                          <li>Test connection using Database Integration page</li>
                        </ol>
                      </div>

                      <CodeBlock
                        id="connection-test"
                        language="bash"
                        code={`# Test MySQL connection from command line
mysql -h your-host -u sherlouk_user -p sherlouk_data

# Check user privileges
SHOW GRANTS FOR 'sherlouk_user'@'%';`}
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon name="Zap" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">Slow Performance</h3>
                      <p className="text-muted-foreground mb-4">
                        Application loading slowly or table operations taking too long.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium text-card-foreground mb-2">Quick Fixes:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Clear browser cache and cookies</li>
                            <li>Reduce table pagination size</li>
                            <li>Limit search result count</li>
                            <li>Close unused browser tabs</li>
                          </ul>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium text-card-foreground mb-2">Long-term Solutions:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Optimize database indexes</li>
                            <li>Archive old data regularly</li>
                            <li>Upgrade server resources</li>
                            <li>Enable database connection pooling</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon name="Lock" size={20} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">Permission Denied Errors</h3>
                      <p className="text-muted-foreground mb-4">
                        Unable to perform actions due to insufficient permissions.
                      </p>
                      
                      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-warning mb-2 flex items-center gap-2">
                          <Icon name="AlertTriangle" size={16} />
                          Check Your Role:
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-background rounded">
                            <Icon name="Eye" size={16} className="mx-auto mb-1 text-muted-foreground" />
                            <div className="font-medium">Viewer</div>
                            <div className="text-muted-foreground">Read Only</div>
                          </div>
                          <div className="text-center p-2 bg-background rounded">
                            <Icon name="Edit" size={16} className="mx-auto mb-1 text-primary" />
                            <div className="font-medium">Editor</div>
                            <div className="text-muted-foreground">Read + Write</div>
                          </div>
                          <div className="text-center p-2 bg-background rounded">
                            <Icon name="Shield" size={16} className="mx-auto mb-1 text-warning" />
                            <div className="font-medium">Admin</div>
                            <div className="text-muted-foreground">Full Access</div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Contact your system administrator to request role changes or additional permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <Icon name="HelpCircle" size={18} className="text-primary" />
                  Still Need Help?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <Icon name="Mail" size={20} className="text-primary" />
                    <div>
                      <div className="font-medium text-card-foreground">Email Support</div>
                      <div className="text-sm text-muted-foreground">support@sherlouk.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <Icon name="MessageCircle" size={20} className="text-accent" />
                    <div>
                      <div className="font-medium text-card-foreground">Live Chat</div>
                      <div className="text-sm text-muted-foreground">Available 9 AM - 6 PM EST</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-card-foreground mb-2">Documentation Section</h2>
              <p className="text-muted-foreground">Select a topic from the sidebar to view detailed documentation.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {getContentForSection()}
      </div>
    </div>
  );
};

export default DocumentationContent;