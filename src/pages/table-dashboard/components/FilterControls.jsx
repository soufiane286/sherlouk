import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterControls = ({ onSearch, onSort, onFilter, searchQuery, sortBy, filterBy }) => {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)', icon: 'ArrowUp' },
    { value: 'name-desc', label: 'Name (Z-A)', icon: 'ArrowDown' },
    { value: 'modified-desc', label: 'Recently Modified', icon: 'Clock' },
    { value: 'modified-asc', label: 'Oldest Modified', icon: 'Clock' },
    { value: 'rows-desc', label: 'Most Rows', icon: 'BarChart3' },
    { value: 'rows-asc', label: 'Least Rows', icon: 'BarChart3' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Tables', icon: 'Table' },
    { value: 'synced', label: 'Synced Only', icon: 'CheckCircle' },
    { value: 'syncing', label: 'Syncing', icon: 'RefreshCw' },
    { value: 'error', label: 'Sync Errors', icon: 'AlertCircle' },
    { value: 'offline', label: 'Offline', icon: 'WifiOff' }
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions?.find(opt => opt?.value === sortBy);
    return option ? option?.label : 'Sort';
  };

  const getCurrentFilterLabel = () => {
    const option = filterOptions?.find(opt => opt?.value === filterBy);
    return option ? option?.label : 'Filter';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => onSearch(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              iconName="ArrowUpDown"
              iconPosition="left"
              iconSize={14}
            >
              {getCurrentSortLabel()}
            </Button>

            {showFilters && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowFilters(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg elevation-2 z-50 glass-morphism">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Sort By
                    </div>
                    {sortOptions?.map((option) => (
                      <button
                        key={option?.value}
                        onClick={() => {
                          onSort(option?.value);
                          setShowFilters(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-smooth
                          ${sortBy === option?.value 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-popover-foreground hover:bg-muted'
                          }
                        `}
                      >
                        <Icon name={option?.icon} size={16} />
                        {option?.label}
                      </button>
                    ))}
                    
                    <div className="my-2 border-t border-border" />
                    
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Filter By Status
                    </div>
                    {filterOptions?.map((option) => (
                      <button
                        key={option?.value}
                        onClick={() => {
                          onFilter(option?.value);
                          setShowFilters(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-smooth
                          ${filterBy === option?.value 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-popover-foreground hover:bg-muted'
                          }
                        `}
                      >
                        <Icon name={option?.icon} size={16} />
                        {option?.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Clear Filters */}
          {(searchQuery || sortBy !== 'modified-desc' || filterBy !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearch('');
                onSort('modified-desc');
                onFilter('all');
              }}
              iconName="X"
              iconSize={14}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Active Filters Display */}
      {(searchQuery || filterBy !== 'all') && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
              <Icon name="Search" size={12} />
              <span>"{searchQuery}"</span>
              <button
                onClick={() => onSearch('')}
                className="ml-1 hover:text-destructive"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          {filterBy !== 'all' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
              <Icon name="Filter" size={12} />
              <span>{getCurrentFilterLabel()}</span>
              <button
                onClick={() => onFilter('all')}
                className="ml-1 hover:text-destructive"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;