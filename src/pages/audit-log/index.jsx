import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AuditFilters from './components/AuditFilters';
import AuditStats from './components/AuditStats';
import AuditTable from './components/AuditTable';
import AuditPagination from './components/AuditPagination';

const AuditLog = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({
    column: 'timestamp',
    direction: 'desc'
  });
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    user: 'all',
    actionType: 'all',
    resource: 'all',
    search: ''
  });

  // Mock audit log data
  const mockAuditEntries = [
    {
      id: 1,
      timestamp: new Date('2025-10-01T21:45:00'),
      userName: 'Admin User',
      userEmail: 'admin@sherlouk.com',
      actionType: 'table_create',
      resource: 'employees',
      description: 'Created new table "employees" with 5 columns',
      fullDescription: 'User created a new table named "employees" containing columns: id, name, email, department, salary',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_abc123def456',
      requestId: 'req_789xyz012',
      duration: 245,
      status: 'success',
      changes: [
        {
          field: 'table_name',
          oldValue: null,
          newValue: 'employees'
        },
        {
          field: 'columns',
          oldValue: null,
          newValue: 'id, name, email, department, salary'
        }
      ],
      context: {
        tableId: 'tbl_001',
        columnCount: 5,
        initialRows: 0
      }
    },
    {
      id: 2,
      timestamp: new Date('2025-10-01T21:30:00'),
      userName: 'John Doe',
      userEmail: 'john.doe@company.com',
      actionType: 'row_edit',
      resource: 'products',
      description: 'Updated product information for SKU-12345',
      fullDescription: 'User modified product details including price and description for product SKU-12345',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_def456ghi789',
      requestId: 'req_012abc345',
      duration: 156,
      status: 'success',
      changes: [
        {
          field: 'price',
          oldValue: '$29.99',
          newValue: '$34.99'
        },
        {
          field: 'description',
          oldValue: 'Basic product description',
          newValue: 'Enhanced product description with new features'
        }
      ],
      context: {
        productId: 'prod_12345',
        sku: 'SKU-12345',
        category: 'electronics'
      }
    },
    {
      id: 3,
      timestamp: new Date('2025-10-01T21:15:00'),
      userName: 'Jane Smith',
      userEmail: 'jane.smith@company.com',
      actionType: 'user_create',
      resource: 'users',
      description: 'Created new user account for Mike Wilson',
      fullDescription: 'Administrator created a new user account with Editor role for Mike Wilson',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_ghi789jkl012',
      requestId: 'req_345def678',
      duration: 89,
      status: 'success',
      changes: [
        {
          field: 'username',
          oldValue: null,
          newValue: 'mike.wilson'
        },
        {
          field: 'role',
          oldValue: null,
          newValue: 'Editor'
        },
        {
          field: 'email',
          oldValue: null,
          newValue: 'mike.wilson@company.com'
        }
      ],
      context: {
        userId: 'usr_004',
        role: 'Editor',
        department: 'Marketing'
      }
    },
    {
      id: 4,
      timestamp: new Date('2025-10-01T21:00:00'),
      userName: 'Mike Wilson',
      userEmail: 'mike.wilson@company.com',
      actionType: 'login',
      resource: 'system',
      description: 'User logged into the system',
      fullDescription: 'User successfully authenticated and logged into SHERLOUK system',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_jkl012mno345',
      requestId: 'req_678ghi901',
      duration: 34,
      status: 'success',
      changes: [],
      context: {
        loginMethod: 'email_password',
        rememberMe: true
      }
    },
    {
      id: 5,
      timestamp: new Date('2025-10-01T20:45:00'),
      userName: 'Sarah Johnson',
      userEmail: 'sarah.johnson@company.com',
      actionType: 'table_delete',
      resource: 'old_inventory',
      description: 'Deleted table "old_inventory" with confirmation',
      fullDescription: 'User permanently deleted the old_inventory table after confirmation dialog',
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_mno345pqr678',
      requestId: 'req_901jkl234',
      duration: 178,
      status: 'success',
      changes: [
        {
          field: 'table_status',
          oldValue: 'active',
          newValue: 'deleted'
        }
      ],
      context: {
        tableId: 'tbl_old_inv',
        rowCount: 1250,
        confirmationRequired: true
      }
    },
    {
      id: 6,
      timestamp: new Date('2025-10-01T20:30:00'),
      userName: 'Admin User',
      userEmail: 'admin@sherlouk.com',
      actionType: 'row_delete',
      resource: 'customers',
      description: 'Deleted customer record ID: 789',
      fullDescription: 'Administrator removed customer record for inactive account',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_pqr678stu901',
      requestId: 'req_234mno567',
      duration: 67,
      status: 'success',
      changes: [
        {
          field: 'customer_status',
          oldValue: 'inactive',
          newValue: 'deleted'
        }
      ],
      context: {
        customerId: 789,
        reason: 'account_closure',
        dataRetention: false
      }
    },
    {
      id: 7,
      timestamp: new Date('2025-10-01T20:15:00'),
      userName: 'John Doe',
      userEmail: 'john.doe@company.com',
      actionType: 'row_add',
      resource: 'sales',
      description: 'Added new sales record for Q4 2025',
      fullDescription: 'User added a new sales entry for the fourth quarter of 2025',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_stu901vwx234',
      requestId: 'req_567pqr890',
      duration: 123,
      status: 'success',
      changes: [
        {
          field: 'sales_amount',
          oldValue: null,
          newValue: '$15,750.00'
        },
        {
          field: 'quarter',
          oldValue: null,
          newValue: 'Q4 2025'
        }
      ],
      context: {
        salesId: 'sale_q4_001',
        quarter: 'Q4',
        year: 2025
      }
    },
    {
      id: 8,
      timestamp: new Date('2025-10-01T20:00:00'),
      userName: 'Jane Smith',
      userEmail: 'jane.smith@company.com',
      actionType: 'user_edit',
      resource: 'users',
      description: 'Updated user permissions for Sarah Johnson',
      fullDescription: 'Administrator modified user role and permissions for Sarah Johnson',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_vwx234yza567',
      requestId: 'req_890stu123',
      duration: 95,
      status: 'success',
      changes: [
        {
          field: 'role',
          oldValue: 'Viewer',
          newValue: 'Editor'
        },
        {
          field: 'permissions',
          oldValue: 'read_only',
          newValue: 'read_write'
        }
      ],
      context: {
        userId: 'usr_003',
        previousRole: 'Viewer',
        newRole: 'Editor'
      }
    }
  ];

  // Mock statistics
  const mockStats = {
    totalActivities: 1247,
    activeUsers: 12,
    tableOperations: 89,
    securityEvents: 3
  };

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    let filtered = [...mockAuditEntries];

    // Apply filters
    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(entry =>
        entry?.userName?.toLowerCase()?.includes(searchLower) ||
        entry?.userEmail?.toLowerCase()?.includes(searchLower) ||
        entry?.description?.toLowerCase()?.includes(searchLower) ||
        entry?.resource?.toLowerCase()?.includes(searchLower)
      );
    }

    if (filters?.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered?.filter(entry => new Date(entry.timestamp) >= fromDate);
    }

    if (filters?.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate?.setHours(23, 59, 59, 999);
      filtered = filtered?.filter(entry => new Date(entry.timestamp) <= toDate);
    }

    if (filters?.user !== 'all') {
      filtered = filtered?.filter(entry => entry?.userEmail === filters?.user);
    }

    if (filters?.actionType !== 'all') {
      filtered = filtered?.filter(entry => entry?.actionType === filters?.actionType);
    }

    if (filters?.resource !== 'all') {
      filtered = filtered?.filter(entry => entry?.resource === filters?.resource);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.column];
      let bValue = b?.[sortConfig?.column];

      if (sortConfig?.column === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [filters, sortConfig]);

  // Pagination
  const totalEntries = filteredAndSortedEntries?.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEntries = filteredAndSortedEntries?.slice(startIndex, startIndex + entriesPerPage);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    setSortConfig(prev => ({
      column,
      direction: prev?.column === column && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEntriesPerPageChange = (newEntriesPerPage) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1);
  };

  const handleExport = (format) => {
    setLoading(true);
    // Simulate export process
    setTimeout(() => {
      console.log(`Exporting audit logs in ${format} format...`);
      setLoading(false);
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Audit Log - SHERLOUK</title>
        <meta name="description" content="Comprehensive audit logging and activity monitoring for SHERLOUK data management system" />
      </Helmet>

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="lg:ml-64">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />
        
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
                <p className="text-muted-foreground mt-1">
                  Monitor and track all system activities for compliance and security
                </p>
              </div>
            </div>

            {/* Statistics */}
            <AuditStats stats={mockStats} />

            {/* Filters */}
            <AuditFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onExport={handleExport}
              onRefresh={handleRefresh}
            />

            {/* Audit Table */}
            <AuditTable
              entries={paginatedEntries}
              loading={loading}
              onSort={handleSort}
              sortConfig={sortConfig}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <AuditPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalEntries={totalEntries}
                entriesPerPage={entriesPerPage}
                onPageChange={handlePageChange}
                onEntriesPerPageChange={handleEntriesPerPageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLog;