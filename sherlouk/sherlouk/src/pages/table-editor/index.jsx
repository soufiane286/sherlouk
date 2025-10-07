import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import TableToolbar from './components/TableToolbar';
import DataTable from './components/DataTable';
import TablePagination from './components/TablePagination';
import SyncStatusIndicator from './components/SyncStatusIndicator';
import ConfirmationDialog from './components/ConfirmationDialog';
import AddRowDialog from './components/AddRowDialog';

const TableEditor = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingCell, setEditingCell] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [addRowDialog, setAddRowDialog] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [pendingChanges, setPendingChanges] = useState(0);
  const [lastSync, setLastSync] = useState(new Date()?.toISOString());

  // Mock table data
  const mockTableData = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    position: "Senior Developer",
    salary: "$95,000",
    startDate: "2022-03-15",
    status: "Active",
    phone: "+1 (555) 123-4567"
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    salary: "$78,000",
    startDate: "2021-08-22",
    status: "Active",
    phone: "+1 (555) 234-5678"
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@company.com",
    department: "Engineering",
    position: "Frontend Developer",
    salary: "$82,000",
    startDate: "2023-01-10",
    status: "Active",
    phone: "+1 (555) 345-6789"
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@company.com",
    department: "HR",
    position: "HR Specialist",
    salary: "$65,000",
    startDate: "2022-11-05",
    status: "Active",
    phone: "+1 (555) 456-7890"
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@company.com",
    department: "Sales",
    position: "Sales Representative",
    salary: "$58,000",
    startDate: "2023-06-18",
    status: "Active",
    phone: "+1 (555) 567-8901"
  },
  {
    id: 6,
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@company.com",
    department: "Finance",
    position: "Financial Analyst",
    salary: "$72,000",
    startDate: "2021-12-03",
    status: "Active",
    phone: "+1 (555) 678-9012"
  },
  {
    id: 7,
    firstName: "Robert",
    lastName: "Taylor",
    email: "robert.taylor@company.com",
    department: "Engineering",
    position: "DevOps Engineer",
    salary: "$88,000",
    startDate: "2022-07-14",
    status: "Inactive",
    phone: "+1 (555) 789-0123"
  },
  {
    id: 8,
    firstName: "Jennifer",
    lastName: "Brown",
    email: "jennifer.brown@company.com",
    department: "Design",
    position: "UX Designer",
    salary: "$75,000",
    startDate: "2023-02-28",
    status: "Active",
    phone: "+1 (555) 890-1234"
  }];


  const tableColumns = [
  { key: 'firstName', label: 'First Name', type: 'text', required: true },
  { key: 'lastName', label: 'Last Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'department', label: 'Department', type: 'text', required: true },
  { key: 'position', label: 'Position', type: 'text', required: true },
  { key: 'salary', label: 'Salary', type: 'text' },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'status', label: 'Status', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'tel' }];


  const [tableData, setTableData] = useState(mockTableData);

  // Initialize visible columns
  useEffect(() => {
    setVisibleColumns(tableColumns?.map((col) => col?.key));
  }, []);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = tableData?.filter((row) =>
    Object.values(row)?.some((value) =>
    value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
    );

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        const aValue = a?.[sortConfig?.key] || '';
        const bValue = b?.[sortConfig?.key] || '';

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [tableData, searchTerm, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  // Handlers
  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRowSelect = (rowId) => {
    setSelectedRows((prev) =>
    prev?.includes(rowId) ?
    prev?.filter((id) => id !== rowId) :
    [...prev, rowId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows?.length === paginatedData?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData?.map((row) => row?.id));
    }
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  const handleCellEdit = (rowId, columnKey, newValue) => {
    setTableData((prev) =>
    prev?.map((row) =>
    row?.id === rowId ? { ...row, [columnKey]: newValue } : row
    )
    );
    setPendingChanges((prev) => prev + 1);
    setSyncStatus('pending');
  };

  const handleRowEdit = (rowId) => {
    console.log('Edit row:', rowId);
    // Implement row edit functionality
  };

  const handleRowDelete = (rowId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Row',
      message: 'Are you sure you want to delete this row? This action cannot be undone.',
      type: 'danger',
      onConfirm: () => confirmRowDelete(rowId)
    });
  };

  const confirmRowDelete = (rowId) => {
    setTableData((prev) => prev?.filter((row) => row?.id !== rowId));
    setSelectedRows((prev) => prev?.filter((id) => id !== rowId));
    setPendingChanges((prev) => prev + 1);
    setSyncStatus('pending');
    setConfirmDialog({ isOpen: false });
  };

  const handleRowClone = (rowId) => {
    const rowToClone = tableData?.find((row) => row?.id === rowId);
    if (rowToClone) {
      const newRow = {
        ...rowToClone,
        id: Math.max(...tableData?.map((r) => r?.id)) + 1,
        firstName: `${rowToClone?.firstName} (Copy)`,
        email: `copy.${rowToClone?.email}`
      };
      setTableData((prev) => [...prev, newRow]);
      setPendingChanges((prev) => prev + 1);
      setSyncStatus('pending');
    }
  };

  const handleDeleteSelected = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Selected Rows',
      message: `Are you sure you want to delete ${selectedRows?.length} selected rows? This action cannot be undone.`,
      type: 'danger',
      onConfirm: () => confirmDeleteSelected()
    });
  };

  const confirmDeleteSelected = () => {
    setTableData((prev) => prev?.filter((row) => !selectedRows?.includes(row?.id)));
    setPendingChanges((prev) => prev + selectedRows?.length);
    setSyncStatus('pending');
    setSelectedRows([]);
    setConfirmDialog({ isOpen: false });
  };

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
    // Implement export functionality
  };

  const handleAddRow = () => {
    setAddRowDialog(true);
  };

  const handleAddRowSubmit = (formData) => {
    const newRow = {
      ...formData,
      id: Math.max(...tableData?.map((r) => r?.id)) + 1
    };
    setTableData((prev) => [...prev, newRow]);
    setPendingChanges((prev) => prev + 1);
    setSyncStatus('pending');
    setAddRowDialog(false);
  };

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns((prev) =>
    prev?.includes(columnKey) ?
    prev?.filter((key) => key !== columnKey) :
    [...prev, columnKey]
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Simulate sync process
  useEffect(() => {
    if (pendingChanges > 0 && syncStatus === 'pending') {
      const timer = setTimeout(() => {
        setSyncStatus('syncing');
        setTimeout(() => {
          setSyncStatus('synced');
          setPendingChanges(0);
          setLastSync(new Date()?.toISOString());
        }, 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pendingChanges, syncStatus]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.key === 'Delete' && selectedRows?.length > 0) {
        e?.preventDefault();
        handleDeleteSelected();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedRows]);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleMenuToggle} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <main className="lg:ml-64 ml-0 pt-0">
        <div className="p-0">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Table Editor</h1>
            <p className="text-muted-foreground">
              Edit and manage your table data with real-time database synchronization
            </p>
          </div>

          <SyncStatusIndicator
            status={syncStatus}
            lastSync={lastSync}
            pendingChanges={pendingChanges} />


          <TableToolbar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedRows={selectedRows}
            onSelectAll={handleSelectAll}
            totalRows={paginatedData?.length}
            onExport={handleExport}
            onAddRow={handleAddRow}
            onDeleteSelected={handleDeleteSelected}
            onColumnToggle={handleColumnToggle}
            visibleColumns={visibleColumns}
            allColumns={tableColumns} />


          <DataTable
            data={paginatedData}
            columns={tableColumns}
            visibleColumns={visibleColumns}
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onRowEdit={handleRowEdit}
            onRowDelete={handleRowDelete}
            onRowClone={handleRowClone}
            onCellEdit={handleCellEdit}
            sortConfig={sortConfig}
            onSort={handleSort}
            editingCell={editingCell}
            setEditingCell={setEditingCell} />


          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData?.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange} />

        </div>
      </main>
      <ConfirmationDialog
        isOpen={confirmDialog?.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog?.onConfirm}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        type={confirmDialog?.type}
        confirmText="Delete"
        cancelText="Cancel" />

      <AddRowDialog
        isOpen={addRowDialog}
        onClose={() => setAddRowDialog(false)}
        onAdd={handleAddRowSubmit}
        columns={tableColumns} />

    </div>);

};

export default TableEditor;