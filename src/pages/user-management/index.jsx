import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserTable from './components/UserTable';
import UserCard from './components/UserCard';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import ChangeRoleModal from './components/ChangeRoleModal';
import DeleteUserModal from './components/DeleteUserModal';
import BulkActionsBar from './components/BulkActionsBar';
import UserFilters from './components/UserFilters';
import UserStats from './components/UserStats';

const UserManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock user data
  const mockUsers = [
    {
      id: 1,
      name: "John Anderson",
      email: "john.anderson@sherlouk.com",
      role: "Admin",
      status: "Active",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      email: "sarah.mitchell@sherlouk.com",
      role: "Editor",
      status: "Active",
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      createdAt: "2024-02-20T14:15:00Z"
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      email: "michael.rodriguez@sherlouk.com",
      role: "Viewer",
      status: "Active",
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      createdAt: "2024-03-10T09:45:00Z"
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.chen@sherlouk.com",
      role: "Editor",
      status: "Inactive",
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      createdAt: "2024-01-25T16:20:00Z"
    },
    {
      id: 5,
      name: "David Thompson",
      email: "david.thompson@sherlouk.com",
      role: "Viewer",
      status: "Active",
      lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      createdAt: "2024-04-05T11:30:00Z"
    },
    {
      id: 6,
      name: "Lisa Parker",
      email: "lisa.parker@sherlouk.com",
      role: "Admin",
      status: "Active",
      lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      createdAt: "2024-02-01T13:45:00Z"
    },
    {
      id: 7,
      name: "Robert Wilson",
      email: "robert.wilson@sherlouk.com",
      role: "Viewer",
      status: "Inactive",
      lastLogin: null,
      createdAt: "2024-05-15T08:20:00Z"
    },
    {
      id: 8,
      name: "Jennifer Davis",
      email: "jennifer.davis@sherlouk.com",
      role: "Editor",
      status: "Active",
      lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      createdAt: "2024-03-20T15:10:00Z"
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter(user =>
        user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered?.filter(user => user?.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered?.filter(user => user?.status === statusFilter);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === 'lastLogin') {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const handleCreateUser = async (userData) => {
    const newUser = {
      ...userData,
      id: Math.max(...users?.map(u => u?.id)) + 1,
      createdAt: new Date()?.toISOString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = async (updatedUser) => {
    setUsers(prev => prev?.map(user => 
      user?.id === updatedUser?.id ? updatedUser : user
    ));
  };

  const handleDeleteUser = async (userId) => {
    setUsers(prev => prev?.filter(user => user?.id !== userId));
    setSelectedUsers(prev => prev?.filter(id => id !== userId));
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user?.status === 'Active' ? 'Inactive' : 'Active';
    const updatedUser = { ...user, status: newStatus };
    await handleUpdateUser(updatedUser);
  };

  const handleChangeRole = async (userId, newRole) => {
    const user = users?.find(u => u?.id === userId);
    if (user) {
      const updatedUser = { ...user, role: newRole };
      await handleUpdateUser(updatedUser);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev?.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers?.map(user => user?.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkRoleChange = async (newRole) => {
    const updatedUsers = users?.map(user => 
      selectedUsers?.includes(user?.id) ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    setSelectedUsers([]);
  };

  const handleBulkStatusChange = async (newStatus) => {
    const updatedUsers = users?.map(user => 
      selectedUsers?.includes(user?.id) ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    setSelectedUsers([]);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers?.length} users?`)) {
      setUsers(prev => prev?.filter(user => !selectedUsers?.includes(user?.id)));
      setSelectedUsers([]);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const handleSort = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const openChangeRoleModal = (user) => {
    setSelectedUser(user);
    setChangeRoleModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>User Management - SHERLOUK</title>
        <meta name="description" content="Manage user accounts, roles, and permissions in SHERLOUK system" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          isSidebarOpen={sidebarOpen} 
        />
        
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <main className="lg:ml-64 pt-16">
          <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    iconName="Table"
                    iconSize={16}
                  />
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    iconName="Grid3X3"
                    iconSize={16}
                  />
                </div>
                
                <Button
                  variant="default"
                  onClick={() => setCreateModalOpen(true)}
                  iconName="UserPlus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Create User
                </Button>
              </div>
            </div>

            {/* User Statistics */}
            <UserStats users={users} />

            {/* Filters */}
            <UserFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onClearFilters={handleClearFilters}
            />

            {/* Bulk Actions */}
            <BulkActionsBar
              selectedCount={selectedUsers?.length}
              onBulkRoleChange={handleBulkRoleChange}
              onBulkStatusChange={handleBulkStatusChange}
              onBulkDelete={handleBulkDelete}
              onClearSelection={() => setSelectedUsers([])}
            />

            {/* Users Display */}
            {filteredUsers?.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">No users found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || roleFilter || statusFilter 
                    ? 'Try adjusting your filters to see more results.' :'Get started by creating your first user account.'
                  }
                </p>
                {!searchTerm && !roleFilter && !statusFilter && (
                  <Button
                    variant="default"
                    onClick={() => setCreateModalOpen(true)}
                    iconName="UserPlus"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Create First User
                  </Button>
                )}
              </div>
            ) : viewMode === 'table' ? (
              <UserTable
                users={filteredUsers}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onToggleStatus={handleToggleStatus}
                onChangeRole={openChangeRoleModal}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers?.map((user) => (
                  <UserCard
                    key={user?.id}
                    user={user}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onToggleStatus={handleToggleStatus}
                    onChangeRole={openChangeRoleModal}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Modals */}
        <CreateUserModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreateUser={handleCreateUser}
        />

        <EditUserModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdateUser={handleUpdateUser}
          user={selectedUser}
        />

        <ChangeRoleModal
          isOpen={changeRoleModalOpen}
          onClose={() => setChangeRoleModalOpen(false)}
          onChangeRole={handleChangeRole}
          user={selectedUser}
        />

        <DeleteUserModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDeleteUser={handleDeleteUser}
          user={selectedUser}
        />
      </div>
    </>
  );
};

export default UserManagement;