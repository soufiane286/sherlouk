import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: '256-bit encryption'
    },
    {
      icon: 'Lock',
      title: 'Data Protected',
      description: 'End-to-end security'
    },
    {
      icon: 'FileCheck',
      title: 'Audit Trail',
      description: 'Complete activity logs'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name={badge?.icon} size={16} className="text-success" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{badge?.title}</p>
              <p className="text-xs text-muted-foreground">{badge?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustIndicators;