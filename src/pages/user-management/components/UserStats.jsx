import React from 'react';
import Icon from '../../../components/AppIcon';

const UserStats = ({ users }) => {
  const stats = {
    total: users?.length,
    active: users?.filter(user => user?.status === 'Active')?.length,
    inactive: users?.filter(user => user?.status === 'Inactive')?.length,
    admins: users?.filter(user => user?.role === 'Admin')?.length,
    editors: users?.filter(user => user?.role === 'Editor')?.length,
    viewers: users?.filter(user => user?.role === 'Viewer')?.length
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.total,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Active Users',
      value: stats?.active,
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Inactive Users',
      value: stats?.inactive,
      icon: 'UserX',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    },
    {
      label: 'Administrators',
      value: stats?.admins,
      icon: 'ShieldCheck',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      label: 'Editors',
      value: stats?.editors,
      icon: 'Edit',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Viewers',
      value: stats?.viewers,
      icon: 'Eye',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 elevation-1">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{stat?.value}</p>
              <p className="text-sm text-muted-foreground">{stat?.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;