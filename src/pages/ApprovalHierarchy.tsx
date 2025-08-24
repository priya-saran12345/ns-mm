import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import ApprovalHierarchy from '../components/Dashboard/Master/ApprovalHierarchy';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <ApprovalHierarchy />
    </MainLayout>
  );
};

export default DashboardPage;