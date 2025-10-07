import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DocumentationSidebar from './components/DocumentationSidebar';
import DocumentationContent from './components/DocumentationContent';
import DocumentationSearch from './components/DocumentationSearch';
import DocumentationHeader from './components/DocumentationHeader';

const Documentation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [docSidebarOpen, setDocSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [userRole, setUserRole] = useState('Admin');
  const [searchResults, setSearchResults] = useState([]);

  // Get user role from localStorage or context
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') || 'Admin';
    setUserRole(savedRole);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDocSidebarToggle = () => {
    setDocSidebarOpen(!docSidebarOpen);
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Close mobile doc sidebar when section is selected
    if (window.innerWidth < 1024) {
      setDocSidebarOpen(false);
    }
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleSearchSectionSelect = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handlePrint = () => {
    // Add print-specific styling
    const printStyles = `
      @media print {
        .no-print { display: none !important; }
        .print-break { page-break-before: always; }
        body { font-size: 12pt; line-height: 1.4; }
        h1, h2, h3 { page-break-after: avoid; }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head?.appendChild(styleSheet);
    
    setTimeout(() => {
      window.print();
      document.head?.removeChild(styleSheet);
    }, 100);
  };

  const handleExportPDF = () => {
    // In a real application, this would use a library like jsPDF or html2pdf
    console.log('Exporting documentation section as PDF:', activeSection);
    
    // Mock PDF export notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-success text-success-foreground px-4 py-2 rounded-lg elevation-2 z-50';
    notification.textContent = 'PDF export started...';
    document.body?.appendChild(notification);
    
    setTimeout(() => {
      notification.textContent = 'PDF exported successfully!';
      setTimeout(() => {
        document.body?.removeChild(notification);
      }, 2000);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Documentation - SHERLOUK</title>
        <meta name="description" content="Comprehensive documentation for SHERLOUK table management system including user guides, database integration, and troubleshooting." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Main App Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main App Header */}
        <Header onMenuToggle={handleSidebarToggle} isSidebarOpen={sidebarOpen} />

        {/* Main Content Area */}
        <div className="lg:ml-64 pt-16">
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Documentation Sidebar */}
            <div className={`
              fixed lg:relative top-16 lg:top-0 left-0 lg:left-auto h-[calc(100vh-4rem)] lg:h-full
              transform transition-transform duration-300 ease-out z-30
              ${docSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              ${docSidebarOpen ? 'lg:block' : 'lg:hidden'}
            `}>
              <DocumentationSidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                userRole={userRole}
              />
            </div>

            {/* Mobile Overlay for Documentation Sidebar */}
            {docSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                onClick={() => setDocSidebarOpen(false)}
              />
            )}

            {/* Main Documentation Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Documentation Header */}
              <div className="no-print">
                <DocumentationHeader
                  onPrint={handlePrint}
                  onExportPDF={handleExportPDF}
                  onToggleSidebar={handleDocSidebarToggle}
                  isSidebarOpen={docSidebarOpen}
                  activeSection={activeSection}
                />
              </div>

              {/* Search Section */}
              <div className="bg-muted/30 border-b border-border p-6 no-print">
                <div className="max-w-2xl">
                  <DocumentationSearch
                    onSearchResults={handleSearchResults}
                    onSectionSelect={handleSearchSectionSelect}
                  />
                </div>
              </div>

              {/* Documentation Content */}
              <div className="flex-1 overflow-hidden">
                <DocumentationContent
                  activeSection={activeSection}
                  userRole={userRole}
                />
              </div>

              {/* Footer */}
              <div className="bg-muted/30 border-t border-border p-6 no-print">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      <p>© {new Date()?.getFullYear()} SHERLOUK. All rights reserved.</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="text-muted-foreground hover:text-card-foreground transition-smooth">
                        Privacy Policy
                      </button>
                      <button className="text-muted-foreground hover:text-card-foreground transition-smooth">
                        Terms of Service
                      </button>
                      <button className="text-muted-foreground hover:text-card-foreground transition-smooth">
                        Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Documentation;