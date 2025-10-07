import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserCard = ({ user, onEdit, onDelete, onToggleStatus, onChangeRole }) => {
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

  return (
    <div className="bg-card border border-border rounded-lg p-4 elevation-1">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(user)}
            className="h-8 w-8"
            iconName="Edit"
            iconSize={16}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(user)}
            className="h-8 w-8 text-destructive hover:text-destructive"
            iconName="Trash2"
            iconSize={16}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Role:</span>
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getRoleColor(user?.role)}`}>
            {user?.role}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(user?.status)}`}>
            {user?.status}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Login:</span>
          <span className="text-sm text-card-foreground">{formatLastLogin(user?.lastLogin)}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChangeRole(user)}
          className="flex-1"
          iconName="Shield"
          iconPosition="left"
          iconSize={14}
        >
          Change Role
        </Button>
        <Button
          variant={user?.status === 'Active' ? 'secondary' : 'success'}
          size="sm"
          onClick={() => onToggleStatus(user)}
          className="flex-1"
          iconName={user?.status === 'Active' ? 'UserX' : 'UserCheck'}
          iconPosition="left"
          iconSize={14}
        >
          {user?.status === 'Active' ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </div>
  );
};

export default UserCard;