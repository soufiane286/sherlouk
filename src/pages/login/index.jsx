import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import TrustIndicators from './components/TrustIndicators';
import CredentialsHelper from './components/CredentialsHelper';
import RegisterLink from './components/RegisterLink';
import Icon from '../../components/AppIcon';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/table-dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">S</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold">SHERLOUK</h1>
                  <p className="text-primary-foreground/80 text-lg">Data Management Platform</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">
                Advanced Table Management with Database Integration
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    <Icon name="Upload" size={16} className="text-primary-foreground" />
                  </div>
                  <span>CSV upload and export capabilities</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    <Icon name="Users" size={16} className="text-primary-foreground" />
                  </div>
                  <span>Role-based access control system</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    <Icon name="Database" size={16} className="text-primary-foreground" />
                  </div>
                  <span>Real-time MySQL database synchronization</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    <Icon name="FileText" size={16} className="text-primary-foreground" />
                  </div>
                  <span>Comprehensive audit logging</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-primary-foreground/20">
              <p className="text-sm text-primary-foreground/60">
                Trusted by data analysts, database administrators, and team managers worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">S</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">SHERLOUK</h1>
                  <p className="text-sm text-muted-foreground">Data Management</p>
                </div>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in to your account to access the table management system
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Demo Credentials Helper */}
            <CredentialsHelper />

            {/* Trust Indicators */}
            <TrustIndicators />

            {/* Register Link */}
            <RegisterLink />

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} SHERLOUK. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;