import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentationSearch = ({ onSearchResults, onSectionSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock search data - in real app this would come from a search index
  const searchableContent = [
    {
      id: 'overview',
      title: 'SHERLOUK Overview',
      content: 'Advanced React web application table management database integration role-based access control',
      category: 'Getting Started'
    },
    {
      id: 'quick-start',
      title: 'Quick Start Guide',
      content: 'Upload CSV file create table import data navigation basics',
      category: 'Getting Started'
    },
    {
      id: 'csv-upload',
      title: 'CSV File Upload',
      content: 'Upload CSV files create tables data parsing validation import',
      category: 'Table Management'
    },
    {
      id: 'table-editing',
      title: 'Editing Tables',
      content: 'Edit table data structure modify rows columns real-time synchronization',
      category: 'Table Management'
    },
    {
      id: 'mysql-setup',
      title: 'MySQL Database Setup',
      content: 'MySQL database configuration connection setup credentials SSL security',
      category: 'Database Integration'
    },
    {
      id: 'connection-config',
      title: 'Connection Configuration',
      content: 'Database connection settings environment variables configuration',
      category: 'Database Integration'
    },
    {
      id: 'user-roles',
      title: 'User Roles & Permissions',
      content: 'Viewer Editor Admin roles permissions access control security',
      category: 'User Management'
    },
    {
      id: 'common-issues',
      title: 'Common Issues & Solutions',
      content: 'Troubleshooting CSV upload database connection performance problems',
      category: 'Troubleshooting'
    }
  ];

  const popularSearches = [
    'CSV upload',
    'Database connection',
    'User permissions',
    'Export data',
    'MySQL setup',
    'Troubleshooting'
  ];

  useEffect(() => {
    if (searchQuery?.trim()?.length > 0) {
      setIsSearching(true);
      
      // Simulate search delay
      const searchTimeout = setTimeout(() => {
        const results = searchableContent?.filter(item => 
          item?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          item?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )?.slice(0, 6); // Limit to 6 results
        
        setSearchResults(results);
        setIsSearching(false);
        setShowResults(true);
        
        if (onSearchResults) {
          onSearchResults(results);
        }
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  }, [searchQuery, onSearchResults]);

  const handleSearchSelect = (result) => {
    setSearchQuery(result?.title);
    setShowResults(false);
    if (onSectionSelect) {
      onSectionSelect(result?.id);
    }
  };

  const handlePopularSearch = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const highlightText = (text, query) => {
    if (!query?.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="Search" size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-lg text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon name="X" size={18} className="text-muted-foreground hover:text-card-foreground transition-smooth" />
          </button>
        )}
      </div>
      {/* Search Results Dropdown */}
      {showResults && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowResults(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg elevation-2 z-50 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Searching...</span>
                </div>
              </div>
            ) : searchResults?.length > 0 ? (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
                  Search Results ({searchResults?.length})
                </div>
                {searchResults?.map((result) => (
                  <button
                    key={result?.id}
                    onClick={() => handleSearchSelect(result)}
                    className="w-full text-left px-3 py-3 hover:bg-muted rounded-lg transition-smooth group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon name="FileText" size={14} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-popover-foreground group-hover:text-primary transition-smooth">
                          {highlightText(result?.title, searchQuery)}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {highlightText(result?.content?.substring(0, 100) + '...', searchQuery)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                            {result?.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  No results found for "{searchQuery}"
                </p>
                <div className="text-xs text-muted-foreground">
                  Try searching for: table, database, user, or export
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {/* Popular Searches */}
      {!searchQuery && (
        <div className="mt-4">
          <div className="text-sm font-medium text-card-foreground mb-3">Popular searches:</div>
          <div className="flex flex-wrap gap-2">
            {popularSearches?.map((search) => (
              <Button
                key={search}
                variant="outline"
                size="sm"
                onClick={() => handlePopularSearch(search)}
                className="text-xs"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationSearch;