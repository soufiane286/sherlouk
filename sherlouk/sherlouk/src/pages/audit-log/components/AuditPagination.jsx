import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AuditPagination = ({ 
  currentPage, 
  totalPages, 
  totalEntries, 
  entriesPerPage, 
  onPageChange, 
  onEntriesPerPageChange 
}) => {
  const entriesPerPageOptions = [
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' }
  ];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range?.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots?.push(1, '...');
    } else {
      rangeWithDots?.push(1);
    }

    rangeWithDots?.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots?.push('...', totalPages);
    } else {
      rangeWithDots?.push(totalPages);
    }

    return rangeWithDots;
  };

  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Entries Info */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {startEntry?.toLocaleString()} to {endEntry?.toLocaleString()} of {totalEntries?.toLocaleString()} entries
          </div>
          <div className="w-40">
            <Select
              options={entriesPerPageOptions}
              value={entriesPerPage?.toString()}
              onChange={(value) => onEntriesPerPageChange(parseInt(value))}
            />
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
            iconSize={16}
          >
            <span className="sr-only">Previous page</span>
          </Button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getVisiblePages()?.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-sm text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Page Info */}
          <div className="sm:hidden px-3 py-2 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            iconName="ChevronRight"
            iconSize={16}
          >
            <span className="sr-only">Next page</span>
          </Button>
        </div>

        {/* Quick Jump */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Go to page:</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              iconName="ChevronsLeft"
              iconSize={16}
            >
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              iconName="ChevronsRight"
              iconSize={16}
            >
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditPagination;