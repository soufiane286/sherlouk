import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TableCard from './components/TableCard';
import NewTableButton from './components/NewTableButton';
import FilterControls from './components/FilterControls';
import ConfirmationDialog from './components/ConfirmationDialog';
import ExportDialog from './components/ExportDialog';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TableDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('modified-desc');
  const [filterBy, setFilterBy] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [exportDialog, setExportDialog] = useState({ isOpen: false });
  const [userRole] = useState('Admin'); // Mock user role

  // Mock tables data
  const [tables, setTables] = useState([
    {
      id: 1,
      name: "Customer Database",
      rowCount: 15420,
      lastModified: "2025-09-30T14:30:00Z",
      syncStatus: "synced",
      createdBy: "John Smith",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "Sales Report Q3 2025",
      rowCount: 8750,
      lastModified: "2025-09-29T09:15:00Z",
      syncStatus: "syncing",
      createdBy: "Sarah Johnson",
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Product Inventory",
      rowCount: 3200,
      lastModified: "2025-09-28T16:45:00Z",
      syncStatus: "error",
      createdBy: "Mike Davis",
      size: "890 KB"
    },
    {
      id: 4,
      name: "Employee Records",
      rowCount: 245,
      lastModified: "2025-09-27T11:20:00Z",
      syncStatus: "synced",
      createdBy: "Lisa Chen",
      size: "156 KB"
    },
    {
      id: 5,
      name: "Marketing Campaigns",
      rowCount: 1850,
      lastModified: "2025-09-26T13:10:00Z",
      syncStatus: "offline",
      createdBy: "Tom Wilson",
      size: "445 KB"
    },
    {
      id: 6,
      name: "Financial Transactions",
      rowCount: 25600,
      lastModified: "2025-09-25T08:30:00Z",
      syncStatus: "synced",
      createdBy: "Emma Brown",
      size: "4.2 MB"
    }
  ]);

  // Filter and sort tables
  const filteredTables = tables?.filter(table => {
      const matchesSearch = table?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesFilter = filterBy === 'all' || table?.syncStatus === filterBy;
      return matchesSearch && matchesFilter;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a?.name?.localeCompare(b?.name);
        case 'name-desc':
          return b?.name?.localeCompare(a?.name);
        case 'modified-asc':
          return new Date(a.lastModified) - new Date(b.lastModified);
        case 'modified-desc':
          return new Date(b.lastModified) - new Date(a.lastModified);
        case 'rows-asc':
          return a?.rowCount - b?.rowCount;
        case 'rows-desc':
          return b?.rowCount - a?.rowCount;
        default:
          return 0;
      }
    });

  const handleEditTable = (tableId) => {
    navigate(`/table-editor?id=${tableId}`);
  };

  const handleCloneTable = (tableId) => {
    const table = tables?.find(t => t?.id === tableId);
    if (table) {
      setConfirmDialog({
        isOpen: true,
        type: 'info',
        title: 'Clone Table',
        message: `Create a copy of this table with all its data and structure?`,
        tableName: table?.name,
        confirmText: 'Clone Table',
        onConfirm: () => {
          const newTable = {
            ...table,
            id: Date.now(),
            name: `${table?.name} (Copy)`,
            lastModified: new Date()?.toISOString(),
            syncStatus: 'offline'
          };
          setTables(prev => [newTable, ...prev]);
          setConfirmDialog({ isOpen: false });
        }
      });
    }
  };

  const handleExportTable = (tableId) => {
    const table = tables?.find(t => t?.id === tableId);
    if (table) {
      setExportDialog({
        isOpen: true,
        tableName: table?.name,
        onExport: async (options) => {
          // Mock export functionality
          console.log('Exporting table:', table?.name, 'with options:', options);
          // Simulate export delay
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      });
    }
  };

  const handleDeleteTable = (tableId) => {
    const table = tables?.find(t => t?.id === tableId);
    if (table) {
      setConfirmDialog({
        isOpen: true,
        type: 'delete',
        title: 'Delete Table',
        message: `Are you sure you want to delete this table? This will permanently remove all ${table?.rowCount?.toLocaleString()} rows of data.`,
        tableName: table?.name,
        confirmText: 'Delete Table',
        onConfirm: () => {
          setTables(prev => prev?.filter(t => t?.id !== tableId));
          setConfirmDialog({ isOpen: false });
        }
      });
    }
  };

  const handleFileUpload = (file) => {
    // Mock file upload
    const newTable = {
      id: Date.now(),
      name: file?.name?.replace('.csv', ''),
      rowCount: Math.floor(Math.random() * 10000) + 100,
      lastModified: new Date()?.toISOString(),
      syncStatus: 'syncing',
      createdBy: 'Current User',
      size: `${(file?.size / 1024)?.toFixed(0)} KB`
    };
    
    setTables(prev => [newTable, ...prev]);
    
    // Simulate processing
    setTimeout(() => {
      setTables(prev => prev?.map(t => 
        t?.id === newTable?.id 
          ? { ...t, syncStatus: 'synced' }
          : t
      ));
    }, 3000);
  };

  const getStatsData = () => {
    const totalTables = tables?.length;
    const totalRows = tables?.reduce((sum, table) => sum + table?.rowCount, 0);
    const syncedTables = tables?.filter(t => t?.syncStatus === 'synced')?.length;
    const errorTables = tables?.filter(t => t?.syncStatus === 'error')?.length;

    return { totalTables, totalRows, syncedTables, errorTables };
  };

  const stats = getStatsData();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Table Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage and organize your data tables with powerful tools
          </p>
        </div>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/audit-log')}
            iconName="FileText"
            iconPosition="left"
            iconSize={16}
            className="hover:shadow-md transition-all duration-200"
          >
            View Audit Log
          </Button>
          <Button
            onClick={() => navigate('/database-integration')}
            iconName="Database"
            iconPosition="left"
            iconSize={16}
            className="hover:shadow-md transition-all duration-200 bg-gradient-to-r from-primary to-primary/90"
          >
            Database Settings
          </Button>
        </motion.div>
      </motion.div>
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
              <Icon name="Table" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-card-foreground">
                {stats?.totalTables}
              </p>
              <p className="text-sm text-muted-foreground font-medium">Total Tables</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl group-hover:from-accent/30 group-hover:to-accent/20 transition-all duration-300">
              <Icon name="BarChart3" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold text-card-foreground">
                {stats?.totalRows?.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground font-medium">Total Rows</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-success/20 to-success/10 rounded-xl group-hover:from-success/30 group-hover:to-success/20 transition-all duration-300">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
            <div>
              <p className="text-3xl font-bold text-card-foreground">
                {stats?.syncedTables}
              </p>
              <p className="text-sm text-muted-foreground font-medium">Synced</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-error/20 to-error/10 rounded-xl group-hover:from-error/30 group-hover:to-error/20 transition-all duration-300">
              <Icon name="AlertCircle" size={24} className="text-error" />
            </div>
            <div>
              <p className="text-3xl font-bold text-card-foreground">
                {stats?.errorTables}
              </p>
              <p className="text-sm text-muted-foreground font-medium">Errors</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <FilterControls
          onSearch={setSearchQuery}
          onSort={setSortBy}
          onFilter={setFilterBy}
          searchQuery={searchQuery}
          sortBy={sortBy}
          filterBy={filterBy}
        />
      </motion.div>
      {/* Tables Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* New Table Button */}
        <motion.div variants={itemVariants}>
          <NewTableButton 
            onFileUpload={handleFileUpload}
            userRole={userRole}
          />
        </motion.div>

        {/* Table Cards */}
        {filteredTables?.map((table, index) => (
          <motion.div
            key={table?.id}
            variants={itemVariants}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <TableCard
              table={table}
              onEdit={handleEditTable}
              onClone={handleCloneTable}
              onExport={handleExportTable}
              onDelete={handleDeleteTable}
              userRole={userRole}
            />
          </motion.div>
        ))}
      </motion.div>
      {/* Empty State */}
      {filteredTables?.length === 0 && searchQuery && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mb-6">
            <Icon name="Search" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            No tables found
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            No tables match your search criteria "{searchQuery}". Try adjusting your filters or search terms.
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery('')}
            className="hover:shadow-md transition-all duration-200"
          >
            Clear Search
          </Button>
        </motion.div>
      )}
      {/* No Tables State */}
      {tables?.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-6">
            <Icon name="Table" size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            No tables yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Upload your first CSV file to get started with table management and data organization.
          </p>
        </motion.div>
      )}
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog?.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog?.onConfirm}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmText={confirmDialog?.confirmText}
        type={confirmDialog?.type}
        tableName={confirmDialog?.tableName}
      />
      {/* Export Dialog */}
      <ExportDialog
        isOpen={exportDialog?.isOpen}
        onClose={() => setExportDialog({ isOpen: false })}
        onExport={exportDialog?.onExport}
        tableName={exportDialog?.tableName}
      />
    </div>
  );
};

export default TableDashboard;