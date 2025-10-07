import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { ToastProvider } from "components/ui/Toast";
import MainLayout from "components/MainLayout";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import Documentation from './pages/documentation';
import UserManagement from './pages/user-management';
import TableDashboard from './pages/table-dashboard';
import TableEditor from './pages/table-editor';
import DatabaseIntegration from './pages/database-integration';
import AuditLog from './pages/audit-log';
import TableCreation from './pages/table-creation';

const Routes = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<MainLayout><TableDashboard /></MainLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/documentation" element={<MainLayout><Documentation /></MainLayout>} />
            <Route path="/user-management" element={<MainLayout><UserManagement /></MainLayout>} />
            <Route path="/table-dashboard" element={<MainLayout><TableDashboard /></MainLayout>} />
            <Route path="/table-editor" element={<MainLayout><TableEditor /></MainLayout>} />
            <Route path="/database-integration" element={<MainLayout><DatabaseIntegration /></MainLayout>} />
            <Route path="/audit-log" element={<MainLayout><AuditLog /></MainLayout>} />
            <Route path="/table-creation" element={<MainLayout><TableCreation /></MainLayout>} />
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </RouterRoutes>
        </ErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default Routes;