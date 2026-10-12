import React from 'react';
import { AdminDashboardPage } from './AdminDashboardPage';
import { OwnerAuthGate } from '../components/OwnerAuthGate';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useApp } from '../context/AppContext';

/**
 * AdminPage component routed at /wearewebora (https://chesshopdiamond.us/wearewebora)
 * Separates authentication gate from the main dashboard to guarantee deterministic hook orders
 * and eliminate post-login blank page issues.
 */
export const AdminPage: React.FC = () => {
  const { isOwnerAuthenticated } = useApp();

  if (!isOwnerAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <OwnerAuthGate
          title="Owner Administration Desk"
          subtitle="Access is restricted solely to the verified website owner. Please authenticate with your username, password, and the dynamic SMS passcode sent to your mobile phone."
        />
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Admin Desk Error">
      <AdminDashboardPage />
    </ErrorBoundary>
  );
};

export default AdminPage;
