import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Dashboard from '../components/Dashboard/dashboard/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default DashboardPage;