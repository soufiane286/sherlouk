import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const RegisterLink = () => {
  return (
    <div className="mt-8 pt-6 border-t border-border text-center">
      <p className="text-sm text-muted-foreground mb-4">
        Don't have an account yet?
      </p>
      
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Icon name="UserPlus" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">New to SHERLOUK?</span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          Create your account to start managing tables and data with advanced permissions and audit trails.
        </p>
        
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
        >
          <Icon name="ArrowRight" size={14} />
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default RegisterLink;