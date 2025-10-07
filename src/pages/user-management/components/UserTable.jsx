import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserTable = ({ 
  users, 
  selectedUsers, 
  onSelectUser, 
  onSelectAll, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onChangeRole,
  sortBy,
  sortOrder,
  onSort
}) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Editor':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Viewer':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ?'bg-success/10 text-success border-success/20' :'bg-muted text-muted-foreground border-border';
  };

  const formatLastLogin = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const loginDate = new Date(date);
    const diffInHours = Math.floor((now - loginDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return loginDate?.toLocaleDateString();
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      onSort(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(column, 'asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isAllSelected = users?.length > 0 && selectedUsers?.length === users?.length;
  const isIndeterminate = selectedUsers?.length > 0 && selectedUsers?.length < users?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="font-medium text-muted-foreground hover:text-card-foreground"
                  iconName={getSortIcon('name')}
                  iconPosition="right"
                  iconSize={14}
                >
                  Name
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('email')}
                  className="font-medium text-muted-foreground hover:text-card-foreground"
                  iconName={getSortIcon('email')}
                  iconPosition="right"
                  iconSize={14}
                >
                  Email
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('role')}
                  className="font-medium text-muted-foreground hover:text-card-foreground"
                  iconName={getSortIcon('role')}
                  iconPosition="right"
                  iconSize={14}
                >
                  Role
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('status')}
                  className="font-medium text-muted-foreground hover:text-card-foreground"
                  iconName={getSortIcon('status')}
                  iconPosition="right"
                  iconSize={14}
                >
                  Status
                </Button>
              </th>
              <th className="text-left p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('lastLogin')}
                  className="font-medium text-muted-foreground hover:text-card-foreground"
                  iconName={getSortIcon('lastLogin')}
                  iconPosition="right"
                  iconSize={14}
                >
                  Last Login
                </Button>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                <td className="p-4">
                  <Checkbox
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={(e) => onSelectUser(user?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <span className="font-medium text-card-foreground">{user?.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-card-foreground">{user?.email}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRoleColor(user?.role)}`}>
                    {user?.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(user?.status)}`}>
                    {user?.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-muted-foreground">{formatLastLogin(user?.lastLogin)}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      className="h-8 w-8"
                      iconName="Edit"
                      iconSize={14}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onChangeRole(user)}
                      className="h-8 w-8"
                      iconName="Shield"
                      iconSize={14}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleStatus(user)}
                      className={`h-8 w-8 ${user?.status === 'Active' ? 'text-warning hover:text-warning' : 'text-success hover:text-success'}`}
                      iconName={user?.status === 'Active' ? 'UserX' : 'UserCheck'}
                      iconSize={14}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(user)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      iconName="Trash2"
                      iconSize={14}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;