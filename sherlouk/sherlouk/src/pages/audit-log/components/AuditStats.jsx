import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Activities',
      value: stats?.totalActivities,
      icon: 'Activity',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers,
      icon: 'Users',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Table Operations',
      value: stats?.tableOperations,
      icon: 'Table',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Security Events',
      value: stats?.securityEvents,
      icon: 'Shield',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-2%',
      changeType: 'negative'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
            <div className={`text-sm font-medium ${
              stat?.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat?.change}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-card-foreground">
              {stat?.value?.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {stat?.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditStats;